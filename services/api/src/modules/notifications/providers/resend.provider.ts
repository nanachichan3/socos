/**
 * Resend Email Provider
 *
 * Resend is a modern email API that's simple to use.
 * Website: https://resend.com
 *
 * Environment Variables Required:
 * - RESEND_API_KEY: Your Resend API key
 * - RESEND_FROM_EMAIL: Default from email (e.g., SOCOS <noreply@socos.app>)
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  EmailOptions,
  NotificationResult,
} from '../notifications/types.js';

@Injectable()
export class ResendEmailProvider {
  private apiKey: string;
  private fromEmail: string;
  private baseUrl = 'https://api.resend.com/emails';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('RESEND_API_KEY') || '';
    this.fromEmail =
      this.configService.get<string>('RESEND_FROM_EMAIL') || 'SOCOS <noreply@socos.app>';
  }

  /**
   * Send an email via Resend
   */
  async send(options: EmailOptions): Promise<NotificationResult> {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'RESEND_API_KEY not configured',
        provider: 'resend',
        sentAt: new Date(),
      };
    }

    try {
      const payload = {
        from: options.from || this.fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        reply_to: options.replyTo,
        attachments: options.attachments,
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.text();
        return {
          success: false,
          error: `Resend API error: ${error}`,
          provider: 'resend',
          sentAt: new Date(),
        };
      }

      const data = await response.json() as { id?: string; error?: string };

      return {
        success: true,
        messageId: data.id,
        provider: 'resend',
        sentAt: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: 'resend',
        sentAt: new Date(),
      };
    }
  }

  /**
   * Send batch emails (up to 100 recipients)
   */
  async sendBatch(emails: EmailOptions[]): Promise<NotificationResult[]> {
    if (!this.apiKey) {
      return emails.map(() => ({
        success: false,
        error: 'RESEND_API_KEY not configured',
        provider: 'resend',
        sentAt: new Date(),
      }));
    }

    // Resend batch API
    try {
      const response = await fetch(`${this.baseUrl}/batch`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          emails.map((email) => ({
            from: email.from || this.fromEmail,
            to: email.to,
            subject: email.subject,
            html: email.html,
            text: email.text,
          })),
        ),
      });

      if (!response.ok) {
        const error = await response.text();
        return emails.map(() => ({
          success: false,
          error: `Resend batch API error: ${error}`,
          provider: 'resend',
          sentAt: new Date(),
        }));
      }

      const results = await response.json() as Array<{ id?: string; error?: string }>;
      return results.map((r: { id?: string; error?: string }) => ({
        success: !r.error,
        messageId: r.id,
        error: r.error,
        provider: 'resend',
        sentAt: new Date(),
      }));
    } catch (error) {
      return emails.map(() => ({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: 'resend',
        sentAt: new Date(),
      }));
    }
  }

  /**
   * Add/remove email from suppression list
   */
  async suppressEmail(email: string, action: 'suppress' | 'unsuppress' = 'suppress'): Promise<void> {
    if (!this.apiKey) return;

    await fetch(`${this.baseUrl}/suppressions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        [action === 'suppress' ? 'suppressed' : 'unsuppressed']: true,
      }),
    });
  }
}
