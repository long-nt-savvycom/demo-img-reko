import {
  IEntity,
  STRING_MAX_LEN,
  STRING_MIN_LEN,
  UniqueEntity,
} from 'src/common/common.interface';
import { IUser } from 'src/user/user.interface';

export const POST_REPO = 'POST_REPOSITORY';

export interface UniquePost extends UniqueEntity {}

export interface UserManyPost {
  user?: IUser | number;
}

export interface FindManyPost extends UserManyPost {
  user: number;
}

export interface IPost extends IEntity, UniquePost, UserManyPost {
  title: string;
  content: string;
  views: number;
  isPublished: boolean;
}

export interface ICreatePost extends Omit<IPost, keyof IEntity> {}

export const TITLE_MIN_LEN = STRING_MIN_LEN;
export const TITLE_MAX_LEN = STRING_MAX_LEN;

export const CONTENT_MIN_LEN = 10;
export const CONTENT_MAX_LEN = 500;

export interface PaginatePostResponse {
  posts: IPost[];
  total: number;
}
