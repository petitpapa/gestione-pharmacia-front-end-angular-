import { BaseModel } from "./base-model";
import { Product } from "./product.response";
export interface CategoryResponse extends BaseModel {
  container: CategoryContainer;
}

export interface CategoryContainer {
 categories: CategoryWem[];
}

export interface CategoryWem {
  id: number;
  decription: string;
  products: Product[];
}
