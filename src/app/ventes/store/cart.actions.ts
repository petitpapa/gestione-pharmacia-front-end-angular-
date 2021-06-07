import { createAction, props } from "@ngrx/store";
import { Customer, Product } from "../../core/models";

export const addItem = createAction(
  "[cart item] add item",
  props<{ item: Product }>()
);

export const removeItem = createAction("[cart item] remove item",props<{ item: Product }>());


export const clearCart = createAction("[cart item] remove all items");

export const updateItemPrice = createAction("[cart item] apply remise on item",props<{ item: Product, remise: number }>());

export const clearItemFromCart = createAction(
  "[cart item] clear item from cart",
  props<{ payload3Type }>()
);

export const addCustomer = createAction("[cart item] add customer", props<{customer: Customer}>());
