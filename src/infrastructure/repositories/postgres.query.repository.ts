import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Pool } from 'pg';
import { IQueryRepository } from '../../application/ports/iquery.repository';
import { DB_CONNECTION } from '../database/database.provider';
import { Shipment } from '../../domain/shipment.entity';
import { Checkpoint } from '../../domain/checkpoint.entity';
import { LOGGER_PROVIDER_TOKEN } from '../logger/logger.constants';
import { Logger } from 'pino';

@Injectable()
export class PostgresQueryRepository implements IQueryRepository {
  constructor(
    @Inject(DB_CONNECTION) private readonly pool: Pool,
    @Inject(LOGGER_PROVIDER_TOKEN) private readonly logger: Logger,
  ) {}

  async findShipmentWithCheckpoints(
    trackingId: string,
  ): Promise<{ shipment: Shipment; checkpoints: Checkpoint[] } | null> {
    try {
      this.logger.info({ trackingId }, 'Executing findShipmentWithCheckpoints query');
      const shipmentResult = await this.pool.query(
        'SELECT * FROM shipments WHERE tracking_id = $1',
        [trackingId],
      );
      if (shipmentResult.rowCount === 0) {
        return null;
      }
      const shipmentRow = shipmentResult.rows[0];
      const shipment: Shipment = {
        id: shipmentRow.id,
        trackingId: shipmentRow.tracking_id,
        currentStatus: shipmentRow.current_status,
        createdAt: shipmentRow.created_at,
        updatedAt: shipmentRow.updated_at,
      };

      const checkpointsResult = await this.pool.query(
        'SELECT * FROM checkpoints WHERE shipment_id = $1 ORDER BY "timestamp" DESC',
        [shipment.id],
      );
      const checkpoints: Checkpoint[] = checkpointsResult.rows.map((row) => ({
        id: row.id,
        trackingId: '',
        status: row.status,
        location: row.location,
        timestamp: row.timestamp,
      }));

      return { shipment, checkpoints };
    } catch (error) {
      this.logger.error(
        { error, trackingId },
        'Error in findShipmentWithCheckpoints',
      );
      throw new InternalServerErrorException(
        'An error occurred while fetching shipment data.',
      );
    }
  }

  async findShipmentsByStatus(
    status: string,
    page: number,
    limit: number,
  ): Promise<{ shipments: Shipment[]; total: number }> {
    const offset = (page - 1) * limit;

    try {
      this.logger.info(
        { status, page, limit },
        'Executing findShipmentsByStatus query',
      );
      const totalResult = await this.pool.query(
        'SELECT COUNT(id) FROM shipments WHERE current_status = $1',
        [status],
      );
      const total = parseInt(totalResult.rows[0].count, 10);

      const shipmentsResult = await this.pool.query(
        'SELECT * FROM shipments WHERE current_status = $1 ORDER BY updated_at DESC LIMIT $2 OFFSET $3',
        [status, limit, offset],
      );
      const shipments: Shipment[] = shipmentsResult.rows.map((row) => ({
        id: row.id,
        trackingId: row.tracking_id,
        currentStatus: row.current_status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));

      return { shipments, total };
    } catch (error) {
      this.logger.error(
        { error, status, page, limit },
        'Error in findShipmentsByStatus',
      );
      throw new InternalServerErrorException(
        'An error occurred while fetching shipment data.',
      );
    }
  }
}