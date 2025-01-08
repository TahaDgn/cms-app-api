import { Test, TestingModule } from '@nestjs/testing';
import { EventDefinitionsService } from './event-definitions.service';

describe('EventDefinitionsService', () => {
  let service: EventDefinitionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventDefinitionsService],
    }).compile();

    service = module.get<EventDefinitionsService>(EventDefinitionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
