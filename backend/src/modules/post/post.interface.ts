import {
  IEntity,
  STRING_MAX_LEN,
  STRING_MIN_LEN,
  UniqueEntity,
} from 'src/common/common.interface';
import { IUser } from 'src/modules/user/user.interface';
import { PostStatus } from './entities/post.entity';
import { User } from 'src/modules/user/entities/user.entity';

export const POST_REPO = 'POST_REPOSITORY';

export interface UniquePost extends UniqueEntity {}

export interface UserManyPost {
  user?: IUser;
  userId?: number;
}

export interface FindManyPost extends UserManyPost {
  user?: User;
  userId?: number;
}

export interface IPost extends IEntity, UniquePost, UserManyPost {
  title: string;
  image_url: string;
  status: PostStatus;
  label?: string | null;
}

export interface IPostRes extends Omit<IPost, keyof UserManyPost> {}

export interface ICreatePost extends Omit<IPost, keyof IEntity> {}

export interface IUserCreatePost extends Pick<IPost, 'title'> {}

export const TITLE_MIN_LEN = STRING_MIN_LEN;
export const TITLE_MAX_LEN = STRING_MAX_LEN;

export const CONTENT_MIN_LEN = 10;
export const CONTENT_MAX_LEN = 500;

export interface PaginatePostResponse {
  posts: IPostRes[];
  total: number;
}

export interface JobRekognitionPayload {
  postId?: number;
}
