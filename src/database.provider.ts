import { DataSource } from 'typeorm';
import { User } from './auth/user.entity';
import { Jeu } from './questionnaire/questionnaire.entity';
import { AnimeEnJeu } from './question/question.entity';
import { Combat } from './combat/combat.entity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'ep-bold-frog-ada7p8ux-pooler.c-2.us-east-1.aws.neon.tech',
        port: 5432,
        username: 'neondb_owner',
        password: 'npg_D5XbvSIynNg6',
        database: 'neondb',
        ssl: {
          rejectUnauthorized: false,
        },
        entities: [User, Jeu, AnimeEnJeu, Combat],
        synchronize: true,
        logging: false,
      });

      return dataSource.initialize();
    },
  },
];

