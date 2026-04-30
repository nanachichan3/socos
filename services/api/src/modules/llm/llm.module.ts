import { Module, Global } from '@nestjs/common';
import { LlmService } from './llm.service.js';
import { AnthropicService } from './anthropic.service.js';

@Global()
@Module({
  providers: [LlmService, AnthropicService],
  exports: [LlmService, AnthropicService],
})
export class LlmModule {}
