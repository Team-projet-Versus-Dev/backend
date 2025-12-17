// src/questionnaire/questionnaire.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../auth/user/user.entity';

/**
 * Entité Jeu (Questionnaire)
 * 
 * Le champ 'nom' stocke le titre CHIFFRÉ avec AES-256-GCM
 * Seuls les utilisateurs connectés peuvent voir le titre déchiffré
 */
@Entity('jeux')
export class Jeu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string; // Titre du questionnaire (CHIFFRÉ en base de données)

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // Champ virtuel (non stocké) pour le titre déchiffré
  nomDechiffre?: string;

  // Champ virtuel pour le titre masqué (utilisateurs non connectés)
  nomMasque?: string;

  constructor(partial?: Partial<Jeu>) {
    if (partial) Object.assign(this, partial);
  }
}
