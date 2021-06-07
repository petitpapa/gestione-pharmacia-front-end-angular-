import { BaseModel } from "./base-model";

export interface ProductResponse extends BaseModel{
  container: ProductContainer;
}

export interface Fabricant {
  id: number;
  address: string;
  name: string;
  phoneNumber: string;
}

export interface Category {
  id: number;
  name: string;
  code: string;
}

export interface Form {
  id: number;
  description: string;
}

export interface Rayon {
  id: number;
  description: string;
  codification: string;
}

export interface Composition {
  id: number;
  name: string;
  quantityMilligramm: number;
}

export interface TherapeuticFamilly {
  id: number;
  description: string;
  code: number;
}

export interface Product {
  id: number;
  name: string;
  barCode: string;
  image?: string[];
  administrationMode: string;
  usage?: string;
  contreIndication: string;
  reorderLevel: number;
  maxOrderLevel: number;
  stockQuantity: number; 
  fabricant: Fabricant;
  price: number;
  category: Category;
  form: Form;
  rayon: Rayon;
  composition: Composition;
  therapeuticFamilly: TherapeuticFamilly;

  quantityToCmd: number;

  remise: number ;
}

export interface ProductContainer {
  products: Product[];
}
