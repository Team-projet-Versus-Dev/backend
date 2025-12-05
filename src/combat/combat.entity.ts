import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Jeu } from '../questionnaire/questionnaire.entity';
import { AnimeEnJeu } from '../question/question.entity';

@Entity('combats')
export class Combat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  jeuId: number; // L'ID du jeu

  @ManyToOne(() => Jeu)
  @JoinColumn({ name: 'jeuId' })
  jeu: Jeu;

  @Column()
  anime1Id: number; // ID du premier anime

  @ManyToOne(() => AnimeEnJeu)
  @JoinColumn({ name: 'anime1Id' })
  anime1: AnimeEnJeu;

  @Column()
  anime2Id: number; // ID du deuxième anime

  @ManyToOne(() => AnimeEnJeu)
  @JoinColumn({ name: 'anime2Id' })
  anime2: AnimeEnJeu;

  @Column({ nullable: true })
  gagnantId: number; // ID de l'anime gagnant (null si pas encore joué)

  @Column({ nullable: true })
  choixUtilisateur: number; // L'anime que l'utilisateur a choisi

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  constructor(partial?: Partial<Combat>) {
    if (partial) Object.assign(this, partial);
  }
}
