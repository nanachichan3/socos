/**
 * AI Agent Module
 */

import { Module, forwardRef } from "@nestjs/common";
import { AiAgentController } from "./ai-agent.controller.js";
import { AiAgentService } from "./ai-agent.service.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { JwtService } from "../jwt/jwt.service.js";

@Module({
  controllers: [AiAgentController],
  providers: [AiAgentService, PrismaService, JwtService],
  exports: [AiAgentService],
})
export class AiAgentModule {}
