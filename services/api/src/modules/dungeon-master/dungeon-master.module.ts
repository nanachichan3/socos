import { Module } from '@nestjs/common';
import { DungeonMasterController } from './dungeon-master.controller.js';
import { DungeonMasterService } from './dungeon-master.service.js';
import { AiDmService } from './ai-dm.service.js';

@Module({
  controllers: [DungeonMasterController],
  providers: [DungeonMasterService, AiDmService],
  exports: [DungeonMasterService],
})
export class DungeonMasterModule {}
