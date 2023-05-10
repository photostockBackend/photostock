import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createWriteStream } from 'fs';
import { get } from 'http';
import { useContainer } from 'class-validator';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { BadExceptionFilter } from './helpers/bad-exception.filter';
import cookieParser from 'cookie-parser'

const PORT = process.env.PORT || 5000;
const serverUrl = `http://localhost:${PORT}`;

export async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3001', 'https://front-team.vercel.app'],
      credentials: true,
    },
  });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
      exceptionFactory: (errors) => {
        throw new BadRequestException(
          errors.map((e) => ({
            field: e.property,
            message: e.constraints[Object.keys(e.constraints)[0]],
          })),
        );
      },
    }),
  );
  app.useGlobalFilters(new BadExceptionFilter());
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Swagger-doc for photoStock')
    .setDescription('The photoStock API description')
    .setVersion('1.0')
    .addTag('photoStock')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(PORT);

  if (process.env.NODE_ENV === 'development') {
    // write swagger ui files
    get(`${serverUrl}/swagger/swagger-ui-bundle.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-bundle.js'));
    });

    get(`${serverUrl}/swagger/swagger-ui-init.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-init.js'));
    });

    get(
      `${serverUrl}/swagger/swagger-ui-standalone-preset.js`,
      function (response) {
        response.pipe(
          createWriteStream('swagger-static/swagger-ui-standalone-preset.js'),
        );
      },
    );

    get(`${serverUrl}/swagger/swagger-ui.css`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui.css'));
    });
  }
}
bootstrap();
