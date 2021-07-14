import {BaseModel} from "./base-model";

export interface PharmaConfigResponse extends BaseModel{
  variableDescription: string;
  variableValue: string;
  variablename?: string;
}
