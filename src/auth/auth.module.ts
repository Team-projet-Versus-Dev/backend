import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { userProviders } from './user/user.provider';
import { DatabaseModule } from '../database/database.module';
import { CryptoModule } from '../crypto/crypto.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    DatabaseModule,
    CryptoModule,  // Pour générer les codes de déchiffrement
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<JwtModuleOptions> => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ...userProviders],
  exports: [AuthService],
})
export class AuthModule {}
