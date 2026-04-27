/**
 * AgentToolsModule -- Registers all AI agent tools in one place.
 *
 * Tool sources:
 * - AgentRemindersService (reminders module) → suggestContacts, scheduleReminder
 * - AiAgentService (ai-agent module) → generateNotes, assessRelationshipHealth
 *
 * Consumer modules can import this to get access to all agent tools.
 */

import { Module, forwardRef } from '@nestjs/common';
import { RemindersModule } from '../reminders/reminders.module.js';
import { AiAgentModule } from '../ai-agent/ai-agent.module.js';

@Module({
  imports: [RemindersModule, forwardRef(() => AiAgentModule)],
  exports: [RemindersModule, AiAgentModule],
})
export class AgentToolsModule {}
