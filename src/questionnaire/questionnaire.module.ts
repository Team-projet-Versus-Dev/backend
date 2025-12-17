// src/questionnaire/questionnaire.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JeuService } from './questionnaire.service';
import { JeuController } from './questionnaire.controller';
import { jeuProviders } from './questionnaire.provider';
import { DatabaseModule } from '../database/database.module';
import { CryptoModule } from '../crypto/crypto.module';

@Module({
  imports: [
    DatabaseModule,
    CryptoModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [JeuController],
  providers: [JeuService, ...jeuProviders],
  exports: [JeuService],
})
export class QuestionnaireModule {}
