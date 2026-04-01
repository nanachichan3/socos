import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

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
      // Run prisma db push to create tables
      const { stdout, stderr } = await execAsync(
        'node node_modules/.bin/prisma db push --accept-data-loss',
        { cwd: '/app/services/api', timeout: 60000 },
      );
      results.push('db push stdout:', stdout);
      if (stderr) errors.push('db push stderr:', stderr);
    } catch (e: any) {
      errors.push('db push error:', e.message);
    }

    return { results, errors };
  }

  @Get('ping')
  @HttpCode(HttpStatus.OK)
  ping() {
    return { ok: true, ts: new Date().toISOString() };
  }
}
