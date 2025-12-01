import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { JeuService } from './questionnaire.service';
import { Jeu } from './questionnaire.entity';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('jeu')
export class JeuController {
  constructor(private readonly jeuService: JeuService) {}

  @Get()
  findAll(): Promise<Jeu[]> {
    return this.jeuService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number): Promise<Jeu | null> {
    return this.jeuService.findById(id);
  }

  @Post()
  @UseGuards(JwtGuard)
  create(@Body('nom') nom: string, @Request() req: any): Promise<Jeu> {
    const userId = req.user.id;
    return this.jeuService.create(nom, userId);
  }

  @Get('utilisateur/:userId')
  findByUser(@Param('userId', ParseIntPipe) userId: number): Promise<Jeu[]> {
    return this.jeuService.findByUser(userId);
  }
}
