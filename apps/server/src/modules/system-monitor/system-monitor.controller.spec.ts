import { Test, TestingModule } from '@nestjs/testing';
import { SystemMonitorController } from './system-monitor.controller';

describe('SystemMonitorController', () => {
  let controller: SystemMonitorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SystemMonitorController],
    }).compile();

    controller = module.get<SystemMonitorController>(SystemMonitorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
