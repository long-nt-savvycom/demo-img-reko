import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<JwtModuleOptions> => {
        const jwtModuleOptions: JwtModuleOptions = {
          global: true,
          secret: configService.get<string>('ACCESS_JWT_SECRET'),
          signOptions: { expiresIn: configService.get<string>('ACCESS_JWT_TTL') },
        };
        return jwtModuleOptions;
      },
    }), // TODO: register for refresh token bellow
  ],
  providers: [AuthService, JwtModule],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
