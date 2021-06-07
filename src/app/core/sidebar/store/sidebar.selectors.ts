import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SidebarState } from "./sidebar.reducer";

export const selectCoreState = createFeatureSelector<SidebarState>("sidebar");
export const allSidebarAreLoaded = createSelector(
  selectCoreState,
  (sidebarState) => sidebarState.allRowLoaded
);
export const sidebarRowData = createSelector(
  selectCoreState,
  (sidebar) => sidebar.results.container.sidebarRows
);

export const loadingSidebarData = createSelector(
  selectCoreState,
  (sidebarState) => sidebarState.isLoading
);
