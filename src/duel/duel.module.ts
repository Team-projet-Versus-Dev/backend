import { Module } from '@nestjs/common';
import { DuelService } from './duel.service';
import { DuelController } from './duel.controller';
import { AnimeModule } from '../anime/anime.module';

@Module({
  imports: [AnimeModule],
  providers: [DuelService],
  controllers: [DuelController],
  exports: [DuelService],
})
export class DuelModule {}
