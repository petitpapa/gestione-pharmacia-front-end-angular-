import { BaseModel } from "./base-model";
import { BaseResponse } from "./base.wem";

export interface SidebarRowContainer extends BaseModel {
  container: {
    sidebarRows: SidebarRow[];
  };
}

export interface SidebarRow {
  id: number;
  description: string;
  svg: string;
  menus: SidebarRowMenu[];
}

export interface SidebarRowMenu {
  id: number;
  description: string;
  sidebarId: number;
}
