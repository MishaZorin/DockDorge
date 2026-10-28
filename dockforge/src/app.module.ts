import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { EnvSecretsModule } from './env-secrets/env-secrets.module';
import { EnvSecret } from './env-secrets/entities/env-secret.entity'; 
import { CryptoModule } from './crypto/crypto.module';
import { GeneratorModule } from './generator/generator.module';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    
   
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],  
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: configService.get<number>('DB_PORT') || 5432,
        username: configService.get<string>('POSTGRES_USER') || 'myuser',
        password: String(configService.get<string>('POSTGRES_PASSWORD') || 'mypassword'),
        database: configService.get<string>('POSTGRES_DB') || 'mydb',
        
       
        entities: [EnvSecret], 
        
        synchronize: true,
      }),
    }),

   
    EnvSecretsModule,

   
    CryptoModule,

   
    GeneratorModule,
  ],
})
export class AppModule { }
