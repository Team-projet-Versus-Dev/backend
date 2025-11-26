import { IsInt } from 'class-validator';

export class CreateVoteDto {
  @IsInt()
  duelId: number;

  @IsInt()
  winnerId: number;

  @IsInt()
  loserId: number;
}
