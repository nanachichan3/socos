import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health/health.controller.js';
import { PrismaService } from './modules/prisma/prisma.service.js';
import { JwtService } from './modules/jwt/jwt.service.js';
import { AuthController } from './modules/auth/auth.controller.js';
import { AuthService } from './modules/auth/auth.service.js';
import { AuthGuard } from './modules/auth/auth.guard.js';
import { ContactsController } from './modules/contacts/contacts.controller.js';
import { ContactsService } from './modules/contacts/contacts.service.js';
import { InteractionsController } from './modules/interactions/interactions.controller.js';
import { InteractionsService } from './modules/interactions/interactions.service.js';
import { RemindersController } from './modules/reminders/reminders.controller.js';
import { RemindersModule } from './modules/reminders/reminders.module.js';
import { GamificationController } from './modules/gamification/gamification.controller.js';
import { GamificationService } from './modules/gamification/gamification.service.js';
import { CelebrationsController } from './modules/celebrations/celebrations.controller.js';
import { CelebrationsService } from './modules/celebrations/celebrations.service.js';
import { DebugController } from './modules/debug/debug.controller.js';
import { DungeonMasterController } from './modules/dungeon-master/dungeon-master.controller.js';
import { DungeonMasterService } from './modules/dungeon-master/dungeon-master.service.js';
import { AiDmService } from './modules/dungeon-master/ai-dm.service.js';
import { AgentsModule } from './modules/agents/agents.module.js';
import { AiAgentModule } from './modules/ai-agent/ai-agent.module.js';
import { AgentToolsModule } from './modules/agent-tools/agent-tools.module.js';
import { AgentsController } from './modules/agents/agents.controller.js';
import { AiAgentController } from './modules/ai-agent/ai-agent.controller.js';
import { AgentsService } from './modules/agents/agents.service.js';
import { RelationshipAgent } from './modules/agents/strategies/relationship-agent.js';
import { ReminderAgent } from './modules/agents/strategies/reminder-agent.js';
import { EnrichmentAgent } from './modules/agents/strategies/enrichment-agent.js';
import { SummaryAgent } from './modules/agents/strategies/summary-agent.js';
import { SuggestionAgent } from './modules/agents/strategies/suggestion-agent.js';
import { NotificationsModule } from './modules/notifications/notifications.module.js';
import { NotificationsController } from './modules/notifications/notifications.controller.js';
import { NotificationsService } from './modules/notifications/notifications.service.js';
import { ResendEmailProvider } from './modules/notifications/providers/resend.provider.js';
import { TwilioSmsProvider } from './modules/notifications/providers/twilio.provider.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AgentsModule,
    NotificationsModule,
    AiAgentModule,
    RemindersModule,
    AgentToolsModule,
  ],
  controllers: [
    HealthController,
    AuthController,
    ContactsController,
    InteractionsController,
    RemindersController,
    GamificationController,
    CelebrationsController,
    DebugController,
    DungeonMasterController,
    AgentsController,
    AiAgentController,
    NotificationsController,
  ],
  providers: [
    PrismaService,
    JwtService,
    AuthService,
    AuthGuard,
    ContactsService,
    InteractionsService,
    GamificationService,
    CelebrationsService,
    DungeonMasterService,
    AiDmService,
    AgentsService,
    RelationshipAgent,
    ReminderAgent,
    EnrichmentAgent,
    SummaryAgent,
    SuggestionAgent,
    NotificationsService,
    ResendEmailProvider,
    TwilioSmsProvider,
  ],
})
export class AppModule {}
