import { createAction, props } from '@ngrx/store';
import {Command, CommandContainer, CommandItem, SupplierWem} from '../../core/models';

export const onCommandSelected = createAction(
  '[command-reception] new command',
  props<{ command: CommandContainer }>()
);

export const onUpdateCommandItem = createAction(
  '[command-reception] update command item',
  props<{ item: CommandItem }>()
);

export const onAddCommandItem = createAction(
  '[command-reception] Add command item',
  props<{ item: CommandItem }>()
);
export const onUpdateCommandProperties = createAction(
  '[command-reception] update command properties',
  props<{ properties: any }>()
);

export const addReglementSupplier = createAction(
  '[command-reglement-supplier] command reglement supplier',
  props<{ supplierCommand: {supplier: SupplierWem, cmds: Command[]} }>()
);

