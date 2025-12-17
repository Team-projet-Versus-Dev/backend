// src/auth/dto/login.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * DTO pour la connexion
 * Validation des entrées utilisateur
 */
export class LoginDto {
  @IsEmail({}, { message: 'Format d\'email invalide' })
  email: string;

  @IsString()
  @MinLength(1, { message: 'Le mot de passe est requis' })
  password: string;
}
