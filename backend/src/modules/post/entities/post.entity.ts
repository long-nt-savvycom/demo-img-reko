import { BaseEntity } from 'src/common/common.interface';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IPost, TITLE_MAX_LEN } from '../post.interface';

export enum PostStatus {
  OPEN = 'open',
  REJECTED = 'rejected',
  APPROVED = 'approved',
  INAPPROPRIATE_DETECTED = 'inappropriate_detected',
  APPROPRIATED = 'appropriated',
}

@Entity()
export class Post extends BaseEntity implements IPost {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ length: TITLE_MAX_LEN })
  title: string;

  @Column()
  image_url: string;

  @Column({ nullable: true })
  labels?: string;

  @Column({ nullable: true })
  label?: string;

  @Column({ type: 'enum', enum: PostStatus })
  status: PostStatus;

  @Column()
  userId: number;

  @ManyToOne((type) => User, (user) => user.posts)
  @JoinColumn({ name: 'userId' })
  user?: User;
}
