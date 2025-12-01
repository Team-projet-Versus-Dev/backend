import { Combat } from './combat.entity';

export const combatProviders = [
  {
    provide: 'COMBAT_REPOSITORY',
    useFactory: (dataSource) => dataSource.getRepository(Combat),
    inject: ['DATA_SOURCE'],
  },
];
