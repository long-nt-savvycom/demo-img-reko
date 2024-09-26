import { BaseEntity } from 'src/common/common.interface';
import { Post } from 'src/modules/post/entities/post.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { IUser, USERNAME_MAX_LEN } from '../user.interface';

@Entity()
export class User extends BaseEntity implements IUser {
  @Column({ length: USERNAME_MAX_LEN, unique: true })
  username: string;

  @Column({ length: 500 }) // dont use PASSWORD_MAX_LEN because password hash
  password: string;

  @OneToMany((type) => Post, (photo) => photo.user)
  posts: Post[];
}
