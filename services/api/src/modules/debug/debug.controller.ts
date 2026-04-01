import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { execSync } from 'child_process';

@ApiTags('debug')
@Controller('debug')
export class DebugController {
  @Get('setup')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Run Prisma db push to create DB tables' })
  async setup() {
    const results: string[] = [];
    const errors: string[] = [];

    try {
      const stdout = execSync(
        'node node_modules/.bin/prisma db push --accept-data-loss --skip-generate',
        { cwd: '/app/services/api', timeout: 60000, stdio: ['pipe', 'pipe', 'pipe'] },
      ).toString();
      results.push('db push stdout:', stdout);
    } catch (e: any) {
      errors.push('db push error:', e.message);
      if (e.stderr) errors.push('stderr:', e.stderr.toString());
      if (e.stdout) errors.push('stdout:', e.stdout.toString());
    }

    return { results, errors };
  }

  @Get('ping')
  @HttpCode(HttpStatus.OK)
  ping() {
    return { ok: true, ts: new Date().toISOString() };
  }
}
