import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 4000;
  app.setGlobalPrefix('api');

  //TODO: configure origins
  app.enableCors();

  app.use(cookieParser());

  app.useGlobalPipes(
    //new ValidationPipe({
    //  transform: true,
    //  transformOptions: { enableImplicitConversion: true },
    //}),
    new I18nValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new I18nValidationExceptionFilter());

  await app.listen(port);
  logger.log(`App running on port ${port}`, 'NestApplication');
}
bootstrap();
