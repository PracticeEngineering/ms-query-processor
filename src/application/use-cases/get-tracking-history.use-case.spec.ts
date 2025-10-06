
import { Test, TestingModule } from '@nestjs/testing';
import { GetTrackingHistoryUseCase } from './get-tracking-history.use-case';
import { QUERY_REPOSITORY, IQueryRepository } from '../ports/iquery.repository';
import { LOGGER_PROVIDER_TOKEN } from '../../infrastructure/logger/logger.constants';
import { NotFoundException } from '@nestjs/common';
import { Shipment } from '../../domain/shipment.entity';
import { Checkpoint } from '../../domain/checkpoint.entity';

describe('GetTrackingHistoryUseCase', () => {
  let useCase: GetTrackingHistoryUseCase;
  let queryRepository: IQueryRepository;

  const mockQueryRepository = {
    findShipmentWithCheckpoints: jest.fn(),
  };

  const mockLogger = {
    info: jest.fn(),
    warn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTrackingHistoryUseCase,
        {
          provide: QUERY_REPOSITORY,
          useValue: mockQueryRepository,
        },
        {
          provide: LOGGER_PROVIDER_TOKEN,
          useValue: mockLogger,
        },
      ],
    }).compile();

    useCase = module.get<GetTrackingHistoryUseCase>(GetTrackingHistoryUseCase);
    queryRepository = module.get<IQueryRepository>(QUERY_REPOSITORY);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return shipment with checkpoints when found', async () => {
      const trackingId = 'any-tracking-id';
      const shipment = new Shipment(
        'any-shipment-id',
        'any-tracking-id',
        'DELIVERED',
        [
          new Checkpoint(
            'any-checkpoint-id',
            'any-shipment-id',
            'IN_TRANSIT',
            'any-location',
            new Date(),
          ),
        ],
      );

      mockQueryRepository.findShipmentWithCheckpoints.mockResolvedValue(shipment);

      const result = await useCase.execute(trackingId);

      expect(result).toEqual(shipment);
      expect(queryRepository.findShipmentWithCheckpoints).toHaveBeenCalledWith(
        trackingId,
      );
    });

    it('should throw NotFoundException when shipment is not found', async () => {
      const trackingId = 'non-existent-tracking-id';
      mockQueryRepository.findShipmentWithCheckpoints.mockResolvedValue(null);

      await expect(useCase.execute(trackingId)).rejects.toThrow(
        NotFoundException,
      );
      expect(queryRepository.findShipmentWithCheckpoints).toHaveBeenCalledWith(
        trackingId,
      );
    });
  });
});
