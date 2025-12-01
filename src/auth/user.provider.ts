import { User } from './user.entity';

export const userProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource) => dataSource.getRepository(User),
    inject: ['DATA_SOURCE'],
  },
];
