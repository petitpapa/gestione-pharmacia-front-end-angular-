import { Product } from "./product.response";

export interface PriceAndExpirationItem {
  buyingPrice: number;
  qty: number;
  expirationDate: string;
}

export interface ProductDetailResponse {
  errorCode: number;
  errorMessage?: any;
  product: Product;
  priceAndExpirationItems: PriceAndExpirationItem[];
  suppliers: string[],
  averagePrice: number;
  lastSelling: string;
  lastBying: string;
}
