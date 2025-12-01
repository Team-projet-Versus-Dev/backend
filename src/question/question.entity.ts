import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Jeu } from '../questionnaire/questionnaire.entity';

@Entity('animes_en_jeu')
export class AnimeEnJeu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  jeuId: number; // L'ID du jeu auquel cet anime appartient

  @ManyToOne(() => Jeu)
  @JoinColumn({ name: 'jeuId' })
  jeu: Jeu;

  @Column()
  jikanId: number; // ID de l'anime sur Jikan

  @Column()
  titre: string; // Titre de l'anime (depuis Jikan)

  @Column()
  image: string; // URL de l'image (depuis Jikan)

  @Column({ type: 'int', default: 0 })
  victoires: number; // Nombre de victoires

  @Column({ type: 'int', default: 0 })
  defaites: number; // Nombre de défaites

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  constructor(partial?: Partial<AnimeEnJeu>) {
    if (partial) Object.assign(this, partial);
  }
}
