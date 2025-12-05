import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { AnimeEnJeuService } from './question.service';
import { AnimeEnJeu } from './question.entity';
import { JwtGuard } from '../auth/jwt.guard';
import { CreateAnimeEnJeuDto } from '../auth/dto/create-anime-en-jeu.dto';

@Controller('anime')
export class AnimeEnJeuController {
  constructor(private readonly animeEnJeuService: AnimeEnJeuService) {}

  @Post()
  @UseGuards(JwtGuard)
  async create(@Body() dto: CreateAnimeEnJeuDto): Promise<AnimeEnJeu> {
    return this.animeEnJeuService.create(dto);
  }

  @Get('jeu/:jeuId')
  async findByJeu(
    @Param('jeuId', ParseIntPipe) jeuId: number,
  ): Promise<
    {
      id: number;
      jikanId: number;
      titre: string;
      image: string;
      victoires: number;
      defaites: number;
    }[]
  > {
    const items = await this.animeEnJeuService.findByJeuId(jeuId);

    return items.map((anime) => ({
      id: anime.id,
      jikanId: anime.jikanId,
      titre: anime.titre,
      image: anime.image,
      victoires: anime.victoires,
      defaites: anime.defaites,
      // on ne renvoie pas jeuId, createdAt, etc. si le front n'en a pas besoin
    }));
  }

  @Get('random/:jeuId')
  async getRandomTwo(
    @Param('jeuId', ParseIntPipe) jeuId: number,
  ): Promise<
    {
      id: number;
      jikanId: number;
      titre: string;
      image: string;
      victoires: number;
      defaites: number;
    }[]
  > {
    const items = await this.animeEnJeuService.findRandomTwoByJeuId(jeuId);

    // même format de réponse que findByJeu
    return items.map((anime) => ({
      id: anime.id,
      jikanId: anime.jikanId,
      titre: anime.titre,
      image: anime.image,
      victoires: anime.victoires,
      defaites: anime.defaites,
    }));
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AnimeEnJeu> {
    const anime = await this.animeEnJeuService.findById(id);

    if (!anime) {
      throw new NotFoundException('Anime non trouvé');
    }

    return anime;
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deleteAnime(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.animeEnJeuService.deleteAnime(id);
  }
}
