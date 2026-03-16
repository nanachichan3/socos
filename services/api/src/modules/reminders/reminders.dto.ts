import { IsString, IsOptional, IsNumber, IsDateString, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ReminderType {
  BIRTHDAY = 'birthday',
  FOLLOWUP = 'followup',
  ANNIVERSARY = 'anniversary',
  CUSTOM = 'custom',
}

export enum RepeatInterval {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export class CreateReminderDto {
  @ApiProperty({ example: '019abc...' })
  @IsString()
  contactId: string;

  @ApiProperty({ enum: ReminderType, example: ReminderType.FOLLOWUP })
  @IsEnum(ReminderType)
  type: ReminderType;

  @ApiProperty({ example: 'Catch up with John' })
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2026-03-25T10:00:00Z' })
  @IsDateString()
  scheduledAt: string;

  @ApiPropertyOptional({ enum: RepeatInterval })
  @IsOptional()
  @IsEnum(RepeatInterval)
  repeatInterval?: RepeatInterval;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;
}

export class UpdateReminderDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @ApiPropertyOptional({ enum: RepeatInterval })
  @IsOptional()
  @IsEnum(RepeatInterval)
  repeatInterval?: RepeatInterval;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;
}

export class ReminderQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactId?: string;

  @ApiPropertyOptional({ enum: ReminderType })
  @IsOptional()
  @IsEnum(ReminderType)
  type?: ReminderType;

  @ApiPropertyOptional({ example: 'pending' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  offset?: number;
}

export class UpcomingRemindersDto {
  @ApiProperty()
  reminders: Array<{
    id: string;
    title: string;
    type: string;
    scheduledAt: Date;
    contact: {
      id: string;
      firstName: string;
      lastName: string | null;
      photo: string | null;
    };
  }>;

  @ApiProperty()
  stats: {
    today: number;
    thisWeek: number;
    overdue: number;
  };
}