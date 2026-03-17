import { Controller, Post, Get, Body, UseGuards, Put, Request, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() body: any) {
    this.logger.log('register endpoint called');
    return { message: 'Use direct SQL for now - API needs fixing', body };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  async login(@Body() body: any) {
    this.logger.log('login endpoint called', body);
    return { message: 'Use direct SQL for now', body };
  }
}
