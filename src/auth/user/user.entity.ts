// src/auth/user/user.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Entité User pour l'authentification
 * La table sera nommée "users" dans PostgreSQL
 */
@Entity('users')  // Nom explicite de la table
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  // Mot de passe hashé avec Argon2
  // select: false empêche de récupérer le password par défaut
  @Column({ select: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;
}
