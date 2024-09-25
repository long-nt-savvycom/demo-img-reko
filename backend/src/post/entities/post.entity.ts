import { BaseEntity } from 'src/common/common.interface';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CONTENT_MAX_LEN, IPost, TITLE_MAX_LEN } from '../post.interface';

@Entity()
export class Post extends BaseEntity implements IPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: TITLE_MAX_LEN })
  title: string;

  @Column({ length: CONTENT_MAX_LEN })
  content: string;

  @Column('int')
  views: number;

  @Column({ type: 'boolean' })
  isPublished: boolean;

  @Column()
  userId: number;

  @ManyToOne((type) => User, (user) => user.posts)
  @JoinColumn({ name: 'userId' })
  user: User | number;
}
