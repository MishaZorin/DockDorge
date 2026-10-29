import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('project_generations')
export class Generator {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'img_back_value' })
  imgBackValue!: string;

  @Column({ name: 'img_front_value' })
  imgFrontValue!: string;

  @Column({ name: 'external_port_back' })
  externalPortBack!: string;

  @Column({ name: 'internal_port_back' })
  internalPortBack!: string;

  @Column({ name: 'external_port_front' })
  externalPortFront!: string;

  @Column({ name: 'internal_port_front' })
  internalPortFront!: string;

  @Column({ name: 'container_name_back' })
  containerNameBack!: string;

  @Column({ name: 'container_name_front' })
  containerNameFront!: string;

  @Column({ name: 'package_manager', default: 'npm' })
  packageManager!: string;

  @Column({ default: 'node dist/main.js' })
  command!: string;

  @Column({ default: true })
  multiStage!: boolean;

  @Column({ default: true })
  nonRoot!: boolean;

  @Column({ default: false })
  healthcheck!: boolean;

  @Column({ default: true })
  dockerignore!: boolean;
}
