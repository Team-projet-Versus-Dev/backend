// src/database.provider.ts
import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './user/user.entity';
import { Jeu } from './questionnaire/jeu.entity';
import { AnimeEnJeu } from './question/anime-en-jeu.entity';
import { Combat } from './combat/combat.entity';

export const DatabaseProvider = [
  {
    provide: 'DATA_SOURCE',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        ssl: { rejectUnauthorized: false },
        entities: [User, Jeu, AnimeEnJeu, Combat],
        // ⚠️ true uniquement en local
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        logging: false,
      });

      return dataSource.initialize();
    },
  },
];
