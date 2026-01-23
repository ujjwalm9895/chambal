import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  const corsOrigins = configService.get<string>('CORS_ORIGIN')?.split(',') || ['http://localhost:3001'];

  // Serve static files for media uploads
  const uploadPath = configService.get<string>('MEDIA_UPLOAD_PATH') || './uploads';
  app.useStaticAssets(join(process.cwd(), uploadPath), {
    prefix: '/uploads/',
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS configuration
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // API versioning
  app.setGlobalPrefix('api/v1');

  await app.listen(port);
  console.log(`🚀 CMS Backend running on http://localhost:${port}/api/v1`);
}

bootstrap();
