import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ICreateUser, USER_REPO, UniqueUser } from './user.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPO)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(createUserDto: ICreateUser): Promise<User> {
    const user = this.userRepo.create(createUserDto);
    return this.userRepo.save(user);
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(uniqueUserInfos: Partial<UniqueUser>): Promise<User | null> {
    return this.userRepo.findOne({ where: uniqueUserInfos });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
