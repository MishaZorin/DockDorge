import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class EnvSecret {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  value!: string;
}
