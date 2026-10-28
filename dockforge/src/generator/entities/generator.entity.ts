
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('project_generations')
export class Generator {
  @PrimaryGeneratedColumn()
  id!: number;

  // Docker-образы / пути сборки
  @Column({ name: 'img_back_value' })
  imgBackValue!: string;

  @Column({ name: 'img_front_value' })
  imgFrontValue!: string;

  // Имена контейнеров
  @Column({ name: 'container_name_back', default: 'backend' })
  containerNameBack!: string;

  @Column({ name: 'container_name_front', default: 'frontend' })
  containerNameFront!: string;

  // Порты backend
  @Column({ name: 'external_port_back' })
  externalPortBack!: string;

  @Column({ name: 'internal_port_back' })
  internalPortBack!: string;

  // Порты frontend
  @Column({ name: 'external_port_front' })
  externalPortFront!: string;

  @Column({ name: 'internal_port_front' })
  internalPortFront!: string;

  // Настройки PostgreSQL
  @Column({ name: 'db_name', default: 'app_db' })
  dbName!: string;

  @Column({ name: 'db_user', default: 'app_user' })
  dbUser!: string;

  @Column({ name: 'db_password', select: false })
  dbPassword!: string;


  @Column({ name: 'multi_stage', default: true })
  multiStage!: boolean;

  @Column({ name: 'non_root', default: true })
  nonRoot!: boolean;

  @Column({ name: 'healthcheck', default: false })
  healthcheck!: boolean;

  @Column({ name: 'dockerignore', default: true })
  dockerignore!: boolean;

}
