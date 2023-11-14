import { Test, TestingModule } from '@nestjs/testing';
import { SystemMonitorGateway } from './system-monitor.gateway';

describe('SystemMonitorGateway', () => {
  let gateway: SystemMonitorGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SystemMonitorGateway],
    }).compile();

    gateway = module.get<SystemMonitorGateway>(SystemMonitorGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
