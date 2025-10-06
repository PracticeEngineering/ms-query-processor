import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionLoggerFilter } from './infrastructure/common/filters/global-exception-logger.filter';
import { LOGGER_PROVIDER_TOKEN } from './infrastructure/logger/logger.constants';
import { Logger } from 'pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const port = process.env.PORT || 3000;

  const httpAdapterHost = app.get(HttpAdapterHost);
  const logger = app.get<Logger>(LOGGER_PROVIDER_TOKEN);
  app.useGlobalFilters(
    new GlobalExceptionLoggerFilter(httpAdapterHost, logger),
  );

  app.useGlobalPipes(new ValidationPipe());
  app.enableShutdownHooks();
  await app.listen(port);
}
bootstrap();
