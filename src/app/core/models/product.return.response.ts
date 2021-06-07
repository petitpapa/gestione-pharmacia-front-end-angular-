export interface ReturnedProduct {
  id: number;
  productId: number;
  productName: string;
  supplierId: number;
  supplierName: string;
  productForm: string;
  emittedQty: number;
  acceptedQty: number;
  suspendedQty: number;
  returnedQty: number;
  salePrice: number;
  unitPriceHT: number;
  productExpiryDate: string;
  dateOfIssue: string;
  reason: string;
  state: string
}

export interface ReturnedProductResponse {
  errorCode: number;
  errorMessage?: any;
  returnedProducts: ReturnedProduct[];
}



