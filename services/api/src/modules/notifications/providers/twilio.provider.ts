/**
 * Twilio SMS Provider
 *
 * Twilio is a reliable SMS provider with global coverage.
 * Website: https://www.twilio.com
 *
 * Environment Variables Required:
 * - TWILIO_ACCOUNT_SID: Your Twilio Account SID
 * - TWILIO_AUTH_TOKEN: Your Twilio Auth Token
 * - TWILIO_PHONE_NUMBER: Your Twilio phone number (from number)
 *
 * Note: Twilio requires phone numbers to be in E.164 format
 * e.g., +14155552671 (US) or +442071838750 (UK)
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SmsOptions,
  NotificationResult,
} from '../notifications/types.js';

@Injectable()
export class TwilioSmsProvider {
  private accountSid: string;
  private authToken: string;
  private fromNumber: string;
  private baseUrl: string;

  constructor(private configService: ConfigService) {
    this.accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID') || '';
    this.authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN') || '';
    this.fromNumber = this.configService.get<string>('TWILIO_PHONE_NUMBER') || '';
    this.baseUrl = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}`;
  }

  /**
   * Send an SMS via Twilio
   */
  async send(options: SmsOptions): Promise<NotificationResult> {
    if (!this.accountSid || !this.authToken) {
      return {
        success: false,
        error: 'Twilio credentials not configured (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)',
        provider: 'twilio',
        sentAt: new Date(),
      };
    }

    try {
      // Format phone number to E.164 if needed
      const toNumber = this.formatPhoneNumber(options.to);
      const fromNumber = options.from || this.fromNumber;

      const url = new URL(`${this.baseUrl}/Messages.json`);
      const body = new URLSearchParams({
        To: toNumber,
        From: fromNumber,
        Body: options.body,
      });

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          Authorization: `Basic ${this.getAuthHeader()}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      const data = await response.json() as { message?: string; sid?: string; status?: string };

      if (!response.ok) {
        return {
          success: false,
          error: `Twilio API error: ${data.message || 'Unknown error'}`,
          provider: 'twilio',
          sentAt: new Date(),
        };
      }

      return {
        success: true,
        messageId: data.sid,
        provider: 'twilio',
        sentAt: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: 'twilio',
        sentAt: new Date(),
      };
    }
  }

  /**
   * Get SMS message status
   */
  async getMessageStatus(messageId: string): Promise<string | null> {
    if (!this.accountSid || !this.authToken) {
      return null;
    }

    try {
      const url = `${this.baseUrl}/Messages/${messageId}.json`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Basic ${this.getAuthHeader()}`,
        },
      });

      if (!response.ok) return null;

      const data = await response.json() as { status?: string };
      return data.status;
    } catch {
      return null;
    }
  }

  /**
   * Get available phone numbers (for multi-number setups)
   */
  async listPhoneNumbers(): Promise<Array<{ sid: string; phoneNumber: string }>> {
    if (!this.accountSid || !this.authToken) {
      return [];
    }

    try {
      const url = `${this.baseUrl}/IncomingPhoneNumbers.json`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Basic ${this.getAuthHeader()}`,
        },
      });

      if (!response.ok) return [];

      const data = await response.json() as { incoming_phone_numbers?: Array<{ sid: string; phone_number: string }> };
      return (data.incoming_phone_numbers || []).map((p) => ({
        sid: p.sid,
        phoneNumber: p.phone_number,
      }));
    } catch {
      return [];
    }
  }

  /**
   * Validate a phone number
   */
  async validateNumber(phoneNumber: string): Promise<{ valid: boolean; formatted: string }> {
    const formatted = this.formatPhoneNumber(phoneNumber);
    // Basic E.164 validation
    const valid = /^\+[1-9]\d{7,14}$/.test(formatted);
    return { valid, formatted };
  }

  /**
   * Format phone number to E.164
   * Handles various input formats
   */
  private formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters
    const digits = phoneNumber.replace(/\D/g, '');

    // If it starts with 0, assume it's a local format and needs country code
    // This is a simplification - in production, use a library like libphonenumber
    if (digits.startsWith('0') && digits.length >= 10) {
      // Assume UK format
      return `+44${digits.slice(1)}`;
    }

    // If it's a US number without country code
    if (digits.length === 10 && digits.startsWith('1')) {
      return `+1${digits}`;
    }

    // If it doesn't start with +, add it
    if (!phoneNumber.startsWith('+')) {
      return `+${digits}`;
    }

    return phoneNumber;
  }

  private getAuthHeader(): string {
    return Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64');
  }
}
