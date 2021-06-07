import { BaseModel } from "./base-model";

export interface Rayon extends BaseModel {
  container: RayonContainer;
}

export interface RayonContainer {
  rayons: RayonWem[];
}

export interface RayonWem {
  id: number;
  description: string;
  codification: string;
}
