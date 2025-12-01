import { Module } from '@nestjs/common';
import { CombatService } from './combat.service';
import { CombatController } from './combat.controller';
import { combatProviders } from './combat.provider';
import { DatabaseModule } from '../database/database.module';
import { QuestionModule } from '../question/question.module';

@Module({
  imports: [DatabaseModule, QuestionModule],
  controllers: [CombatController],
  providers: [CombatService, ...combatProviders],
})
export class CombatModule {}
