import { Module } from '@nestjs/common';
import { AnimeEnJeuService } from './question.service';
import { AnimeEnJeuController } from './question.controller';
import { animeEnJeuProviders } from './question.provider';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AnimeEnJeuController],
  providers: [AnimeEnJeuService, ...animeEnJeuProviders],
  exports: [AnimeEnJeuService],
})
export class QuestionModule {}
