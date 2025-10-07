
import { IsEnum, IsOptional } from 'class-validator';
import { ShipmentStatus } from '../../../domain/shipment-status.enum';

export class ListShipmentsByStatusDto {
  @IsOptional()
  @IsEnum(ShipmentStatus)
  status?: ShipmentStatus;
}
