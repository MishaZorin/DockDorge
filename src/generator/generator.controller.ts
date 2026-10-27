import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GeneratorService } from './generator.service';
import { CreateGeneratorDto } from './dto/create-generator.dto';
import { UpdateGeneratorDto } from './dto/update-generator.dto';

@Controller('generator')
export class GeneratorController {
  constructor(private readonly generatorService: GeneratorService) { }
   @Post('compose')
  getCompose(@Body() dto: CreateGeneratorDto) {
    const template = this.generatorService.getComposeTemplate(dto);
    return { template };
  }



}
