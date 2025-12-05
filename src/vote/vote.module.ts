import { Module } from '@nestjs/common';
import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';
import { AnimeModule } from '../anime/anime.module';

@Module({
  imports: [AnimeModule],
  providers: [VoteService],
  controllers: [VoteController],
})
export class VoteModule {}
