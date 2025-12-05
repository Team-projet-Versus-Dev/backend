import { DataSource } from 'typeorm';
import { User } from './auth/user/user.entity';
import { Jeu } from './questionnaire/questionnaire.entity';
import { AnimeEnJeu } from './question/question.entity';
import { Combat } from './combat/combat.entity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT ?? 5432),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
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
