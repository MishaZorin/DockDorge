import { PartialType } from '@nestjs/mapped-types';
import { CreateEnvSecretDto } from './create-env-secret.dto';

export class UpdateEnvSecretDto extends PartialType(CreateEnvSecretDto) {}
