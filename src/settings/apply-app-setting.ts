import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';
import { AppModule } from '../app.module';
import { HttpExceptionFilter } from '../common/exception-filters/http-exception-filter';

export const applyAppSettings = (app: INestApplication) => {
  app.enableCors();
  app.use(cookieParser());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const customErrors = [];

        errors.forEach((e) => {
          const constraintKeys = Object.keys(e.constraints);
          constraintKeys.forEach((cKey) => {
            const msg = e.constraints[cKey];
            customErrors.push({ message: msg, field: e.property });
          });
        });

        throw new BadRequestException(customErrors);
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  // Конфигурация swagger документации
  //setSwagger(app);
};
