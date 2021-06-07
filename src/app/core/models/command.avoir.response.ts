import {BaseModel} from "./base-model";


export interface AvoirId {
  productId: number;
  supplierId: number;
}

export interface Command {
  invoiceNumber: string;
  commandId: number;
  avoirId: AvoirId;
  date: string;
  unitPriceHT: number;
  discount: number;
  id: number;
  supplierName: string;
  supplierId: number;
  productReturn: boolean;
}

export interface CommandAvoirResponse extends BaseModel {
  commands: Command[];
  numberOfCommand: number;
  numberOfAvoir: number;
  totalAvoir: number;
  totalCommand: number;
  totalFacture: number;
}



