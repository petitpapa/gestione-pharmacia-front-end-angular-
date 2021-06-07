import { createFeatureSelector, createSelector } from "@ngrx/store";
import { CommandState } from "./command.reducer";

export const selectCommandState = createFeatureSelector<CommandState>(
  "command"
);

export const getSelectedCommand = createSelector(
  selectCommandState,
  (s) => s.selectedCommand
);

export const getSupplierCommandReglement = createSelector(
  selectCommandState, (s) => s.reglementSupplier
);
