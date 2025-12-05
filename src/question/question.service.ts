import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AnimeEnJeu } from './question.entity';

export interface CreateAnimeEnJeuDto {
  jeuId: number;
  jikanId: number;
  titre: string;
  image: string;
}

@Injectable()
export class AnimeEnJeuService {
  constructor(
    @Inject('ANIME_EN_JEU_REPOSITORY')
    private readonly repo: Repository<AnimeEnJeu>,
  ) {}

  async create(dto: CreateAnimeEnJeuDto): Promise<AnimeEnJeu> {
    const anime = this.repo.create(dto);
    return this.repo.save(anime);
  }

  async findByJeuId(jeuId: number): Promise<AnimeEnJeu[]> {
    return this.repo.find({ where: { jeuId }, order: { id: 'DESC' } });
  }

  async findById(id: number): Promise<AnimeEnJeu | null> {
    return this.repo.findOneBy({ id });
  }

  async updateScore(id: number, victoire: boolean): Promise<AnimeEnJeu> {
    const anime = await this.findById(id);
    if (!anime) {
      throw new BadRequestException('Anime not found');
    }

    if (victoire) {
      anime.victoires += 1;
    } else {
      anime.defaites += 1;
    }
    return this.repo.save(anime);
  }

  async deleteAnime(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async findRandomTwoByJeuId(jeuId: number): Promise<AnimeEnJeu[]> {
    const animes = await this.findByJeuId(jeuId);
    if (animes.length < 2) {
      throw new BadRequestException('Il faut au moins 2 animes dans le jeu');
    }

    // Sélectionner aléatoirement 2 animes différents
    const shuffled = animes.sort(() => Math.random() - 0.5);
    return [shuffled[0], shuffled[1]];
  }
}
