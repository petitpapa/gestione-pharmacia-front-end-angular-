import { ActionReducerMap} from '@ngrx/store';
import { sidebarReducer, SidebarState } from './sidebar/store/sidebar.reducer';
import {CoreState, reducer_core} from './store/core.reducer';
import {CommandState,commandReducer } from '../commandes/store/command.reducer';
import {cartReducer, ShoppingCart} from '../ventes/store/cart.reducer';
export interface AppState {
  sidebar: SidebarState;
  core: CoreState;
  command: CommandState;
  cart: ShoppingCart
}

export const Corereducers: ActionReducerMap<AppState> = {
  sidebar: sidebarReducer,
  core: reducer_core,
  command: commandReducer,
  cart: cartReducer
};




