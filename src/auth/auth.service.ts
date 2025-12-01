import { Injectable, Inject, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(email: string, password: string): Promise<{ accessToken: string }> {
    // Vérifier que l'utilisateur n'existe pas déjà
    const existing = await this.userRepo.findOneBy({ email });
    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    // Hasher le mot de passe
    const hashed = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = this.userRepo.create({ email, password: hashed });
    await this.userRepo.save(user);

    // Générer JWT
    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });

    return { accessToken };
  }

  async login(email: string, password: string): Promise<{ accessToken: string }> {
    // Trouver l'utilisateur
    const user = await this.userRepo.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Comparer les mots de passe
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Générer JWT
    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });

    return { accessToken };
  }
}
