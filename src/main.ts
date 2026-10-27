import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; 
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
console.log('KEY present:', !!process.env.DATA_ENCRYPTION_KEY);

  const config = new DocumentBuilder()
    .setTitle('API Documentation') 
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

 
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); 

  await app.listen(process.env.PORT || 3000);
}
bootstrap();

// http://localhost:3000/api