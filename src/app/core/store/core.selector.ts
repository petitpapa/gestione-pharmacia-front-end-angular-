import { createFeatureSelector, createSelector } from "@ngrx/store";
import { CoreState } from "./core.reducer";

export const selectCoreState = createFeatureSelector<CoreState>("core");

export const sidebarToggleState = createSelector(
  selectCoreState,
  (s) => s.sidebarExpanded
);

export const selectNotificationPopup = createSelector(
  selectCoreState,
  (s) => s.notification
);

export const selectIsFirstPage = createSelector(
  selectCoreState,
  (s) => s.pagination.isFirst
);

export const selectIsLastPage = createSelector(
  selectCoreState,
  (s) => s.pagination.isLast
);

export const selectCurrentIndex = createSelector(
  selectCoreState,
  (s) => s.pagination.currentIndex
);

export const selectNextOpeningCashFund = createSelector(
  selectCoreState,
  (s) => s.nextOpeningCashFund
)