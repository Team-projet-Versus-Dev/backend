import { Injectable, BadRequestException } from '@nestjs/common';
import { Vote } from './vote.entity';
import { AnimeService } from '../anime/anime.service';

export interface RankingEntry {
  animeId: number;
  name: string;
  wins: number;
  losses: number;
  total: number;
  winRate: number;
}


@Injectable()
export class VoteService {
  private votes: Vote[] = [];

  constructor(private readonly animeService: AnimeService) {}

  createVote(vote: Vote): void {
    const winner = this.animeService.findOne(vote.winnerId);
    const loser = this.animeService.findOne(vote.loserId);

    if (!winner || !loser || winner.id === loser.id) {
      throw new BadRequestException('Invalid vote');
    }

    this.votes.push(vote);
  }

  getRanking(): RankingEntry[] {
    const stats = new Map<number, RankingEntry>();

    for (const anime of this.animeService.findAll()) {
      stats.set(anime.id, {
        animeId: anime.id,
        name: anime.name,
        wins: 0,
        losses: 0,
        total: 0,
        winRate: 0,
      });
    }

    for (const v of this.votes) {
      const winEntry = stats.get(v.winnerId);
      const loseEntry = stats.get(v.loserId);
      if (winEntry) {
        winEntry.wins++;
        winEntry.total++;
      }
      if (loseEntry) {
        loseEntry.losses++;
        loseEntry.total++;
      }
    }

    return Array.from(stats.values())
      .map((e) => ({
        ...e,
        winRate: e.total === 0 ? 0 : e.wins / e.total,
      }))
      .sort((a, b) => b.winRate - a.winRate);
  }
}
