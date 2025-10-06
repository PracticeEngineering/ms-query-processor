import {
  Controller,
  Get,
  Inject,
  Param,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { GetTrackingHistoryUseCase } from './application/use-cases/get-tracking-history.use-case';
import { ListShipmentsByStatusUseCase } from './application/use-cases/list-shipments-by-status.use-case';
import { PaginationQueryDto } from './infrastructure/controllers/dtos/pagination-query.dto';
import { LOGGER_PROVIDER_TOKEN } from './infrastructure/logger/logger.constants';
import type { Logger } from 'pino';

@Controller()
export class AppController {
  constructor(
    private readonly getTrackingHistoryUseCase: GetTrackingHistoryUseCase,
    private readonly listShipmentsByStatusUseCase: ListShipmentsByStatusUseCase,
    @Inject(LOGGER_PROVIDER_TOKEN) private readonly logger: Logger,
  ) {}

  @Get('tracking/:trackingId')
  async getTrackingHistory(@Param('trackingId') trackingId: string) {
    this.logger.info({ trackingId }, 'Request to get tracking history');
    const { shipment, checkpoints } = await this.getTrackingHistoryUseCase.execute(
      trackingId,
    );
    return {
      trackingId: shipment.trackingId,
      status: shipment.currentStatus,
      history: checkpoints,
    };
  }

  @Get('shipments')
  async listShipmentsByStatus(
    @Query('status') status: string,
    @Query(new ValidationPipe({ transform: true })) pagination: PaginationQueryDto,
  ) {
    this.logger.info({ status, pagination }, 'Request to list shipments');
    const { page, limit } = pagination;
    const { shipments, total } = await this.listShipmentsByStatusUseCase.execute(
      status,
      page,
      limit,
    );

    return {
      data: shipments,
      pagination: {
        totalItems: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}