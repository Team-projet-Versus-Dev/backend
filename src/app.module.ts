import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnimeModule } from './anime/anime.module';
import { DuelModule } from './duel/duel.module';
import { VoteModule } from './vote/vote.module';

@Module({
  imports: [AnimeModule, DuelModule, VoteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
