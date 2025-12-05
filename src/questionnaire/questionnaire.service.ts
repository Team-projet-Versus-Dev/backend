import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Jeu } from './questionnaire.entity';

@Injectable()
export class JeuService {
  constructor(
    @Inject('JEU_REPOSITORY')
    private readonly repo: Repository<Jeu>,
  ) {}

  async findAll(): Promise<Jeu[]> {
    return this.repo.find({ relations: ['user'] });
  }

  async findById(id: number): Promise<Jeu | null> {
    return this.repo.findOne({ where: { id }, relations: ['user'] });
  }

  async create(nom: string, userId: number): Promise<Jeu> {
    const jeu = this.repo.create({ nom, userId });
    return this.repo.save(jeu);
  }

  async findByUser(userId: number): Promise<Jeu[]> {
    return this.repo.find({ where: { userId }, relations: ['user'] });
  }
}
