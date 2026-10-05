import React, { createContext, useContext, useEffect, useState } from 'react';
import { cartService } from '../services';
import { subscribeToStorage } from '../storage';
import { CartItem, Product } from '../types';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  count: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  isItemInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { showToast } = useToast();

  const syncCart = () => {
    setItems(cartService.getCart());
  };

  useEffect(() => {
    syncCart();
    const unsubscribe = subscribeToStorage((key) => {
      if (key === 'cleantec_cart') {
        syncCart();
      }
    });
    return () => unsubscribe();
  }, []);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addItem = (product: Product, quantity = 1) => {
    const updated = cartService.addItem(product, quantity);
    setItems(updated);
    showToast(`Added ${product.name} to cart.`, 'success');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const updated = cartService.updateQuantity(productId, quantity);
    setItems(updated);
  };

  const removeItem = (productId: string) => {
    const updated = cartService.removeItem(productId);
    setItems(updated);
    showToast('Item removed from cart.', 'info');
  };

  const clearCart = () => {
    cartService.clearCart();
    setItems([]);
  };

  const isItemInCart = (productId: string): boolean => {
    return items.some((item) => item.productId === productId);
  };

  const getItemQuantity = (productId: string): number => {
    const found = items.find((item) => item.productId === productId);
    return found ? found.quantity : 0;
  };

  const { count, subtotal, deliveryFee, total } = cartService.getTotals();

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        subtotal,
        deliveryFee,
        total,
        isCartOpen,
        openCart,
        closeCart,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        isItemInCart,
        getItemQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
