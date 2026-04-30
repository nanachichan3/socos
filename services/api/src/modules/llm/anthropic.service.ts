/**
 * Anthropic Service — Direct Anthropic Claude API integration
 *
 * This service provides direct access to Anthropic's Claude models
 * using the Messages API (https://docs.anthropic.com/en/api/messages).
 *
 * Environment variables:
 *   ANTHROPIC_API_KEY — Your Anthropic API key (required)
 *   ANTHROPIC_MODEL   — Model to use (default: "claude-sonnet-4-20250514")
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface AnthropicCompletionOptions {
  maxTokens?: number;
  temperature?: number;
  model?: string;
  system?: string;
}

@Injectable()
export class AnthropicService {
  private readonly baseUrl = 'https://api.anthropic.com/v1';
  private readonly defaultModel = 'claude-sonnet-4-20250514';
  private readonly apiVersion = '2023-06-01';

  constructor(private readonly configService: ConfigService) {}

  /**
   * Check whether Anthropic is configured (has an API key).
   */
  get isConfigured(): boolean {
    return !!this.configService.get<string>('ANTHROPIC_API_KEY');
  }

  /**
   * Get the configured model or the default.
   */
  private getModel(options: AnthropicCompletionOptions): string {
    return options.model ?? this.defaultModel;
  }

  /**
   * Get the max tokens setting.
   */
  private getMaxTokens(options: AnthropicCompletionOptions): number {
    return options.maxTokens ?? 1024;
  }

  /**
   * Get the temperature setting.
   */
  private getTemperature(options: AnthropicCompletionOptions): number {
    return options.temperature ?? 0.7;
  }

  /**
   * Call Claude via the Anthropic Messages API.
   * Returns the response text, or null on failure / missing config.
   */
  async complete(
    prompt: string,
    options: AnthropicCompletionOptions = {},
  ): Promise<string | null> {
    const apiKey = this.configService.get<string>('ANTHROPIC_API_KEY');

    if (!apiKey) {
      console.log('[AnthropicService] No ANTHROPIC_API_KEY configured — skipping Anthropic call');
      return null;
    }

    const model = this.getModel(options);
    const maxTokens = this.getMaxTokens(options);
    const temperature = this.getTemperature(options);

    // Build messages array
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [];

    if (options.system) {
      messages.push({ role: 'assistant', content: options.system });
    }

    messages.push({ role: 'user', content: prompt });

    try {
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': this.apiVersion,
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          temperature,
          messages,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[AnthropicService] Anthropic API error (${response.status}):`, errorText);
        return null;
      }

      const data = (await response.json()) as {
        content?: Array<{ type: string; text?: string }>;
      };

      // Extract text from the response content blocks
      const textContent = data?.content?.find((block) => block.type === 'text');
      return textContent?.text?.trim() ?? null;
    } catch (error) {
      console.error(
        '[AnthropicService] Anthropic API request failed:',
        error instanceof Error ? error.message : error,
      );
      return null;
    }
  }
}
