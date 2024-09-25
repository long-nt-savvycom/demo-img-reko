import fastifyCsrf from '@fastify/csrf-protection';
import fastifyHelmet from '@fastify/helmet';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);

  const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { cors: true },
  );

  await app.register(fastifyHelmet as any); //TODO: fix type version fastify and helmet
  await app.register(fastifyCsrf as any); //TODO: fix type version fastify and csrf


  const configService = app.get(ConfigService);

  const serverPort = configService.get('SERVER_HTTP_PORT') || 3002;

  const serverUrl = `http://localhost:${serverPort}`;

  const docs = require('../../swagger.json');
  docs.servers = [{ url: configService.get('SERVER_DOMAIN_URL') || serverUrl }];
  SwaggerModule.setup('swagger', app, docs);

  await app.listen(serverPort, '0.0.0.0');

  logger.log(`Server HTTP is running on ${serverUrl}`);
}
bootstrap();
