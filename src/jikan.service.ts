import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class JikanService {
  private readonly logger = new Logger(JikanService.name);
  private readonly base = 'https://api.jikan.moe/v4';

  async searchAnime(query: string) {
    try {
      const url = `${this.base}/anime`;
      const res = await axios.get(url, { params: { q: query } });
      return res.data;
    } catch (err) {
      this.logger.error('searchAnime error', err as any);
      throw err;
    }
  }

  async getAnimeById(id: number) {
    try {
      const url = `${this.base}/anime/${id}`;
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      this.logger.error('getAnimeById error', err as any);
      throw err;
    }
  }
}
