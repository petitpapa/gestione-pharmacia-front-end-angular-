import { BaseResponse } from "./base.wem";
export interface SupplierResponse extends BaseResponse {
  container: SupplierContainer;
}
export interface SupplierContainer {
  suppliers: SupplierWem[];
}

export interface SupplierWem {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  codeIdentification: string;
}

export interface SupplierRequest {
  id: string;
  name?: string;
  codeIdentification?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
}
