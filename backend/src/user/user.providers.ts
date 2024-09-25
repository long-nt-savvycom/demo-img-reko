
import { DATA_SOURCE } from 'src/database/database.constants';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { USER_REPO } from './user.interface';

export const userProviders = [
  {
    provide: USER_REPO,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [DATA_SOURCE],
  },
];
