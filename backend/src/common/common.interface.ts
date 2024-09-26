import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { FastifyRequest } from 'fastify';
import { tags } from 'typia';

export interface UniqueEntity {
  id?: number;
}

export interface IEntity extends UniqueEntity {
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

@Entity()
export abstract class BaseEntity implements IEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date | null;
}

export const STRING_MAX_LEN = 50;
export const STRING_MIN_LEN = 1;

export interface AppRequest extends FastifyRequest {
  user: UniqueEntity;
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export const PAGE_MIN_LEN = STRING_MIN_LEN;
export const PAGE_SIZE_MAX_LEN = 100;
export const PAGE_SIZE_MIN_LEN = 1;

export interface GenericFilter<T> {
  page: number & tags.Minimum<typeof PAGE_MIN_LEN>;

  pageSize: number &
    tags.Minimum<typeof PAGE_SIZE_MIN_LEN> &
    tags.Maximum<typeof PAGE_SIZE_MAX_LEN>;

  orderBy?: keyof T;

  sortOrder?: SortOrder;
}
