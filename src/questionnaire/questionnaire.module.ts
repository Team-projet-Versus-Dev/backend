import { Module } from '@nestjs/common';
import { JeuService } from './questionnaire.service';
import { JeuController } from './questionnaire.controller';
import { jeuProviders } from './questionnaire.provider';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [JeuController],
  providers: [JeuService, ...jeuProviders],
})
export class QuestionnaireModule {}
