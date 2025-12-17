import {
  Injectable,
  Inject,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './user/user.entity';
import { CryptoService } from '../crypto/crypto.service';
import * as argon2 from 'argon2';

/**
 * Service d'authentification sécurisé
 * 
 * SÉCURITÉS IMPLÉMENTÉES :
 * - Argon2id pour le hashage des mots de passe (+ salt automatique)
 * - JWT pour l'authentification
 * - Code de déchiffrement unique par utilisateur
 */
@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly cryptoService: CryptoService,
  ) {}

  /**
   * Inscription d'un nouvel utilisateur
   */
  async signup(email: string, password: string): Promise<{
    accessToken: string;
    decryptionCode: string;
    user: { id: number; email: string; createdAt: Date };
  }> {
    const normalizedEmail = email.trim().toLowerCase();

    // Vérifier si l'email existe déjà
    const existing = await this.userRepo.findOneBy({ email: normalizedEmail });
    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    // Hashage avec Argon2id (le SALT est généré automatiquement)
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    const user = this.userRepo.create({
      email: normalizedEmail,
      password: hashedPassword,
    });
    await this.userRepo.save(user);

    // Générer le token JWT
    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    // Générer le CODE DE DÉCHIFFREMENT unique pour cet utilisateur
    const decryptionCode = this.cryptoService.generateUserDecryptionCode(
      user.id,
      user.email,
    );

    console.log('========================================');
    console.log('🔐 NOUVEAU COMPTE CRÉÉ');
    console.log(`   Email: ${user.email}`);
    console.log(`   Code de déchiffrement: ${decryptionCode}`);
    console.log('========================================');

    return {
      accessToken,
      decryptionCode,  // ← Le code est envoyé à l'utilisateur !
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }

  /**
   * Connexion d'un utilisateur existant
   */
  async login(email: string, password: string): Promise<{
    accessToken: string;
    decryptionCode: string;
    user: { id: number; email: string; createdAt: Date };
  }> {
    const normalizedEmail = email.trim().toLowerCase();

    // Récupérer l'utilisateur avec son mot de passe
    const user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: normalizedEmail })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Vérifier le mot de passe avec Argon2
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Générer le token JWT
    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    // Générer le CODE DE DÉCHIFFREMENT
    const decryptionCode = this.cryptoService.generateUserDecryptionCode(
      user.id,
      user.email,
    );

    console.log('========================================');
    console.log('🔓 CONNEXION RÉUSSIE');
    console.log(`   Email: ${user.email}`);
    console.log(`   Code de déchiffrement: ${decryptionCode}`);
    console.log('========================================');

    return {
      accessToken,
      decryptionCode,  // ← Le code est envoyé à l'utilisateur !
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }
}
