import { Product } from "../../core/models";

export class CartUtils {
  constructor() {}

  addItemToCart = (cartItems: Product[], cartItemToAdd: Product): Product[] => {
    const existingCartItem = cartItems.find(
      (cartItem) => cartItem.id === cartItemToAdd.id
    );

    if (existingCartItem) {
      return cartItems.map((cartItem) =>
        cartItem.id === cartItemToAdd.id
          ? { ...cartItem, quantityToCmd: cartItem.quantityToCmd + 1 }
          : cartItem
      );
    }

    return [...cartItems, { ...cartItemToAdd, quantityToCmd: 1 }];
  };

  removeItemFromCart = (
    cartItems: Product[],
    cartItemToRemove: Product
  ): Product[] => {
    const existingCartItem = cartItems.find(
      (cartItem) => cartItem.id === cartItemToRemove.id
    );

    if (existingCartItem.quantityToCmd === 1) {
      return cartItems.filter(
        (cartItem) => cartItem.id !== cartItemToRemove.id
      );
    }

    return cartItems.map((cartItem) =>
      cartItem.id === cartItemToRemove.id
        ? { ...cartItem, quantityToCmd: cartItem.quantityToCmd - 1 }
        : cartItem
    );
  };

  addRemise = (
    cartItems: Product[],
    cartItemToAdd: Product,
    remise: number
  ): Product[] => {
    const existingCartItem = cartItems.find(
      (cartItem) => cartItem.id === cartItemToAdd.id
    );

    if (existingCartItem) {
      return cartItems.map((cartItem) =>
        cartItem.id === cartItemToAdd.id
          ? { ...cartItem, remise: remise}
          : cartItem
      );
    }
    return cartItems;
  };
}
