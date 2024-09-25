import { DATA_SOURCE } from 'src/database/database.constants';
import { DataSource } from 'typeorm';
import { Post } from './entities/post.entity';
import { POST_REPO } from './post.interface';

export const postProviders = [
  {
    provide: POST_REPO,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Post),
    inject: [DATA_SOURCE],
  },
];
