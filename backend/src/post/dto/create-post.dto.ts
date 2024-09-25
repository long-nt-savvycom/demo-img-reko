import { tags } from 'typia';
import {
  CONTENT_MAX_LEN,
  CONTENT_MIN_LEN,
  ICreatePost,
  TITLE_MAX_LEN,
  TITLE_MIN_LEN,
} from '../post.interface';

export interface CreatePostDto extends Omit<ICreatePost, 'views' | 'user'> {
  title: string &
    tags.MinLength<typeof TITLE_MIN_LEN> &
    tags.MaxLength<typeof TITLE_MAX_LEN>;

  content: string &
    tags.MinLength<typeof CONTENT_MIN_LEN> &
    tags.MaxLength<typeof CONTENT_MAX_LEN>;
}
