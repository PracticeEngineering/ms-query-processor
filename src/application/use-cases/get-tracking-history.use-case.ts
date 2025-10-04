import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IQueryRepository } from '../ports/iquery.repository';
import { QUERY_REPOSITORY } from '../ports/iquery.repository';

@Injectable()
export class GetTrackingHistoryUseCase {
  constructor(
    @Inject(QUERY_REPOSITORY)
    private readonly queryRepository: IQueryRepository,
  ) {}

  async execute(trackingId: string) {
    const result = await this.queryRepository.findShipmentWithCheckpoints(trackingId);
    if (!result) {
      throw new NotFoundException(`Shipment with trackingId "${trackingId}" not found.`);
    }
    return result;
  }
}