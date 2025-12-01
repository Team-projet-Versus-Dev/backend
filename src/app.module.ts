import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JikanService } from './jikan.service';
import { JikanController } from './jikan.controller';
import { DatabaseModule } from './database/database.module';
import { QuestionnaireModule } from './questionnaire/questionnaire.module';
import { AuthModule } from './auth/auth.module';
import { QuestionModule } from './question/question.module';
import { CombatModule } from './combat/combat.module';

@Module({
  imports: [DatabaseModule, AuthModule, QuestionnaireModule, QuestionModule, CombatModule],
  controllers: [AppController, JikanController],
  providers: [AppService, JikanService],
})
export class AppModule {}
