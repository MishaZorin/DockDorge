import { Test, TestingModule } from '@nestjs/testing';
import { EnvSecretsService } from './env-secrets.service';

describe('EnvSecretsService', () => {
  let service: EnvSecretsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnvSecretsService],
    }).compile();

    service = module.get<EnvSecretsService>(EnvSecretsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
