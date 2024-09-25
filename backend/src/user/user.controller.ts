import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  /**
   * @tag User
   * @security bearer
   */
  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  // /**
  //  * @tag User
  //  * @security bearer
  //  */
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne({ id: +id });
  // }

  // /**
  //  * @tag User
  //  * @security bearer
  //  */
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  /**
   * @tag User
   */
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
