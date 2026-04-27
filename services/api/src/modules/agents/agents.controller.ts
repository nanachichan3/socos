/**
 * AI Agent System - HTTP Controller
 *
 * Provides REST endpoints for all AI agent operations.
 * All endpoints require authentication via X-User-Id header (stub auth).
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { AgentsService } from './agents.service.js';
import { AgentType } from './agents/types.js';

@ApiTags('Agents')
@Controller('api/agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  private getUserId(header: string): string {
    // Stub auth: use X-User-Id header for user identification
    if (!header) throw new Error('User ID required');
    return header;
  }

  // ========== Relationship Agent ==========

  @Get('relationship')
  @ApiOperation({ summary: 'Get relationship recommendations' })
  @ApiHeader({ name: 'X-User-Id', required: true })
  async getRelationshipRecommendations(
    @Headers('x-user-id') userId: string,
    @Query('daysStale') daysStale?: string,
    @Query('limit') limit?: string,
  ) {
    const ctx = { userId: this.getUserId(userId) };
    return this.agentsService.getRelationshipRecommendations(ctx, {
      daysStale: daysStale ? parseInt(daysStale) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
  }

  @Post('relationship/refresh-scores')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh relationship scores for all contacts' })
  @ApiHeader({ name: 'X-User-Id', required: true })
  async refreshRelationshipScores(@Headers('x-user-id') userId: string) {
    const ctx = { userId: this.getUserId(userId) };
    return this.agentsService.refreshRelationshipScores(ctx);
  }

  // ========== Reminder Agent ==========

  @Get('reminders/upcoming')
  @ApiOperation({ summary: 'Get upcoming reminders' })
  @ApiHeader({ name: 'X-User-Id', required: true })
  async getUpcomingReminders(
    @Headers('x-user-id') userId: string,
    @Query('daysAhead') daysAhead?: string,
    @Query('types') types?: string,
  ) {
    const ctx = { userId: this.getUserId(userId) };
    return this.agentsService.getReminderRecommendations(ctx, {
      daysAhead: daysAhead ? parseInt(daysAhead) : undefined,
      types: types ? types.split(',') : undefined,
    });
  }

  @Get('reminders/birthdays')
  @ApiOperation({ summary: 'Suggest birthday reminders' })
  @ApiHeader({ name: 'X-User-Id', required: true })
  async suggestBirthdayReminders(
    @Headers('x-user-id') userId: string,
    @Query('daysAhead') daysAhead?: string,
  ) {
    const ctx = { userId: this.getUserId(userId) };
    return this.agentsService.suggestBirthdayReminders(ctx, {
      daysAhead: daysAhead ? parseInt(daysAhead) : undefined,
    });
  }

  @Get('reminders/stale')
  @ApiOperation({ summary: 'Suggest reminders for stale contacts' })
  @ApiHeader({ name: 'X-User-Id', required: true })
  async suggestStaleContactReminders(
    @Headers('x-user-id') userId: string,
    @Query('staleDays') staleDays?: string,
    @Query('limit') limit?: string,
  ) {
    const ctx = { userId: this.getUserId(userId) };
    return this.agentsService.suggestStaleContactReminders(ctx, {
      staleDays: staleDays ? parseInt(staleDays) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
  }

  @Post('reminders/sync-celebrations')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sync celebration dates to reminders' })
  @ApiHeader({ name: 'X-User-Id', required: true })
  async syncCelebrationReminders(@Headers('x-user-id') userId: string) {
    const ctx = { userId: this.getUserId(userId) };
    return this.agentsService.syncCelebrationReminders(ctx);
  }

  // ========== Enrichment Agent ==========

  @Post('enrich/:contactId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Enrich contact with additional data' })
  @ApiHeader({ name: 'X-User-Id', required: true })
  async enrichContact(
    @Headers('x-user-id') userId: string,
    @Param('contactId') contactId: string,
  ) {
    const ctx = { userId: this.getUserId(userId), contactId };
    return this.agentsService.enrichContact(ctx);
  }

  @Post('enrich/batch')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Batch enrich contacts' })
  @ApiHeader({ name: 'X-User-Id', required: true })
  async enrichContacts(
    @Headers('x-user-id') userId: string,
    @Body() body: { contactIds?: string[]; limit?: number },
  ) {
    const ctx = { userId: this.getUserId(userId) };
    return this.agentsService.enrichContacts(ctx, body);
  }

  @Post('enrich/:contactId/apply')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Apply enrichment data to contact' })
  @ApiHeader({ name: 'X-User-Id', required: true })
  async applyEnrichment(
    @Headers('x-user-id') userId: string,
    @Param('contactId') contactId: string,
    @Body()
    body: {
      photo?: string;
      bio?: string;
      company?: string;
      jobTitle?: string;
      socialLinks?: Record<string, string>;
    },
  ) {
    const ctx = { userId: this.getUserId(userId), contactId };
    return this.agentsService.applyEnrichment(ctx, body);
  }

  // ========== Summary Agent ==========

  @Get('summary/interaction/:interactionId')
  @ApiOperation({ summary: 'Summarize a single interaction' })
  @ApiHeader({ name: 'X-User-Id', required: true })
  async summarizeInteraction(
    @Headers('x-user-id') userId: string,
    @Param('interactionId') interactionId: string,
  ) {
    const ctx = { userId: this.getUserId(userId), interactionId };
    return this.agentsService.summarizeInteraction(ctx);
  }

  @Get('summary/contact/:contactId')
  @ApiOperation({ summary: 'Summarize contact history' })
  @ApiHeader({ name: 'X-User-Id', required: true })
  async summarizeContactHistory(
    @Headers('x-user-id') userId: string,
    @Param('contactId') contactId: string,
    @Query('limit') limit?: string,
    @Query('daysBack') daysBack?: string,
  ) {
    const ctx = { userId: this.getUserId(userId), contactId };
    return this.agentsService.summarizeContactHistory(ctx, {
      limit: limit ? parseInt(limit) : undefined,
      daysBack: daysBack ? parseInt(daysBack) : undefined,
    });
  }

  @Get('summary/activity')
  @ApiOperation({ summary: 'Summarize activity for a period' })
  @ApiHeader({ name: 'X-User-Id', required: true })
  async summarizeActivityPeriod(
    @Headers('x-user-id') userId: string,
    @Query('period') period?: 'week' | 'month',
  ) {
    const ctx = { userId: this.getUserId(userId) };
    return this.agentsService.summarizeActivityPeriod(ctx, { period });
  }

  // ========== Suggestion Agent ==========

  @Get('suggestions')
  @ApiOperation({ summary: 'Get suggested contacts to meet' })
  @ApiHeader({ name: 'X-User-Id', required: true })
  async getSuggestions(
    @Headers('x-user-id') userId: string,
    @Query('limit') limit?: string,
    @Query('reason') reason?: 'interests' | 'mutual' | 'stale' | 'nearby',
  ) {
    const ctx = { userId: this.getUserId(userId) };
    return this.agentsService.getSuggestions(ctx, {
      limit: limit ? parseInt(limit) : undefined,
      reason,
    });
  }

  @Get('suggestions/introductions')
  @ApiOperation({ summary: 'Get suggested warm introductions' })
  @ApiHeader({ name: 'X-User-Id', required: true })
  async suggestIntroductions(
    @Headers('x-user-id') userId: string,
    @Query('limit') limit?: string,
  ) {
    const ctx = { userId: this.getUserId(userId) };
    return this.agentsService.suggestIntroductions(ctx, {
      limit: limit ? parseInt(limit) : undefined,
    });
  }

  @Get('suggestions/score-improvement')
  @ApiOperation({ summary: 'Get contacts that could improve relationship score' })
  @ApiHeader({ name: 'X-User-Id', required: true })
  async suggestScoreImprovement(
    @Headers('x-user-id') userId: string,
    @Query('limit') limit?: string,
  ) {
    const ctx = { userId: this.getUserId(userId) };
    return this.agentsService.suggestScoreImprovement(ctx, {
      limit: limit ? parseInt(limit) : undefined,
    });
  }

  // ========== Dashboard ==========

  @Get('dashboard')
  @ApiOperation({ summary: 'Get full agent dashboard data' })
  @ApiHeader({ name: 'X-User-Id', required: true })
  async getDashboard(@Headers('x-user-id') userId: string) {
    const ctx = { userId: this.getUserId(userId) };
    return this.agentsService.getDashboard(ctx);
  }
}
