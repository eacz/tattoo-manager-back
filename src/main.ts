import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 4000;
  app.setGlobalPrefix('api');

  //TODO: configure origins
  app.enableCors();

  app.useGlobalPipes(
    //new ValidationPipe({
    //  transform: true,
    //  transformOptions: { enableImplicitConversion: true },
    //}),
    new I18nValidationPipe(),
  );

  app.useGlobalFilters(new I18nValidationExceptionFilter());

  await app.listen(port);
  logger.log(`App running on port ${port}`, 'NestApplication');
}
bootstrap();
