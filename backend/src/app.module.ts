import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { ImageRekognitionModule } from './image-rekognition/image-rekognition.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
