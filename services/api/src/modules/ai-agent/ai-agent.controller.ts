/**
 * AI Agent Controller -- POST /ai-agent/action dispatcher
 *
 * Single endpoint that routes all 4 tools. Uses Bearer JWT auth.
 */

import {
  Controller,
  Post,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiHeader } from "@nestjs/swagger";
import { AiAgentService } from "./ai-agent.service.js";
import { AiAgentActionRequest, AiAgentActionResponse } from "./ai-agent.dto.js";

@ApiTags("AI Agent")
@Controller("ai-agent")
export class AiAgentController {
  constructor(private readonly aiAgentService: AiAgentService) {}

  private extractUserId(authHeader: string): string {
    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing or invalid Authorization header");
    }
    const token = authHeader.slice(7);
    const decoded = (this.aiAgentService as any).jwtService.verifyToken(token);
    if (!decoded) throw new UnauthorizedException("Invalid or expired token");
    return decoded.userId;
  }

  @Post("action")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Dispatch an AI Agent action" })
  @ApiBearerAuth()
  @ApiHeader({ name: "Authorization", description: "Bearer <jwt>", required: true })
  async dispatchAction(
    @Headers("authorization") authHeader: string,
    @Body() body: AiAgentActionRequest,
  ): Promise<AiAgentActionResponse> {
    const userId = this.extractUserId(authHeader);
    return this.aiAgentService.dispatch(
      { userId, vaultId: body.vaultId, contactId: body.contactId },
      body.action,
      body,
    );
  }
}
