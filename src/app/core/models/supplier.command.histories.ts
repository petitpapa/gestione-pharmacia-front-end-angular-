export interface CommandHistory {
  name: string;
  price: number;
  expiryDate: string;
  salePrice: number;
  unitPriceHT: number;
  qty: number;
  total: number;
  status: string;
}

export interface SupplierCommandHistoriesResponse {
  errorCode: number;
  errorMessage?: string;
  commands: CommandHistory[];
}



