import { createReducer, on } from "@ngrx/store";
import * as fromSidebarActions from "./sidebar.actions";
import { SidebarRowContainer } from "../../models/sidebar.row";
export interface SidebarState {
  isLoading: boolean;
  results: SidebarRowContainer;
  allRowLoaded: boolean;
}

const initialState: SidebarState = {
  isLoading: false,
  results: {
    errorCode: -1,
    errorMessage: "",
    container: {
      sidebarRows: [],
    },
  },
  allRowLoaded: false,
};

export const sidebarReducer = createReducer(
  initialState,
  on(fromSidebarActions.sidebarStart, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(fromSidebarActions.sidebarLoadSuccess, (state, action) => ({
    ...state,
    results: action.results,
    isLoading: false,
    allRowLoaded: true,
  }))
);
