import { Test, TestingModule } from '@nestjs/testing';
import { SystemMonitorService } from './system-monitor.service';

describe('SystemMonitorService', () => {
  let service: SystemMonitorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SystemMonitorService],
    }).compile();

    service = module.get<SystemMonitorService>(SystemMonitorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
