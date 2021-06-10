import { createReducer, on } from '@ngrx/store';
import {Command, CommandContainer, SupplierWem} from '../../core/models';
import * as actions from './command.action';
import { CommandUtils } from './command.utils';
export interface CommandState {
  selectedCommand: CommandContainer,
  reglementSupplier?: {supplier: SupplierWem, command: Command[]}
}

const initialState: CommandState = {
  selectedCommand: undefined,
  reglementSupplier: undefined
};

export const commandReducer = createReducer(
  initialState,
  on(
    actions.onCommandSelected,
    (state, action) => ({ ...state, selectedCommand: action.command }),
  ),
  on(actions.onUpdateCommandItem,
     (state, action) => ({ ...state, selectedCommand: CommandUtils.updateItem(state.selectedCommand, action.item) })),
  on(actions.onAddCommandItem,
     (state, action) => ({ ...state, selectedCommand: CommandUtils.addItem(state.selectedCommand, action.item) })),
  on(actions.onUpdateCommandProperties,
     (state, action) => ({ ...state, selectedCommand: CommandUtils.updateInvoice(state.selectedCommand, action.properties) })),
  on(actions.addReglementSupplier,
     (state, action) => ({...state, reglementSupplier: action.supplierCommand}))
);
