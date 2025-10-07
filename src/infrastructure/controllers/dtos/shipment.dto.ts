import { CheckpointDto } from './checkpoint.dto';

export class ShipmentDto {
  trackingId: string;
  status: string;
  history: CheckpointDto[];
}
