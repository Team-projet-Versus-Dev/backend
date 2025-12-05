// src/app.module.ts
import { Module } from '@nestjs/common';
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
})
export class AppModule {}
