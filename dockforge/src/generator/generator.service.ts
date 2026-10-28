import { Injectable } from '@nestjs/common';
import { CreateGeneratorDto } from './dto/create-generator.dto';
import { UpdateGeneratorDto } from './dto/update-generator.dto';
import {DockerGenerator} from './generator.util'

@Injectable()
export class GeneratorService {
  getComposeTemplate(dto: CreateGeneratorDto ): string {
    const composeYaml = DockerGenerator.generateCompose(dto);
    return composeYaml;
  }

}
