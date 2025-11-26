import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JikanService } from './jikan.service';
import { JikanController } from './jikan.controller';

@Module({
  imports: [],
  controllers: [AppController, JikanController],
  providers: [AppService, JikanService],
})
export class AppModule {}
