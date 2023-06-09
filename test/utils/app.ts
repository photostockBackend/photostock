import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { useContainer } from 'class-validator';
import { AppModule } from '../../src/app.module';
import { HttpExceptionFilter } from '../../src/helpers/http-exeption.filter';
import cookieParser = require('cookie-parser');

export async function createAppAndServerForTests() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleFixture.createNestApplication();
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
      exceptionFactory: (errors) => {
        const customErrors = [];
        errors.forEach((e) => {
          const keys = Object.keys(e.constraints);
          keys.forEach((k) => {
            customErrors.push({
              message: e.constraints[k],
              field: e.property,
            });
          });
        });
        throw new BadRequestException(customErrors);
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser());
  await app.init();

  return app;
}
