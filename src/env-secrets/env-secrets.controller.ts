import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EnvSecretsService } from './env-secrets.service';
import { CreateEnvSecretDto } from './dto/create-env-secret.dto';
import { UpdateEnvSecretDto } from './dto/update-env-secret.dto';


@Controller('envs')
export class EnvSecretsController {
  constructor(private readonly envSecretsService: EnvSecretsService) {}

  @Post()
  create(@Body() createEnvSecretDto: CreateEnvSecretDto) {
    return this.envSecretsService.create(createEnvSecretDto);
  }

  @Get()
  getAll() {
    return this.envSecretsService.getAll();
  }
}
