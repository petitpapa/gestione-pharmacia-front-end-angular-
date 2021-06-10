export interface FactureByCategoryWem {
  commandId: number;
  description: string;
  sum: number;
  avg: number;
}

export interface FactureByCategoryResponse {
  errorCode: number;
  errorMessage?: any;
  factures: FactureByCategoryWem[];
}



