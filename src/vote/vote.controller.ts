import { Body, Controller, Get, Post } from '@nestjs/common';
import { VoteService } from './vote.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { Vote } from './vote.entity';
import type { RankingEntry } from './vote.service';


@Controller()
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Post('votes')
  create(@Body() dto: CreateVoteDto) {
    const vote: Vote = {
      duelId: dto.duelId,
      winnerId: dto.winnerId,
      loserId: dto.loserId,
      createdAt: new Date(),
    };
    this.voteService.createVote(vote);
    return { success: true };
  }

    @Get('ranking')
  getRanking(): RankingEntry[] {
    return this.voteService.getRanking();
  }

}
