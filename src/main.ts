import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationExceptionFilter } from './validation-exception.filter';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Register the global exception filter
  app.useGlobalFilters(new ValidationExceptionFilter());

  // Register the global prefix
  app.setGlobalPrefix('api');

  // // Register the global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true, whitelist: true,
    exceptionFactory: (errors) => {
      return new UnprocessableEntityException(errors);
    },

  }));

  await app.listen(3000);
}

bootstrap();
