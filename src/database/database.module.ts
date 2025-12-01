import { Module } from '@nestjs/common';
import { databaseProviders } from '../database.provider';

@Module({
  providers: [...databaseProviders],
  exports: ['DATA_SOURCE'],
})
export class DatabaseModule {}
