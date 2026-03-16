import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(private configService: ConfigService) {}

  generateToken(userId: string): string {
    // Simple JWT-like token for MVP (base64 encoded JSON)
    const payload = {
      userId,
      iat: Date.now(),
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    };
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }

  verifyToken(token: string): { userId: string; iat: number; exp: number } | null {
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      if (decoded.exp < Date.now()) {
        return null;
      }
      return decoded;
    } catch {
      return null;
    }
  }
}
