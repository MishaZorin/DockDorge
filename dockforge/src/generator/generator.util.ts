import { CreateGeneratorDto } from './dto/create-generator.dto';

export class DockerGenerator {
  static generateCompose(dto: CreateGeneratorDto): string {
    const extBack = dto.externalPortBack || '8082';
    const intBack = dto.internalPortBack || '3000';
    const extFront = dto.externalPortFront || '8083';
    const intFront = dto.internalPortFront || '80';

    const nameBack = dto.containerNameBack || 'backend';
    const nameFront = dto.containerNameFront || 'frontend';
    const namePostgres = 'app_db';

    const imgBack = dto.imgBackValue || './backend';
    const imgFront = dto.imgFrontValue || './frontend/frontFiles';
    const imgPostgres = 'postgres:16-alpine';

    const dbName = dto.dbName || 'app_db';
    const dbUser = dto.dbUser || 'app_user';
    const dbPassword = dto.dbPassword;

    if (!dbPassword?.trim()) {
      throw new Error('Необходимо указать пароль PostgreSQL');
    }

    const yamlString = (value: string): string =>
      JSON.stringify(value);

    return `
services:
  postgres:
    image: ${imgPostgres}
    container_name: ${namePostgres}
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${yamlString(dbUser)}
      POSTGRES_PASSWORD: ${yamlString(dbPassword)}
      POSTGRES_DB: ${yamlString(dbName)}
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks:
      - secure_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${'${POSTGRES_USER}'} -d $${'${POSTGRES_DB}'}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s

  backend:
    build: ${imgBack}
    container_name: ${nameBack}
    restart: unless-stopped
    env_file: .env
    extra_hosts:
      - "host.docker.internal:host-gateway"
    depends_on:
      postgres:
        condition: service_healthy
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
    driver: bridge
`;
  }
}