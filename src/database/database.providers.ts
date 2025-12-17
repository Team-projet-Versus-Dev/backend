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
      const username = configService.get<string>('DB_USERNAME');
      const password = configService.get<string>('DB_PASSWORD');
      const database = configService.get<string>('DB_NAME');

      console.log('========================================');
      console.log('🔌 Connexion à Neon PostgreSQL...');
      console.log('📍 Host:', host);
      console.log('📍 Port:', port);
      console.log('📍 Database:', database);
      console.log('📍 Username:', username);
      console.log('========================================');

      const dataSource = new DataSource({
        type: 'postgres',
        host,
        port,
        username,
        password,
        database,
        ssl: {
          rejectUnauthorized: false,
        },
        entities: [User, Jeu, AnimeEnJeu, Combat],
        synchronize: true,  // Crée automatiquement les tables
        logging: ['query', 'error', 'warn'],  // Log toutes les requêtes
      });

      try {
        await dataSource.initialize();
        console.log('✅ Connexion à Neon réussie !');
        console.log('📋 Tables synchronisées: users, jeux, animes_en_jeu, combats');
        return dataSource;
      } catch (error) {
        console.error('❌ Erreur de connexion à Neon:', error);
        throw error;
      }
    },
  },
];
