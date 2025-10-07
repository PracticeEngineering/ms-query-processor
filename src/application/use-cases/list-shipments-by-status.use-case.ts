import { Inject, Injectable } from '@nestjs/common';
import type { IQueryRepository } from '../ports/iquery.repository';
import { QUERY_REPOSITORY } from '../ports/iquery.repository';
import { LOGGER_PROVIDER_TOKEN } from '../../infrastructure/logger/logger.constants';
import type { Logger } from 'pino';
import { ShipmentStatus } from '../../infrastructure/controllers/dtos/list-shipments-by-status.dto';

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
    return this.queryRepository.findShipmentsByStatus(status, page, limit);
  }
}