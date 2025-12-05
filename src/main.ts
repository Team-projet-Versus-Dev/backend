// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

<<<<<<< HEAD
  app.enableCors();

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // supprime les champs non attendus
      forbidNonWhitelisted: false,
=======
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
>>>>>>> 1075418caabae709903ac7181232c477ef936749
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
