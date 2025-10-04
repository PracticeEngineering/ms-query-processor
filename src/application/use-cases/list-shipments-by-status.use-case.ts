import { Inject, Injectable } from '@nestjs/common';
import type { IQueryRepository } from '../ports/iquery.repository';
import { QUERY_REPOSITORY } from '../ports/iquery.repository';

@Injectable()
export class ListShipmentsByStatusUseCase {
  constructor(
    @Inject(QUERY_REPOSITORY)
    private readonly queryRepository: IQueryRepository,
  ) {}

  async execute(status: string, page: number, limit: number) {
    return this.queryRepository.findShipmentsByStatus(status, page, limit);
  }
}