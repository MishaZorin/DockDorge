import { PartialType } from '@nestjs/swagger';
import { CreateCryptoDto } from './create-crypto.dto';

export class UpdateCryptoDto extends PartialType(CreateCryptoDto) {}
