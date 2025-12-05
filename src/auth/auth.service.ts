import { Injectable, Inject, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './user/user.entity';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(email: string, password: string): Promise<{ accessToken: string }> {
    const existing = await this.userRepo.findOneBy({ email });
    if (existing) throw new BadRequestException('Email already exists');

    // typage explicite
    const hashed: string = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({ email, password: hashed });
    await this.userRepo.save(user);

    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });
    return { accessToken };
  }

  async login(email: string, password: string): Promise<{ accessToken: string }> {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // typage explicite
    const isValid: boolean = await bcrypt.compare(password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });
    return { accessToken };
  }
}
