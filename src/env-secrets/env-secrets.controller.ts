import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EnvSecretsService } from './env-secrets.service';
import { CreateEnvSecretDto } from './dto/create-env-secret.dto';
import { UpdateEnvSecretDto } from './dto/update-env-secret.dto';

@Controller('env-secrets')
export class EnvSecretsController {
  constructor(private readonly envSecretsService: EnvSecretsService) {}

  @Post('/envs')
  create(@Body() createEnvSecretDto: CreateEnvSecretDto) {
    return this.envSecretsService.create(createEnvSecretDto);
  }
  @Get('/getEnvs')
  getAll(){
    return this.envSecretsService.getAll()
  }

  
}
