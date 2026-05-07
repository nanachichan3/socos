import { Controller, Post, Body, Logger, HttpCode, HttpStatus, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { LoginDto, RegisterDto } from './auth.dto.js';
import { AuthGuard } from './auth.guard.js';
import * as bcrypt from 'bcryptjs';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() dto: RegisterDto) {
    this.logger.log('Registering user:', dto.email, '| invite:', dto.inviteCode);
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  async login(@Body() dto: LoginDto) {
    this.logger.log('Login attempt for:', dto.email);
    try {
      return await this.authService.login(dto);
    } catch (err) {
      this.logger.error('Login failed:', err.message, err.stack);
      throw err;
    }
  }

  // Debug: check what hash is stored for a user
  @Get('debug/hash')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async debugHash() {
    try {
      const { PrismaService } = await import('../prisma/prisma.service.js');
      const prisma = new PrismaService();
      await prisma.onModuleInit();
      const user = await prisma.user.findUnique({ where: { email: 'yev.rachkovan@gmail.com' } });
      const hash = user?.passwordHash || 'NO_HASH';
      const isValid = hash.length === 60;
      let bcryptOk = false;
      let bcryptErr = null;
      try {
        bcryptOk = await bcrypt.compare('socos2026', hash);
      } catch (e: any) {
        bcryptErr = e.message;
      }
      return {
        hasHash: !!user?.passwordHash,
        hashLength: hash.length,
        hashStartsWith: hash.substring(0, 10),
        hashLooksValid: isValid,
        bcryptCompareResult: bcryptOk,
        bcryptError: bcryptErr,
        userId: user?.id,
      };
    } catch (e: any) {
      return { error: e.message, stack: e.stack };
    }
  }
}
