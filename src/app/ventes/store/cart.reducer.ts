import { Customer, Product } from "../../core/models";
import * as actions from "./cart.actions";
import { createReducer, on } from "@ngrx/store";
import { CartUtils } from "./cart.util";

export interface ShoppingCart {
  cartItems: Product[];
  customer: Customer;
}

const initialState: ShoppingCart = {
  cartItems: [],
  customer: {
    category: "CLIENT_DE_PASSAGE",
    name: "Client de passage",
    customerId: -1,
  },
};

export const cartReducer = createReducer(
  initialState,
  on(actions.addItem, (state, action) => ({
    ...state,
    cartItems: new CartUtils().addItemToCart(state.cartItems, action.item),
  })),
  on(actions.addCustomer, (state, action) => ({
    ...state,
    customer: action.customer,
  })),
  on(actions.removeItem, (state, action) => ({
    ...state,
    cartItems: new CartUtils().removeItemFromCart(state.cartItems, action.item),
  })),

  on(actions.updateItemPrice, (state, action) => ({
    ...state,
    cartItems: new CartUtils().addRemise(
      state.cartItems,
      action.item,
      action.remise
    ),
  })),

  on(actions.clearCart, (state, action) => ({
    ...initialState,
  }))
);
