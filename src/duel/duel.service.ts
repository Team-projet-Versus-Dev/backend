import { Injectable } from '@nestjs/common';
import { Duel } from './duel.entity';
import { AnimeService } from '../anime/anime.service';

@Injectable()
export class DuelService {
  private currentId = 1;

  constructor(private readonly animeService: AnimeService) {}

  getRandomDuel(): Duel {
    const animes = this.animeService.findAll();
    if (animes.length < 2) {
      throw new Error('Not enough animes to create a duel');
    }

    const shuffled = [...animes].sort(() => Math.random() - 0.5);
    const [left, right] = shuffled.slice(0, 2);

    const duel: Duel = {
      id: this.currentId++,
      left,
      right,
    };

    return duel;
  }
}
