import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, Delete } from '@nestjs/common';
import { CombatService } from './combat.service';
import { Combat } from './combat.entity';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('combat')
export class CombatController {
  constructor(private readonly combatService: CombatService) {}

  @Post('jeu/:jeuId')
  @UseGuards(JwtGuard)
  async createBattle(@Param('jeuId', ParseIntPipe) jeuId: number): Promise<Combat> {
    return this.combatService.createBattle(jeuId);
  }

  @Get('jeu/:jeuId')
  async findByJeu(@Param('jeuId', ParseIntPipe) jeuId: number): Promise<Combat[]> {
    return this.combatService.findByJeuId(jeuId);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Combat | null> {
    return this.combatService.findById(id);
  }

  @Post(':id/result')
  @UseGuards(JwtGuard)
  async submitResult(
    @Param('id', ParseIntPipe) id: number,
    @Body('animeId') animeId: number,
  ): Promise<Combat> {
    return this.combatService.submitResult(id, animeId);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deleteCombat(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.combatService.deleteCombat(id);
  }
}
