import { cartStorage } from '../storage';
import { CartItem, Product } from '../types';

export const cartService = {
  getCart: (): CartItem[] => {
    return cartStorage.getCart();
  },

  addItem: (product: Product, quantity = 1): CartItem[] => {
    return cartStorage.addItem(product, quantity);
  },

  updateQuantity: (productId: string, quantity: number): CartItem[] => {
    return cartStorage.updateQuantity(productId, quantity);
  },

  removeItem: (productId: string): CartItem[] => {
    return cartStorage.removeItem(productId);
  },

  clearCart: (): void => {
    cartStorage.clearCart();
  },

  getTotals: () => {
    return cartStorage.getTotals();
  }
};
