import { Injectable } from '@nestjs/common';
import { CreateEnvSecretDto } from './dto/create-env-secret.dto';
import { UpdateEnvSecretDto } from './dto/update-env-secret.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {  EnvSecret } from './entities/env-secret.entity';
import { CryptoService } from '../crypto/crypto.service';
@Injectable()
export class EnvSecretsService {
   constructor(
    @InjectRepository( EnvSecret)
    private readonly secretsRepository: Repository<EnvSecret>,
    private readonly cryptoService: CryptoService,
  ) {}
  async create(createEnvSecret:CreateEnvSecretDto ) {
    const newSecret = this.secretsRepository.create({
      ...createEnvSecret,
      value: this.cryptoService.encrypt(createEnvSecret.value)
    })
     const saved = await this.secretsRepository.save(newSecret);
    return saved
  }
  async getAll(){
    const secrets = await this.secretsRepository.find();
    return secrets.map((secret) => ({
      ...secret,
      value: this.cryptoService.decrypt(secret.value), 
    }));

  }

  
}
