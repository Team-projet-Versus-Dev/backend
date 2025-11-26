import { Controller, Get } from '@nestjs/common';
import { DuelService } from './duel.service';

@Controller('duels')
export class DuelController {
  constructor(private readonly duelService: DuelService) {}

  @Get('random')
  getRandomDuel() {
    return this.duelService.getRandomDuel();
  }
}
