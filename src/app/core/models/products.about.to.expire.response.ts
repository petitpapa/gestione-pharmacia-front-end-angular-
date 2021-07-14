export interface ProductsAboutToExpire {
  form: string;
  product: string;
  expiresOn: string;
  ppv: number;
  qty: number;
  supplier: string;
  alreadyExpired: boolean;
}

export interface ProductsAboutToExpireResponse {
  errorCode: number;
  errorMessage?: any;
  productsAboutToExpire: ProductsAboutToExpire[];
}



