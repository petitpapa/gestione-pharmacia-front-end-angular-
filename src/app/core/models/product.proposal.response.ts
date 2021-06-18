export interface Proposal {
  productId: number,
  form: string;
  category: string;
  name: string;
  salePrice: number;
  commandSystem: string;
  min: number;
  max: number;
}

export interface ProductOrderingProposalResponse {
  errorCode: number;
  errorMessage?: any;
  proposals: Proposal[];
}



