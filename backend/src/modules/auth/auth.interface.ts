import {
  ICreateUser,
  PASSWORD_MAX_LEN,
  PASSWORD_MIN_LEN,
  USERNAME_MAX_LEN,
  USERNAME_MIN_LEN,
} from 'src/modules/user/user.interface';
import { tags } from 'typia';

export interface AuthBody extends ICreateUser {
  username: string &
    tags.MinLength<typeof USERNAME_MIN_LEN> &
    tags.MaxLength<typeof USERNAME_MAX_LEN>;
  password: string &
    tags.MinLength<typeof PASSWORD_MIN_LEN> &
    tags.MaxLength<typeof PASSWORD_MAX_LEN>;
}

export interface LoginResult {
  access_token: string;
  access_token_ttl: string;
  refresh_token: string;
  refresh_token_ttl: string;
}
