import { Controller, Get } from '@nestjs/common';
import { AnimeService } from './anime.service';
import { Anime } from './anime.entity';

@Controller('animes')
export class AnimeController {
  constructor(private readonly animeService: AnimeService) {}

  @Get()
  getAll(): Anime[] {
    return this.animeService.findAll();
  }
}
