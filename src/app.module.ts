import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { AnimeModule } from './anime/anime.module';
import { DuelModule } from './duel/duel.module';
import { QuestionModule } from './question/question.module';
import { QuestionnaireModule } from './questionnaire/questionnaire.module';
import { CombatModule } from './combat/combat.module';
import { VoteModule } from './vote/vote.module';

import { JikanController } from './jikan.controller';
import { JikanService } from './jikan.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    AnimeModule,
    DuelModule,
    QuestionModule,
    QuestionnaireModule,
    CombatModule,
    VoteModule,
  ],
  controllers: [JikanController],
  providers: [JikanService],
})
export class AppModule {}
