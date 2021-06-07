import { BaseModel } from "./base-model";

export interface DateRangeResponse extends BaseModel {
  startDate: string;
  endDate: string;
}
