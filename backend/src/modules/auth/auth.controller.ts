import { TypedBody, TypedRoute } from '@nestia/core';
import { Controller, HttpCode, HttpStatus } from '@nestjs/common';
import { Public } from 'src/common/common.decorator';
import { AuthBody, LoginResult } from './auth.interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * @tag Auth
   * @summary Public API
   */
  @Public()
  @HttpCode(HttpStatus.OK)
  @TypedRoute.Post('signup')
  async signUp(@TypedBody() signUpDto: AuthBody): Promise<Date | undefined> {
    return this.authService.signUp(signUpDto);
  }

  /**
   * @tag Auth
   * @summary Public API
   */
  @Public()
  @HttpCode(HttpStatus.OK)
  @TypedRoute.Post('login')
  async signIn(@TypedBody() signInDto: AuthBody): Promise<LoginResult> {
    return this.authService.signIn(signInDto);
  }
}
