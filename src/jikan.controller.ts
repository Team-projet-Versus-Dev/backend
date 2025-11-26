import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { JikanService } from './jikan.service';

@Controller('jikan')
export class JikanController {
  constructor(private readonly jikanService: JikanService) {}

  @Get('search')
  async search(@Query('q') q: string) {
    const raw = await this.jikanService.searchAnime(q || '');
    // On ne garde que le titre et l'image principale
    return {
      pagination: raw.pagination,
      data: raw.data.map((item: any) => ({
        title: item.title,
        image: item.images?.jpg?.image_url || null
      }))
    };
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    const raw = await this.jikanService.getAnimeById(id);
    const item = raw.data;
    return {
      title: item.title,
      image: item.images?.jpg?.image_url || null
    };
  }
}
