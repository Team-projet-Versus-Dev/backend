import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../auth/user.entity';

@Entity('jeux')
export class Jeu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string; // Nom du tournoi

  @Column()
  userId: number; // L'utilisateur qui a créé le tournoi

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // constructeur optionnel
  constructor(partial?: Partial<Jeu>) {
    if (partial) Object.assign(this, partial);
  }
}
