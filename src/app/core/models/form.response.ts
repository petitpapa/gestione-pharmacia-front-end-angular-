import {BaseModel} from './base-model';
export interface Forms  extends BaseModel{
  container: FormContainer;
}

export interface FormContainer{
  forms: FormWem[];
}

export interface FormWem{
  id: number;
  description: string;
  oldDescription: string;
}
export interface FormProducts extends BaseModel{
  container: FormProductContainer;
}
export interface FormProductContainer {
  products: FormProductWem[];
}
export interface FormProductWem{
  id: number;
  name: string;
}