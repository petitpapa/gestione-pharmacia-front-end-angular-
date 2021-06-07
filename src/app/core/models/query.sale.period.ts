import { BaseModel } from "./base-model";

export interface SaleQueryPeriodResponse extends BaseModel {
  queriesPeriod: SaleQueryPeriodWem[];
}

export interface SaleQueryPeriodWem {
  key: string;
  value: string;
}
