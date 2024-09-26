import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { DatabaseModule } from './libs/database/database.module';
import { ImageRekognitionModule } from './libs/image-rekognition/image-rekognition.module';
import { AuthGuard } from './modules/auth/auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { PostModule } from './modules/post/post.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('CACHING_HOST'),
          port: configService.get<number>('CACHING_PORT'),
          password: configService.get<string>('CACHING_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    PostModule,
    AuthModule,
    UserModule,
    ImageRekognitionModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
