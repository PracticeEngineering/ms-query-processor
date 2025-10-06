import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './infrastructure/database/database.module';
import { QUERY_REPOSITORY } from './application/ports/iquery.repository';
import { PostgresQueryRepository } from './infrastructure/repositories/postgres.query.repository';
import { GetTrackingHistoryUseCase } from './application/use-cases/get-tracking-history.use-case';
import { ListShipmentsByStatusUseCase } from './application/use-cases/list-shipments-by-status.use-case';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { LoggerMiddleware } from './infrastructure/logger/logger.middleware';

@Module({
  imports: [DatabaseModule, LoggerModule],
  controllers: [AppController],
  providers: [
    GetTrackingHistoryUseCase,
    ListShipmentsByStatusUseCase,
    {
      provide: QUERY_REPOSITORY,
      useClass: PostgresQueryRepository,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}