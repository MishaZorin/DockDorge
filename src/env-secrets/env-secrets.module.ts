import { Module } from '@nestjs/common';
import { EnvSecretsService } from './env-secrets.service';
import { EnvSecretsController } from './env-secrets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoModule } from '../crypto/crypto.module';
import { EnvSecret } from './entities/env-secret.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EnvSecret]), 
    CryptoModule,
  ],
  controllers: [EnvSecretsController],
  providers: [EnvSecretsService],
})
export class EnvSecretsModule {}
