import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GamificationService } from './gamification.service.js';
import { AuthGuard } from '../auth/auth.guard.js';

@ApiTags('gamification')
@Controller('gamification')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get('achievements')
  @ApiOperation({ summary: 'Get all achievements' })
  async getAllAchievements() {
    return this.gamificationService.getAllAchievements();
  }

  @Get('my-achievements')
  @ApiOperation({ summary: 'Get current user achievements' })
  async getUserAchievements(@Request() req: { user: { userId: string } }) {
    return this.gamificationService.getUserAchievements(req.user.userId);
  }
}
