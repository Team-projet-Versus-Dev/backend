import { Injectable } from '@nestjs/common';
import { Anime } from './anime.entity';

@Injectable()
export class AnimeService {
  // Pour l’instant : données en dur
  private animes: Anime[] = [
    { id: 1, name: 'Attack on Titan' },
    { id: 2, name: 'Jujutsu Kaisen' },
    { id: 3, name: 'Demon Slayer' },
    { id: 4, name: 'My Hero Academia' },
    { id: 5, name: 'Chainsaw Man' },
  ];

  findAll(): Anime[] {
    return this.animes;
  }

  findOne(id: number): Anime | undefined {
    return this.animes.find((a) => a.id === id);
  }
}
