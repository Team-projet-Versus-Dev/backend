// src/database/database.providers.ts
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { User } from '../auth/user/user.entity';
import { Jeu } from '../questionnaire/questionnaire.entity';
import { AnimeEnJeu } from '../question/question.entity';
import { Combat } from '../combat/combat.entity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const host = configService.get<string>('DB_HOST');
      const port = Number(configService.get<string>('DB_PORT') ?? 5432);
      const username =
        configService.get<string>('DB_USERNAME') ?? 'neondb_owner'; // 👈 fallback
      const password = configService.get<string>('DB_PASSWORD');
      const database = configService.get<string>('DB_NAME');

      // (optionnel) petit log pour vérifier ce qui est lu
      console.log('[DB CONFIG]', { host, port, username, database });

      const dataSource = new DataSource({
        type: 'postgres',
        host,
        port,
        username,
        password,
        database,
        ssl: { rejectUnauthorized: false },
        entities: [User, Jeu, AnimeEnJeu, Combat],
        synchronize: true,
        logging: false,
      });

      return dataSource.initialize();
    },
  },
];
