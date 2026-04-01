import { IsString, IsOptional, IsArray, IsDateString, IsNumber, IsEnum, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ==================== CELEBRATION PACK DTOs ====================

export class CreateCelebrationPackDto {
  @ApiProperty({ example: 'Buddhism Celebrations' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Important Buddhist holidays and observances' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateCelebrationPackDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}

// ==================== CELEBRATION DTOs ====================

export class CreateCelebrationDto {
  @ApiProperty({ example: 'Vesak' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'The birth, enlightenment, and passing of Buddha' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '05-15', description: 'MM-DD format for recurring annual date' })
  @IsString()
  date: string;

  @ApiPropertyOptional({ example: '05-01', description: 'YYYY-MM-DD for non-recurring events' })
  @IsOptional()
  @IsDateString()
  fullDate?: string;

  @ApiPropertyOptional({ example: '🪷' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ example: 'religious', description: 'religious, secular, cultural, personal' })
  @IsString()
  category: string;

  @ApiPropertyOptional({ example: 'lunar', description: 'gregorian (fixed), lunar (yearly varying), chinese (Chinese lunar calendar)' })
  @IsOptional()
  @IsString()
  calendarType?: string;
}

export class UpdateCelebrationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '05-15' })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fullDate?: string;

  @ApiPropertyOptional({ example: '🪷' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ example: 'religious' })
  @IsOptional()
  @IsString()
  category?: string;
}

export enum CelebrationStatus {
  ACTIVE = 'active',
  IGNORED = 'ignored',
}

// ==================== CONTACT CELEBRATION DTOs ====================

export class AttachCelebrationDto {
  @ApiProperty({ example: 'clx123...' })
  @IsString()
  celebrationId: string;

  @ApiPropertyOptional({ example: 'active', enum: ['active', 'ignored'] })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Override date for this contact (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  customDate?: string;

  @ApiPropertyOptional({ example: true, description: 'Whether to generate a reminder for this contact' })
  @IsOptional()
  @IsBoolean()
  shouldRemind?: boolean;
}

export class UpdateContactCelebrationDto {
  @ApiPropertyOptional({ enum: ['active', 'ignored'] })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Override date for this contact (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  customDate?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  shouldRemind?: boolean;
}

export class CelebrationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'religious' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ default: 50 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number;
}

export class GlobalStatusDto {
  @ApiProperty({ enum: ['active', 'ignored'] })
  @IsString()
  status: string;
}

export class SearchCelebrationsDto {
  @ApiPropertyOptional({ example: 'Buddha' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ example: 'religious' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'sys-buddhism' })
  @IsOptional()
  @IsString()
  packId?: string;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}
