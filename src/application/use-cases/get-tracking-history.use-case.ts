import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IQueryRepository } from '../ports/iquery.repository';
import { QUERY_REPOSITORY } from '../ports/iquery.repository';
import { LOGGER_PROVIDER_TOKEN } from '../../infrastructure/logger/logger.constants';
import { Logger } from 'pino';

@Injectable()
export class GetTrackingHistoryUseCase {
  constructor(
    @Inject(QUERY_REPOSITORY)
    private readonly queryRepository: IQueryRepository,
    @Inject(LOGGER_PROVIDER_TOKEN) private readonly logger: Logger,
  ) {}

  async execute(trackingId: string) {
    this.logger.info(
      { trackingId },
      'Attempting to find shipment with checkpoints',
    );
    const result = await this.queryRepository.findShipmentWithCheckpoints(
      trackingId,
    );
    if (!result) {
      this.logger.warn({ trackingId }, 'Shipment not found');
      throw new NotFoundException(
        `Shipment with trackingId "${trackingId}" not found.`,
      );
    }
    return result;
  }
}