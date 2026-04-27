/**
 * LLM Service — Unified AI access via OpenRouter (OpenAI-compatible API)
 *
 * Replaces direct Anthropic SDK usage across all services.
 * OpenRouter supports OpenAI-compatible chat completions endpoint.
 * https://openrouter.ai/docs
 *
 * Environment variables:
 *   OPENROUTER_API_KEY   — Your OpenRouter API key
 *   OPENROUTER_MODEL     — Model override (default: "anthropic/claude-sonnet-4")
 *   OPENROUTER_BASE_URL  — API base URL override (default: "https://openrouter.ai/api/v1")
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface LlmCompletionOptions {
  maxTokens?: number;
  temperature?: number;
  model?: string;
  system?: string;
}

@Injectable()
export class LlmService {
  private readonly baseUrl: string;
  private readonly defaultModel: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl =
      this.configService.get<string>('OPENROUTER_BASE_URL') ??
      'https://openrouter.ai/api/v1';
    this.defaultModel =
      this.configService.get<string>('OPENROUTER_MODEL') ??
      'anthropic/claude-sonnet-4';
  }

  /**
   * Check whether OpenRouter is configured (has an API key).
   */
  get isConfigured(): boolean {
    return !!this.configService.get<string>('OPENROUTER_API_KEY');
  }

  /**
   * Call the LLM via OpenRouter (OpenAI-compatible chat completions).
   * Returns the response text, or null on failure / missing config.
   */
  async complete(
    prompt: string,
    options: LlmCompletionOptions = {},
  ): Promise<string | null> {
    const apiKey = this.configService.get<string>('OPENROUTER_API_KEY');

    if (!apiKey) {
      console.log('[LlmService] No OPENROUTER_API_KEY configured — skipping LLM call');
      return null;
    }

    const model = options.model ?? this.defaultModel;
    const maxTokens = options.maxTokens ?? 512;
    const temperature = options.temperature ?? 0.7;

    const body: Record<string, unknown> = {
      model,
      max_tokens: maxTokens,
      temperature,
      messages: [{ role: 'user', content: prompt }],
    };

    if (options.system) {
      body.messages = [
        { role: 'system', content: options.system },
        { role: 'user', content: prompt },
      ];
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://socos.app',
          'X-Title': 'SOCOS CRM',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[LlmService] OpenRouter API error (${response.status}):`, errorText);
        return null;
      }

      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string | null } }>;
      };

      const content = data?.choices?.[0]?.message?.content?.trim();
      return content ?? null;
    } catch (error) {
      console.error(
        '[LlmService] OpenRouter request failed:',
        error instanceof Error ? error.message : error,
      );
      return null;
    }
  }
}