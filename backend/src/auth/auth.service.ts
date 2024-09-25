import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bycrypt from 'bcrypt';
import { UniqueEntity } from 'src/common/common.interface';
import { ICreateUser } from 'src/user/user.interface';
import { UserService } from 'src/user/user.service';
import { AuthBody, LoginResult } from './auth.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly usersService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public async signUp(authBody: AuthBody): Promise<Date> {
    const user = await this.usersService.findOne({ username: authBody.username });
    if (user) {
      throw new BadRequestException('USERNAME_EXISTED');
    }
    const hashPassword = bycrypt.hashSync(
      authBody.password,
      parseInt(this.configService.get<string>('PASSWORD_HASH_SALT') || '10'),
    );
    const createUserDto: ICreateUser = {
      username: authBody.username,
      password: hashPassword,
    };
    const newUser = await this.usersService.create(createUserDto);
    this.logger.debug({ newUser });

    return newUser.created_at;
  }

  public async signIn(authBody: AuthBody): Promise<LoginResult> {
    const user = await this.usersService.findOne({ username: authBody.username });
    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    const isPasswordValid = bycrypt.compareSync(authBody.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const tokenBody: UniqueEntity = { id: user.id };

    const access_token_ttl = this.configService.get<string>('ACCESS_JWT_TTL') || '1m';
    const refresh_token_ttl = this.configService.get<string>('REFRESH_JWT_TTL') || '1d';

    const access_token = await this.jwtService.signAsync(tokenBody, {
      secret: this.configService.get<string>('ACCESS_JWT_SECRET'),
      expiresIn: access_token_ttl,
    });

    const refresh_token = await this.jwtService.signAsync(tokenBody, {
      secret: this.configService.get<string>('REFRESH_JWT_SECRET'),
      expiresIn: refresh_token_ttl,
    });
    return {
      access_token,
      refresh_token,
      access_token_ttl,
      refresh_token_ttl,
    };
  }
}
