import { Checkpoint } from '../../domain/checkpoint.entity';
import { Shipment } from '../../domain/shipment.entity';

export const QUERY_REPOSITORY = 'QueryRepository';

export interface IQueryRepository {
  findShipmentWithCheckpoints(trackingId: string): Promise<{ shipment: Shipment; checkpoints: Checkpoint[] } | null>;
  findShipmentsByStatus(status: string, page: number, limit: number): Promise<{ shipments: Shipment[]; total: number }>;
}