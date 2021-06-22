export interface InventoryWem {
  form: string;
  product: string;
  stockInitial: number;
  qtySell: number;
  returnedQty: number;
  purchaseQty: number;
  issueQty: number;
  stockLevel: number;
  inventoryDays: number;
}

export interface ProductInventoriesResponse {
  errorCode: number;
  errorMessage?: any;
  results: InventoryWem[];
}



