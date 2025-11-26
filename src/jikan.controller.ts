import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { JikanService } from './jikan.service';

@Controller('jikan')
export class JikanController {
  constructor(private readonly jikanService: JikanService) {}

  @Get('search')
  async search(@Query('q') q: string) {
    return this.jikanService.searchAnime(q || '');
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.jikanService.getAnimeById(id);
  }
}
