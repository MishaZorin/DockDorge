export class CreateGeneratorDto {
  imgBackValue!: string;
  imgFrontValue!: string;
  externalPortBack!: string;
  internalPortBack!: string;
  externalPortFront!: string;
  internalPortFront!: string;
  containerNameFront!: string;
  containerNameBack!: string;
  packageManager!: string;
  command!: string;
  multiStage!: boolean;
  nonRoot!: boolean;
  healthcheck!: boolean;
  dockerignore!: boolean;
}