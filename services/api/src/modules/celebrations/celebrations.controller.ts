import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CelebrationsService } from './celebrations.service.js';
import {
  CreateCelebrationPackDto,
  UpdateCelebrationPackDto,
  CreateCelebrationDto,
  UpdateCelebrationDto,
  AttachCelebrationDto,
  UpdateContactCelebrationDto,
  CelebrationQueryDto,
  GlobalStatusDto,
  SearchCelebrationsDto,
} from './celebrations.dto.js';
import { AuthGuard } from '../auth/auth.guard.js';

@ApiTags('celebrations')
@Controller('celebrations')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class CelebrationsController {
  constructor(private readonly celebrationsService: CelebrationsService) {}

  // ==================== CELEBRATION PACKS ====================

  @Get('packs')
  @ApiOperation({ summary: 'Get all celebration packs available to the user' })
  async findAllPacks(@Request() req: { user: { userId: string } }) {
    return this.celebrationsService.findAllPacks(req.user.userId);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search celebrations across all packs' })
  async search(@Request() req: { user: { userId: string } }, @Query() query: SearchCelebrationsDto) {
    return this.celebrationsService.searchCelebrations(req.user.userId, query);
  }

  @Get('reminders')
  @ApiOperation({ summary: 'Get celebrations that should trigger reminders in the next N days' })
  async getReminders(@Request() req: { user: { userId: string } }, @Query('days') days?: number) {
    return this.celebrationsService.getReminderCelebrations(req.user.userId, days || 14);
  }

  @Post('notify-upcoming')
  @ApiOperation({ summary: 'Send notifications for upcoming celebrations' })
  async notifyUpcoming(@Request() req: { user: { userId: string } }, @Query('days') days?: number) {
    return this.celebrationsService.sendCelebrationNotifications(req.user.userId, days || 14);
  }

  @Get('packs/:packId')
  @ApiOperation({ summary: 'Get a celebration pack by ID' })
  async findPackById(
    @Request() req: { user: { userId: string } },
    @Param('packId') packId: string,
  ) {
    return this.celebrationsService.findPackById(req.user.userId, packId);
  }

  @Post('packs')
  @ApiOperation({ summary: 'Create a new celebration pack' })
  async createPack(
    @Request() req: { user: { userId: string } },
    @Body() dto: CreateCelebrationPackDto,
  ) {
    return this.celebrationsService.createPack(req.user.userId, dto);
  }

  @Put('packs/:packId')
  @ApiOperation({ summary: 'Update a celebration pack' })
  async updatePack(
    @Request() req: { user: { userId: string } },
    @Param('packId') packId: string,
    @Body() dto: UpdateCelebrationPackDto,
  ) {
    return this.celebrationsService.updatePack(req.user.userId, packId, dto);
  }

  @Delete('packs/:packId')
  @ApiOperation({ summary: 'Delete a celebration pack' })
  async deletePack(
    @Request() req: { user: { userId: string } },
    @Param('packId') packId: string,
  ) {
    return this.celebrationsService.deletePack(req.user.userId, packId);
  }

  // ==================== CELEBRATIONS ====================

  @Get('packs/:packId/celebrations')
  @ApiOperation({ summary: 'Get all celebrations in a pack' })
  async findAllInPack(
    @Request() req: { user: { userId: string } },
    @Param('packId') packId: string,
    @Query() query: CelebrationQueryDto,
  ) {
    return this.celebrationsService.findAllInPack(req.user.userId, packId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a celebration by ID' })
  async findCelebrationById(
    @Request() req: { user: { userId: string } },
    @Param('id') id: string,
  ) {
    return this.celebrationsService.findCelebrationById(req.user.userId, id);
  }

  @Post('packs/:packId/celebrations')
  @ApiOperation({ summary: 'Add a celebration to a pack' })
  async createCelebration(
    @Request() req: { user: { userId: string } },
    @Param('packId') packId: string,
    @Body() dto: CreateCelebrationDto,
  ) {
    return this.celebrationsService.createCelebration(req.user.userId, packId, dto);
  }

  @Put('packs/:packId/celebrations/:celebrationId')
  @ApiOperation({ summary: 'Update a celebration' })
  async updateCelebration(
    @Request() req: { user: { userId: string } },
    @Param('packId') packId: string,
    @Param('celebrationId') celebrationId: string,
    @Body() dto: UpdateCelebrationDto,
  ) {
    return this.celebrationsService.updateCelebration(
      req.user.userId,
      packId,
      celebrationId,
      dto,
    );
  }

  @Delete('packs/:packId/celebrations/:celebrationId')
  @ApiOperation({ summary: 'Delete a celebration' })
  async deleteCelebration(
    @Request() req: { user: { userId: string } },
    @Param('packId') packId: string,
    @Param('celebrationId') celebrationId: string,
  ) {
    return this.celebrationsService.deleteCelebration(
      req.user.userId,
      packId,
      celebrationId,
    );
  }

  // ==================== GLOBAL STATUS ====================

  @Put(':id/global-status')
  @ApiOperation({ summary: 'Set global status for a celebration (applies to all contacts)' })
  async setGlobalStatus(
    @Request() req: { user: { userId: string } },
    @Param('id') id: string,
    @Body() dto: GlobalStatusDto,
  ) {
    return this.celebrationsService.setGlobalStatus(req.user.userId, id, dto);
  }

  // ==================== UPCOMING ====================

  @Get('upcoming/list')
  @ApiOperation({ summary: 'Get upcoming celebrations for the next 30 days' })
  async getUpcoming(@Request() req: { user: { userId: string } }) {
    return this.celebrationsService.getUpcoming(req.user.userId);
  }

  // ==================== CONTACT CELEBRATIONS ====================

  @Get('contacts/:contactId')
  @ApiOperation({ summary: 'Get all celebrations attached to a contact' })
  async findAllForContact(
    @Request() req: { user: { userId: string } },
    @Param('contactId') contactId: string,
  ) {
    return this.celebrationsService.findAllForContact(req.user.userId, contactId);
  }

  @Post('contacts/:contactId')
  @ApiOperation({ summary: 'Attach a celebration to a contact' })
  async attachToContact(
    @Request() req: { user: { userId: string } },
    @Param('contactId') contactId: string,
    @Body() dto: AttachCelebrationDto,
  ) {
    return this.celebrationsService.attachToContact(req.user.userId, contactId, dto);
  }

  @Put('contacts/:contactId/:celebrationId')
  @ApiOperation({ summary: 'Update a celebration attachment for a contact' })
  async updateContactCelebration(
    @Request() req: { user: { userId: string } },
    @Param('contactId') contactId: string,
    @Param('celebrationId') celebrationId: string,
    @Body() dto: UpdateContactCelebrationDto,
  ) {
    return this.celebrationsService.updateContactCelebration(
      req.user.userId,
      contactId,
      celebrationId,
      dto,
    );
  }

  @Delete('contacts/:contactId/:celebrationId')
  @ApiOperation({ summary: 'Detach a celebration from a contact' })
  async detachFromContact(
    @Request() req: { user: { userId: string } },
    @Param('contactId') contactId: string,
    @Param('celebrationId') celebrationId: string,
  ) {
    return this.celebrationsService.detachFromContact(
      req.user.userId,
      contactId,
      celebrationId,
    );
  }
}
