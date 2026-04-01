import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { spawn } from 'child_process';

@ApiTags('debug')
@Controller('debug')
export class DebugController {
  @Get('ping')
  @HttpCode(HttpStatus.OK)
  ping() {
    return { ok: true, ts: new Date().toISOString() };
  }

  // Run: curl https://socos.rachkovan.com/api/debug/db-push
  @Get('db-push')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Run prisma db push to create DB tables' })
  async dbPush() {
    const results: string[] = [];
    const errors: string[] = [];

    return new Promise((resolve) => {
      // Try ash first (Alpine's shell), fall back to sh
      const shell = '/bin/ash';
      const cmd = 'node node_modules/.bin/prisma db push --accept-data-loss --skip-generate';

      const proc = spawn(shell, ['-c', cmd], {
        cwd: '/app/services/api',
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      let out = '';
      let err = '';

      proc.stdout?.on('data', (data) => {
        out += data.toString();
      });

      proc.stderr?.on('data', (data) => {
        err += data.toString();
      });

      proc.on('close', (code) => {
        resolve({
          exitCode: code,
          stdout: out.substring(0, 2000),
          stderr: err.substring(0, 1000),
        });
      });

      proc.on('error', (e: any) => {
        resolve({ error: e.message, code: e.code });
      });

      setTimeout(() => {
        proc.kill();
        resolve({ error: 'Timeout after 120s', stdout: out });
      }, 120000);
    });
  }
}
