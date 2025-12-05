import { Anime } from '../anime/anime.entity';

export interface Duel {
  id: number;
  left: Anime;
  right: Anime;
}

