// src/question/dto/create-anime-en-jeu.dto.ts
import { IsInt, IsString, IsUrl } from 'class-validator';

export class CreateAnimeEnJeuDto {
  @IsInt()
  jeuId: number;

  @IsInt()
  jikanId: number;

  @IsString()
  titre: string;

  // Si ton image n'est pas toujours une vraie URL, tu peux mettre IsString()
  @IsUrl()
  image: string;
}
