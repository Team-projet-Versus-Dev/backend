// src/auth/dto/signup.dto.ts
import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

/**
 * DTO pour l'inscription
 * Validation des entrées pour prévenir les injections et données malformées
 */
export class SignupDto {
  @IsEmail({}, { message: 'Format d\'email invalide' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  @MaxLength(128, { message: 'Le mot de passe ne peut pas dépasser 128 caractères' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre',
  })
  password: string;
}
