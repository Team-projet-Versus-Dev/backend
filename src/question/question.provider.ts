import { AnimeEnJeu } from './question.entity';

export const animeEnJeuProviders = [
  {
    provide: 'ANIME_EN_JEU_REPOSITORY',
    useFactory: (dataSource) => dataSource.getRepository(AnimeEnJeu),
    inject: ['DATA_SOURCE'],
  },
];
