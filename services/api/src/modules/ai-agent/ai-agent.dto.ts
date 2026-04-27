/**
 * AI Agent DTOs -- Request / Response types for POST /ai-agent/action
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

// ========== Request ==========

export enum AiAgentAction {
  SUGGEST_CONTACTS = "suggestContacts",
  SCHEDULE_REMINDER = "scheduleReminder",
  GENERATE_NOTE = "generateNote",
  ASSESS_RELATIONSHIP_HEALTH = "assessRelationshipHealth",
}

export class SuggestContactsOptions {
  @ApiPropertyOptional({ default: 3 })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ enum: ["stale", "birthday", "score", "all"], default: "all" })
  @IsOptional()
  @IsEnum(["stale", "birthday", "score", "all"])
  reason?: "stale" | "birthday" | "score" | "all";
}

export class ScheduleReminderOptions {
  @ApiPropertyOptional({ enum: ["birthday", "followup", "stale", "celebration"] })
  @IsOptional()
  @IsEnum(["birthday", "followup", "stale", "celebration"])
  type?: "birthday" | "followup" | "stale" | "celebration";
}

export class GenerateNoteOptions {
  @ApiPropertyOptional({ enum: ["message", "email", "meeting"], default: "message" })
  @IsOptional()
  @IsEnum(["message", "email", "meeting"])
  format?: "message" | "email" | "meeting";

  @ApiPropertyOptional({ enum: ["casual", "professional", "warm"], default: "casual" })
  @IsOptional()
  @IsEnum(["casual", "professional", "warm"])
  tone?: "casual" | "professional" | "warm";
}

export class AiAgentActionRequest {
  @ApiProperty({ enum: AiAgentAction })
  @IsEnum(AiAgentAction)
  action: AiAgentAction;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  vaultId?: string;

  @ApiPropertyOptional({ description: "Options for suggestContacts action" })
  @IsOptional()
  suggestContactsOptions?: SuggestContactsOptions;

  @ApiPropertyOptional({ description: "Options for scheduleReminder action" })
  @IsOptional()
  scheduleReminderOptions?: ScheduleReminderOptions;

  @ApiPropertyOptional({ description: "Options for generateNote action" })
  @IsOptional()
  generateNoteOptions?: GenerateNoteOptions;
}

// ========== Response Shapes ==========

// -- suggestContacts --
export class SuggestedContact {
  contactId: string;
  contactName: string;
  reason: string;
  priority: "high" | "medium" | "low";
  daysSinceContact: number;
  relationshipScore: number;
  upcomingBirthday: boolean;
}

export class SuggestContactsResponse {
  contacts: SuggestedContact[];
}

// -- scheduleReminder --
export class SuggestedReminder {
  contactId: string;
  title: string;
  type: "birthday" | "followup" | "stale" | "celebration";
  scheduledAt: string;
  isRecurring: boolean;
  recurrenceRule: "none" | "yearly" | "monthly" | "weekly";
  description: string;
}

export class ScheduleReminderResponse {
  suggestedReminder: SuggestedReminder;
}

// -- generateNote --
export class GeneratedNote {
  format: "message" | "email" | "meeting";
  content: string;
  subject?: string;
  talkingPoints?: string[];
  tone: string;
}

export class GenerateNoteResponse {
  note: GeneratedNote;
}

// -- assessRelationshipHealth --
export class RelationshipStats {
  daysSinceContact: number | null;
  interactionCount90d: number;
  lastInteractionType: string | null;
}

export class RelationshipAssessment {
  contactId: string;
  contactName: string;
  healthScore: number;
  healthBand: "excellent" | "healthy" | "needs-attention" | "at-risk";
  insight: string;
  recommendation: string;
  stats: RelationshipStats;
}

export class AssessRelationshipHealthResponse {
  assessment: RelationshipAssessment;
}

// -- Generic envelope --
export class AiAgentActionResponse<T = any> {
  success: boolean;
  action: string;
  data?: T;
  error?: string;
  executedAt: string;
}
