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
import { RemindersService } from './modules/reminders/reminders.service.js';
import { GamificationController } from './modules/gamification/gamification.controller.js';
import { GamificationService } from './modules/gamification/gamification.service.js';
import { CelebrationsController } from './modules/celebrations/celebrations.controller.js';
import { CelebrationsService } from './modules/celebrations/celebrations.service.js';
import { DebugController } from './modules/debug/debug.controller.js';
import { DungeonMasterController } from './modules/dungeon-master/dungeon-master.controller.js';
import { DungeonMasterService } from './modules/dungeon-master/dungeon-master.service.js';
import { AiDmService } from './modules/dungeon-master/ai-dm.service.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
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
  ],
  providers: [
    PrismaService,
    JwtService,
    AuthService,
    AuthGuard,
    ContactsService,
    InteractionsService,
    RemindersService,
    GamificationService,
    CelebrationsService,
    DungeonMasterService,
    AiDmService,
  ],
})
export class AppModule {}
