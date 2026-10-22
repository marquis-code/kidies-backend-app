import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { MongoExceptionFilter } from './common/mongo-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization,Accept-Language,X-Refresh-Token,stripe-signature,x-paystack-signature',
    credentials: true,
  });

  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });
  app.useGlobalFilters(new MongoExceptionFilter());

  const configService = app.get(ConfigService);
  const port = process.env.PORT || configService.get<number>('PORT') || 3005;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 JasmarKids API running on http://localhost:${port}`);
}
bootstrap();
