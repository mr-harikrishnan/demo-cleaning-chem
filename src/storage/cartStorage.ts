import { CartItem, Product } from '../types';
import { getData, removeData, STORAGE_KEYS, updateData } from './storageCore';

export const cartStorage = {
  getCart: (): CartItem[] => {
    return getData<CartItem[]>(STORAGE_KEYS.CART, []);
  },

  addItem: (product: Product, quantity = 1): CartItem[] => {
    if (!product || !product.id) return cartStorage.getCart();

    return updateData<CartItem[]>(
      STORAGE_KEYS.CART,
      (prev) => {
        const existingIdx = prev.findIndex((item) => item.productId === product.id);
        if (existingIdx > -1) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            quantity: updated[existingIdx].quantity + quantity
          };
          return updated;
        }
        return [...prev, { productId: product.id, product, quantity }];
      },
      []
    );
  },

  updateQuantity: (productId: string, quantity: number): CartItem[] => {
    if (!productId) return cartStorage.getCart();

    return updateData<CartItem[]>(
      STORAGE_KEYS.CART,
      (prev) => {
        if (quantity <= 0) {
          return prev.filter((item) => item.productId !== productId);
        }
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
      },
      []
    );
  },

  removeItem: (productId: string): CartItem[] => {
    if (!productId) return cartStorage.getCart();
    return updateData<CartItem[]>(
      STORAGE_KEYS.CART,
      (prev) => prev.filter((item) => item.productId !== productId),
      []
    );
  },

  clearCart: (): void => {
    removeData(STORAGE_KEYS.CART);
  },

  getTotals: (): { count: number; subtotal: number; deliveryFee: number; total: number } => {
    const items = cartStorage.getCart();
    const count = items.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const deliveryFee = subtotal > 1500 || subtotal === 0 ? 0 : 50;
    const total = subtotal + deliveryFee;

    return { count, subtotal, deliveryFee, total };
  }
};
