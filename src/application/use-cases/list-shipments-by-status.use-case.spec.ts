import { Test, TestingModule } from '@nestjs/testing';
import { ListShipmentsByStatusUseCase } from './list-shipments-by-status.use-case';
import { QUERY_REPOSITORY, IQueryRepository } from '../ports/iquery.repository';
import { LOGGER_PROVIDER_TOKEN } from '../../infrastructure/logger/logger.constants';
import { Shipment } from '../../domain/shipment.entity';
import { ShipmentStatus } from '../../domain/shipment-status.enum';

describe('ListShipmentsByStatusUseCase', () => {
  let useCase: ListShipmentsByStatusUseCase;
  let queryRepository: IQueryRepository;

  const mockQueryRepository = {
    findShipmentsByStatus: jest.fn(),
  };

  const mockLogger = {
    info: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListShipmentsByStatusUseCase,
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

    useCase = module.get<ListShipmentsByStatusUseCase>(ListShipmentsByStatusUseCase);
    queryRepository = module.get<IQueryRepository>(QUERY_REPOSITORY);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return a list of shipments', async () => {
      const status = ShipmentStatus.DELIVERED;
      const page = 1;
      const limit = 10;
      const shipments: Shipment[] = [
        {
          id: 'any-shipment-id',
          trackingId: 'any-tracking-id',
          currentStatus: ShipmentStatus.DELIVERED,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const total = 1;

      mockQueryRepository.findShipmentsByStatus.mockResolvedValue({ shipments, total });

      const result = await useCase.execute(status, page, limit);

      expect(result).toEqual({
        data: shipments,
        pagination: {
          totalItems: total,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
        },
      });
      expect(queryRepository.findShipmentsByStatus).toHaveBeenCalledWith(
        status,
        page,
        limit,
      );
    });
  });
});
