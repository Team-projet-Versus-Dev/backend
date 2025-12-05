// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';     // 👈 IMPORT MANQUANT !
import { databaseProviders } from './database.providers';

@Module({
  imports: [ConfigModule],                        // 👈 pour que ConfigService soit dispo
  providers: [...databaseProviders],              // DATA_SOURCE provider
  exports: [...databaseProviders],                // rendre DATA_SOURCE accessible
})
export class DatabaseModule {}
