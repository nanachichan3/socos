/**
 * SOCOS AI Agent System - Type Definitions
 *
 * Agent Roles:
 * - relationship: Tracks who to reach out to based on interaction frequency
 * - reminder: Handles birthday, anniversary, and follow-up reminders
 * - enrichment: Auto-fills contact info from public sources
 * - summary: Generates AI summaries of interactions
 * - suggestion: Recommends people to meet based on interests
 */

export enum AgentType {
  RELATIONSHIP = 'relationship',
  REMINDER = 'reminder',
  ENRICHMENT = 'enrichment',
  SUMMARY = 'summary',
  SUGGESTION = 'suggestion',
}

export enum AgentStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface AgentContext {
  userId: string;
  vaultId?: string;
  contactId?: string;
  interactionId?: string;
  metadata?: Record<string, any>;
}

export interface AgentResult<T = any> {
  success: boolean;
  agent: AgentType;
  data?: T;
  error?: string;
  executedAt: Date;
}

export interface RelationshipRecommendation {
  contactId: string;
  contactName: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  daysSinceContact: number;
  suggestedAction: string;
}

export interface ReminderRecommendation {
  contactId: string;
  contactName: string;
  reminderType: 'birthday' | 'anniversary' | 'followup' | 'stale';
  title: string;
  scheduledAt: Date;
  isRecurring: boolean;
}

export interface EnrichmentResult {
  contactId: string;
  enriched: {
    photo?: string;
    bio?: string;
    company?: string;
    jobTitle?: string;
    socialLinks?: Record<string, string>;
  };
  confidence: number;
  sources: string[];
}

export interface SummaryResult {
  interactionId?: string;
  contactId: string;
  summary: string;
  keyTopics: string[];
  actionItems: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface SuggestionResult {
  contactId: string;
  contactName: string;
  reason: string;
  score: number;
  sharedInterests: string[];
}
