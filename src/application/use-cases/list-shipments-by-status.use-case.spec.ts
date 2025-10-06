
import { Test, TestingModule } from '@nestjs/testing';
import { ListShipmentsByStatusUseCase } from './list-shipments-by-status.use-case';
import { QUERY_REPOSITORY, IQueryRepository } from '../ports/iquery.repository';
import { LOGGER_PROVIDER_TOKEN } from '../../infrastructure/logger/logger.constants';
import { Shipment } from '../../domain/shipment.entity';

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
      const status = 'DELIVERED';
      const page = 1;
      const limit = 10;
      const shipments = [
        new Shipment('any-shipment-id', 'any-tracking-id', 'DELIVERED', []),
      ];

      mockQueryRepository.findShipmentsByStatus.mockResolvedValue(shipments);

      const result = await useCase.execute(status, page, limit);

      expect(result).toEqual(shipments);
      expect(queryRepository.findShipmentsByStatus).toHaveBeenCalledWith(
        status,
        page,
        limit,
      );
    });
  });
});
