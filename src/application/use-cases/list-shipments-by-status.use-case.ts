import { Inject, Injectable } from '@nestjs/common';
import type { IQueryRepository } from '../ports/iquery.repository';
import { QUERY_REPOSITORY } from '../ports/iquery.repository';
import { LOGGER_PROVIDER_TOKEN } from '../../infrastructure/logger/logger.constants';
import type { Logger } from 'pino';
import { ShipmentStatus } from '../../domain/shipment-status.enum';

@Injectable()
export class ListShipmentsByStatusUseCase {
  constructor(
    @Inject(QUERY_REPOSITORY)
    private readonly queryRepository: IQueryRepository,
    @Inject(LOGGER_PROVIDER_TOKEN) private readonly logger: Logger,
  ) {}

  async execute(status: ShipmentStatus | undefined, page: number, limit: number) {
    this.logger.info(
      { status, page, limit },
      'Finding shipments by status with pagination',
    );
    const { shipments, total } = await this.queryRepository.findShipmentsByStatus(
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