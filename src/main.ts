import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionsFilter } from './common/exceptions/GlobalExceptionsFilter';
import { loggerMiddleware } from './middlewares';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(helmet());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new GlobalExceptionsFilter());
  app.use(loggerMiddleware);
  setupSwagger(app);
  await app.listen(80, '0.0.0.0');
}

bootstrap();
