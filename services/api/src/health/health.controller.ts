import { Controller, Get } from '@nestjs/common';
import { getSharedMessage } from '@ts-monorepo-boilerplate/common';

@Controller('health')
export class HealthController {
  @Get('check')
  check() {
    const sharedMessage = getSharedMessage();
    
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: sharedMessage,
      service: 'ts-monorepo-boilerplate-service',
    };
  }
}
