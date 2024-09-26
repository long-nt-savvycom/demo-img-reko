import fastifyCsrf from '@fastify/csrf-protection';
import fastifyHelmet from '@fastify/helmet';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static'; // Import the static plugin
import { join } from 'path'; // Import path for directory handling

async function bootstrap() {
  const logger = new Logger(bootstrap.name);

  const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { cors: true },
  );

  await app.register(fastifyHelmet as any); //TODO: fix type version fastify and helmet
  await app.register(fastifyCsrf as any); //TODO: fix type version fastify and csrf
  await app.register(multipart as any);

  // Register the static file serving
  await app.register(fastifyStatic as any, {
    root: join(__dirname, '../..', 'uploads'),
    prefix: '/uploads/', // The URL prefix for accessing static files
  });

  const configService = app.get(ConfigService);

  const serverPort = configService.get('SERVER_HTTP_PORT') || 3002;

  const serverUrl = `http://localhost:${serverPort}`;

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const docs = require('../../swagger.json');
  docs.servers = [{ url: configService.get('SERVER_DOMAIN_URL') || serverUrl }];
  SwaggerModule.setup('swagger', app, docs);

  await app.listen(serverPort, '0.0.0.0');

  logger.log(`Server HTTP is running on ${serverUrl}`);
}
bootstrap();
