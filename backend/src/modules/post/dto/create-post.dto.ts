import { tags } from 'typia';
import { IUserCreatePost, TITLE_MAX_LEN, TITLE_MIN_LEN } from '../post.interface';

export interface CreatePostDto extends IUserCreatePost {
  title: string &
    tags.MinLength<typeof TITLE_MIN_LEN> &
    tags.MaxLength<typeof TITLE_MAX_LEN>;

  // file: File; // or Blob if you are dealing with raw file data
}
