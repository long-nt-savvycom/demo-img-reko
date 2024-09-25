import {
  IEntity,
  STRING_MAX_LEN,
  STRING_MIN_LEN,
  UniqueEntity,
} from 'src/common/common.interface';

export const USER_REPO = 'USER_REPOSITORY';

export interface UniqueUser extends UniqueEntity {
  username: string;
}

export interface IUser extends IEntity, UniqueUser {
  password: string;
}

export interface ICreateUser extends Omit<IUser, keyof IEntity> {}

export const USERNAME_MAX_LEN = STRING_MAX_LEN;
export const USERNAME_MIN_LEN = STRING_MIN_LEN;

export const PASSWORD_MAX_LEN = STRING_MAX_LEN;
export const PASSWORD_MIN_LEN = 8;
