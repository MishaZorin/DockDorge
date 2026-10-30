import { CreateGeneratorDto } from './dto/create-generator.dto';

export class DockerGenerator {
  static generateCompose(dto: CreateGeneratorDto): string {
    const extBack = dto.externalPortBack || '3000';
    const intBack = dto.internalPortBack || '3000';

    const extFront = dto.externalPortFront || '8080';
    const intFront = dto.internalPortFront || '80';

    const nameBack = dto.containerNameBack || 'backend';
    const nameFront = dto.containerNameFront || 'frontend';

    const imgBack = dto.imgBackValue || './backend';
    const imgFront = dto.imgFrontValue || './frontend';

    const healthcheck = dto.healthcheck === true;

    const dbHealthcheck = healthcheck
      ? `
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $$POSTGRES_USER -d $$POSTGRES_DB"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s`
      : '';

    const backendHealthcheck = healthcheck
      ? `
    healthcheck:
      test: ["CMD", "node", "-e", "require('net').connect(${intBack}, '127.0.0.1').on('connect', () => process.exit(0)).on('error', () => process.exit(1))"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 15s`
      : '';

    const frontendHealthcheck = healthcheck
      ? `
    healthcheck:
      test: ["CMD-SHELL", "wget -q --spider http://127.0.0.1:${intFront}/ || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s`
      : '';

    const backendDependsOn = healthcheck
      ? `
    depends_on:
      postgres:
        condition: service_healthy`
      : `
    depends_on:
      - postgres`;

    const frontendDependsOn = healthcheck
      ? `
    depends_on:
      backend:
        condition: service_healthy`
      : `
    depends_on:
      - backend`;

    return `services:
  postgres:
    image: postgres:16-alpine
    container_name: your_db
    restart: unless-stopped
    env_file: .env
    environment:
      POSTGRES_USER: \${DB_USER}
      POSTGRES_PASSWORD: \${DB_PASSWORD}
      POSTGRES_DB: \${DB_NAME}
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks:
      - secure_network${dbHealthcheck}

  backend:
    build:
      context: ${imgBack}
    container_name: ${nameBack}
    restart: unless-stopped
    env_file: .env
    extra_hosts:
      - "host.docker.internal:host-gateway"${backendDependsOn}
    ports:
      - "${extBack}:${intBack}"
    volumes:
      - ./ssh-keys:/app/ssh:ro
    networks:
      - secure_network${backendHealthcheck}

  frontend:
    build:
      context: ${imgFront}
    container_name: ${nameFront}
    restart: unless-stopped
    ports:
      - "${extFront}:${intFront}"${frontendDependsOn}
    networks:
      - secure_network${frontendHealthcheck}

volumes:
  pgdata:
    driver: local

networks:
  secure_network:
    driver: bridge
`;
  }
}
