import { CreateGeneratorDto } from './dto/create-generator.dto';

export class DockerGenerator {
  static generateCompose(dto: CreateGeneratorDto): string {
   
    const extBack = dto.externalPortBack || '8082';
    const intBack = dto.internalPortBack || '3000';
    const extFront = dto.externalPortFront || '8083';
    const intFront = dto.internalPortFront || '80';
    const nameFront = dto.containerNameFront
    const nameBack = dto.containerNameBack

    
    const imgBack = dto.imgBackValue || './backend'; 
    const imgFront = dto.imgFrontValue || './frontend/frontFiles';

    return `services:
  postgres:
    image: postgres:16-alpine
    container_name: vps_checker_db
    restart: unless-stopped
    env_file: .env
    environment:
      POSTGRES_USER: \${DB_USER}
      POSTGRES_PASSWORD: \${DB_PASSWORD}
      POSTGRES_DB: \${DB_NAME}
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks:
      - secure_network

  backend:
    build: ${imgBack}
    container_name: ${nameBack}
    restart: unless-stopped
    env_file: .env
    extra_hosts:
      - "host.docker.internal:host-gateway"
    depends_on:
      - postgres
    ports:
      - "${extBack}:${intBack}"
    volumes:
      - ./ssh-keys:/app/ssh:ro
    networks:
      - secure_network

  frontend:
    build: ${imgFront}
    container_name: ${nameFront}
    restart: unless-stopped
    ports:
      - "${extFront}:${intFront}"
    depends_on:
      - backend
    networks:
      - secure_network

volumes:
  pgdata:
    driver: local

networks:
  secure_network:
    driver: bridge`;
  }
}
