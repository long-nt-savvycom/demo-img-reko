import { BaseEntity, GenericFilter, UniqueEntity } from './common.interface';

export interface IBaseRepository<T extends BaseEntity> {
  createEntity(createBody: T): Promise<T>;

  findOne(query: UniqueEntity): Promise<T | null>;

  updateEntity(query: UniqueEntity, updateBody: Partial<T>): Promise<boolean>;

  deleteEntity(query: UniqueEntity, updateBody: Partial<T>): Promise<boolean>;

  findPaging(filter: GenericFilter<T>, query: Partial<T>): Promise<[T[], number]>;
}
