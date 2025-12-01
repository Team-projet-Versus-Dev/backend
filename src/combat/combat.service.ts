import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Combat } from './combat.entity';
import { AnimeEnJeuService } from '../question/question.service';

@Injectable()
export class CombatService {
  constructor(
    @Inject('COMBAT_REPOSITORY')
    private readonly repo: Repository<Combat>,
    private readonly animeEnJeuService: AnimeEnJeuService,
  ) {}

  async createBattle(jeuId: number): Promise<Combat> {
    // Récupérer 2 animes aléatoires
    const [anime1, anime2] = await this.animeEnJeuService.findRandomTwoByJeuId(jeuId);

    const combat = this.repo.create({
      jeuId,
      anime1Id: anime1.id,
      anime2Id: anime2.id,
    });
    return this.repo.save(combat);
  }

  async findById(id: number): Promise<Combat | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['anime1', 'anime2'],
    });
  }

  async findByJeuId(jeuId: number): Promise<Combat[]> {
    return this.repo.find({
      where: { jeuId },
      relations: ['anime1', 'anime2'],
      order: { id: 'DESC' },
    });
  }

  async submitResult(id: number, chosenAnimeId: number): Promise<Combat> {
    const combat = await this.findById(id);
    if (!combat) {
      throw new BadRequestException('Combat not found');
    }

    if (chosenAnimeId !== combat.anime1Id && chosenAnimeId !== combat.anime2Id) {
      throw new BadRequestException('Invalid anime choice');
    }

    // Déterminer le gagnant (pour maintenant, le choix de l'utilisateur est le gagnant)
    combat.choixUtilisateur = chosenAnimeId;
    combat.gagnantId = chosenAnimeId;

    // Mettre à jour les scores
    const gagnant = chosenAnimeId === combat.anime1Id ? combat.anime1 : combat.anime2;
    const perdant = chosenAnimeId === combat.anime1Id ? combat.anime2 : combat.anime1;

    await this.animeEnJeuService.updateScore(gagnant.id, true);
    await this.animeEnJeuService.updateScore(perdant.id, false);

    return this.repo.save(combat);
  }

  async deleteCombat(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
