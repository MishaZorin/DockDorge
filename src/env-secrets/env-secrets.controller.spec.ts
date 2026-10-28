import { Test, TestingModule } from '@nestjs/testing';
import { EnvSecretsController } from './env-secrets.controller';
import { EnvSecretsService } from './env-secrets.service';

describe('EnvSecretsController', () => {
  let controller: EnvSecretsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnvSecretsController],
      providers: [EnvSecretsService],
    }).compile();

    controller = module.get<EnvSecretsController>(EnvSecretsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
