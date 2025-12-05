// src/app.module.ts
import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { ConfigModule } from '@nestjs/config';
import { DatabaseProvider } from './database.provider';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { QuestionnaireModule } from './questionnaire/questionnaire.module';
import { QuestionModule } from './question/question.module';
import { CombatModule } from './combat/combat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    QuestionnaireModule,
    QuestionModule,
    CombatModule,
  ],
  providers: [...DatabaseProvider],
  exports: [...DatabaseProvider],
=======
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnimeModule } from './anime/anime.module';
import { DuelModule } from './duel/duel.module';
import { VoteModule } from './vote/vote.module';

@Module({
  imports: [AnimeModule, DuelModule, VoteModule],
  controllers: [AppController],
  providers: [AppService],
>>>>>>> 1075418caabae709903ac7181232c477ef936749
})
export class AppModule {}
