import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
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

    
}

