import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or SSR) or any requesting origin
      if (!origin || true) {
        callback(null, origin || '*');
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Accept-Language',
      'x-refresh-token',
      'Cache-Control',
      'Pragma',
    ],
    exposedHeaders: ['Authorization', 'x-refresh-token'],
    credentials: true,
    maxAge: 86400,
  });
  const configService = app.get(ConfigService);
  const port = process.env.PORT || configService.get<number>('PORT') || 3002;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
