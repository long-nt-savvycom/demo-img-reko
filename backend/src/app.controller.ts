import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { Public } from './common/common.decorator';

@Controller()
export class AppController {
  @Get('health')
  @Public()
  @HttpCode(HttpStatus.OK)
  healthCheck(): string {
    return 'OK';
  }
}
