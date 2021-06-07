import { createFeatureSelector, createSelector } from "@ngrx/store";
import {ShoppingCart} from './cart.reducer';
export const selectCoreState = createFeatureSelector<ShoppingCart>("cart");

export const selectCartItems = createSelector(
  selectCoreState,
  (selectCoreState) => selectCoreState.cartItems
);

export const selectCustomer = createSelector(selectCoreState, (state) => state.customer);

export const selectCartItemsCount = createSelector(
  [selectCartItems],
  cartItems =>
    cartItems.reduce(
      (accumalatedQuantity, cartItem) =>
        accumalatedQuantity + cartItem.quantityToCmd,
      0
    )
);

export const selectCartTotal = createSelector(
  [selectCartItems],
  cartItems =>
    cartItems.reduce(
      (accumalatedQuantity, cartItem) =>
        accumalatedQuantity + cartItem.quantityToCmd * (+cartItem.price),
      0
    )
);
