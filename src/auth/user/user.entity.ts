// src/user/user.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  // mot de passe hashé, mais on évite de le sélectionner par défaut
  @Column({ select: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;
}
