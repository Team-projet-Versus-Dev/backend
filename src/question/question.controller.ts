import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, Delete } from '@nestjs/common';
import { AnimeEnJeuService } from './question.service';
import { AnimeEnJeu } from './question.entity';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('anime')
export class AnimeEnJeuController {
  constructor(private readonly animeEnJeuService: AnimeEnJeuService) {}

  @Post()
  @UseGuards(JwtGuard)
  async create(@Body() dto: {
    jeuId: number;
    jikanId: number;
    titre: string;
    image: string;
  }): Promise<AnimeEnJeu> {
    return this.animeEnJeuService.create(dto);
  }

  @Get('jeu/:jeuId')
  async findByJeu(@Param('jeuId', ParseIntPipe) jeuId: number): Promise<AnimeEnJeu[]> {
    return this.animeEnJeuService.findByJeuId(jeuId);
  }

  @Get('random/:jeuId')
  async getRandomTwo(@Param('jeuId', ParseIntPipe) jeuId: number): Promise<AnimeEnJeu[]> {
    return this.animeEnJeuService.findRandomTwoByJeuId(jeuId);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<AnimeEnJeu | null> {
    return this.animeEnJeuService.findById(id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deleteAnime(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.animeEnJeuService.deleteAnime(id);
  }
}
