import { IPost } from '../post.interface';

export interface UpdatePostDto extends Pick<IPost, 'status'> {}
