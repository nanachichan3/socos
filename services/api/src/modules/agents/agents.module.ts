/**
 * AI Agent System - NestJS Module
 */

import { Module } from '@nestjs/common';
import { AgentsController } from './agents.controller.js';
import { AgentsService } from './agents.service.js';
import { RelationshipAgent } from './strategies/relationship-agent.js';
import { ReminderAgent } from './strategies/reminder-agent.js';
import { EnrichmentAgent } from './strategies/enrichment-agent.js';
import { SummaryAgent } from './strategies/summary-agent.js';
import { SuggestionAgent } from './strategies/suggestion-agent.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { GamificationService } from '../gamification/gamification.service.js';

@Module({
  controllers: [AgentsController],
  providers: [
    AgentsService,
    RelationshipAgent,
    ReminderAgent,
    EnrichmentAgent,
    SummaryAgent,
    SuggestionAgent,
    PrismaService,
    GamificationService,
  ],
  exports: [AgentsService],
})
export class AgentsModule {}
