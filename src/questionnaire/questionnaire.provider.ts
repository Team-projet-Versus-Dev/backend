import { Jeu } from './questionnaire.entity';

export const jeuProviders = [
  {
    provide: 'JEU_REPOSITORY',
    useFactory: (dataSource) => dataSource.getRepository(Jeu),
    inject: ['DATA_SOURCE'],
  },
];
