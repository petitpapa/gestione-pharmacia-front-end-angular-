import {BaseModel} from "./base-model";

export interface ProductRow {
  productId: number;
  rayonId: number;
  rayonDescription: string;
  formId: number;
  formDescription: string;
  categoryId: number;
  categoryDescription: string;
  therapeuticFamillyId: number;
  therapeuticFamillyDescription?: any;
  compositionId: number;
  compositionName?: any;
  quantityMilligramm: number;
  image?: any;
  administrationMode?: any;
  contreIndication?: any;
  barcode: string;
  productName: string;
  posologie?: any;
  usage?: any;
  price: number;
  reorderLevel: number;
  itemStockLevel: number;
  suplierId: number;
  supplierName?: any;
  quantity: number;
  expiryDate?: any;
  remise: number;
}

export interface PriceAndExpirationItem {
  buyingPrice: number;
  qty: number;
  expirationDate: string;
}

export interface ProductDetailResponse extends BaseModel{
  products: ProductRow[];
  priceAndExpirationItems: PriceAndExpirationItem[];
  suppliers?: any;
  averagePrice: number;
  lastSelling: string;
  lastBying: string;
  sellingPriceAverage: number;
}




