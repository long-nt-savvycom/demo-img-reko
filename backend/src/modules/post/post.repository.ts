import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBaseRepository } from 'src/common/base.repository';
import { GenericFilter, SortOrder, UniqueEntity } from 'src/common/common.interface';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { FindManyPost, IPost, POST_REPO, UniquePost } from './post.interface';

@Injectable()
export class PostRepo implements IBaseRepository<Post> {
  constructor(
    @Inject(POST_REPO)
    private readonly postRepo: Repository<Post>,
  ) {}

  public getBaseRepo() {
    return this.postRepo;
  }

  public async checkExisted(query: FindOptionsWhere<Post>): Promise<number> {
    const existed = await this.postRepo.count({ where: query });
    if (!existed) {
      throw new NotFoundException('post not found');
    }
    return existed;
  }

  protected createOrderQuery(filter: GenericFilter<IPost>) {
    const order: { [k in keyof Partial<IPost>]: SortOrder } = {};

    order.created_at = SortOrder.DESC;

    if (filter.orderBy) {
      order[filter.orderBy] = filter.sortOrder || SortOrder.DESC;
      return order;
    }
    return order;
  }

  public async findOne(query: UniquePost): Promise<Post | null> {
    return this.postRepo.findOne({ where: query });
  }

  public findPaging(
    filter: GenericFilter<IPost>,
    query: FindManyPost,
  ): Promise<[Post[], number]> {
    return this.postRepo.findAndCount({
      order: this.createOrderQuery(filter),
      skip: (filter.page - 1) * filter.pageSize,
      take: filter.pageSize,
      where: query,
    });
  }

  async updateEntity(query: UniqueEntity, updateBody: Partial<Post>): Promise<boolean> {
    const updated = await this.postRepo.update(query, updateBody);
    return updated.affected ? updated.affected > 0 : false;
  }

  async createEntity(createBody: Post): Promise<Post> {
    const entity = this.postRepo.create(createBody); // Use the repository's create method
    return this.postRepo.save(entity);
  }

  async deleteEntity(query: UniqueEntity): Promise<boolean> {
    const deleted = await this.postRepo.softDelete(query);
    return deleted.affected ? deleted.affected > 0 : false;
  }
}
