import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { PrismaClient } from '@prisma/client';

async function ensureDatabase() {
  // Connect to the default 'postgres' database to create 'socos' if missing.
  // The DATABASE_URL points to /socos, but we need to connect to /postgres first.
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) { console.warn('[db-init] DATABASE_URL not set'); return; }
  
  try {
    const u = new URL(dbUrl);
    const user = u.username;
    const pass = u.password;
    const host = u.hostname;
    const port = u.port || '5432';
    const sslMode = u.searchParams.get('sslmode') || 'prefer';
    
    // Build admin URL pointing to 'postgres' default database
    const adminUrl = `postgresql://${user}:${pass}@${host}:${port}/postgres?sslmode=${sslMode}`;
    console.log('[db-init] Connecting to admin DB:', u.hostname + ':' + port + '/postgres');
    
    const { Client } = await import('pg');
    const admin = new Client({ connectionString: adminUrl, connectionTimeoutMillis: 10000 });
    await admin.connect();
    
    const r = await admin.query("SELECT 1 FROM pg_database WHERE datname = 'socos'");
    if (r.rows.length === 0) {
      console.log('[db-init] Creating socos database...');
      await admin.query('CREATE DATABASE socos');
      console.log('[db-init] socos created');
    } else {
      console.log('[db-init] socos already exists');
    }
    await admin.end();
  } catch(e: any) {
    console.warn('[db-init] Could not ensure database:', e.message);
    // Continue anyway - DB might already exist or connection issues will surface later
  }
}

async function bootstrap() {
  // Ensure the socos database exists before starting NestJS
  await ensureDatabase();
  
  const app = await NestFactory.create(AppModule);

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Enable CORS
  app.enableCors();

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('SOCOS API')
    .setDescription('Social Operating System API - Gamified Personal CRM')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Health check available at: http://localhost:${port}/health/check`);
  console.log(`Swagger docs available at: http://localhost:${port}/api`);
}
bootstrap();
