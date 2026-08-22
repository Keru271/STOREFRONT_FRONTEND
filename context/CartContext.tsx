'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  getCart,
  addToCart as apiAddToCart,
  deleteToCart as apiDeleteToCart,
  updateCartItem as apiUpdateCartItem,
  clearCart as apiClearCart,
} from '@/lib/api/cart';
import type { Cart, CartItem, AddToCartInput } from '@/lib/api/types';
import { useToast } from '@/context/ToastContext';

interface CartContextValue {
  cart: Cart | null;
  items: CartItem[];
  itemCount: number;
  totalAmount: number;
  cartToken: string;
  isLoading: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (input: Omit<AddToCartInput, 'cartToken'>) => Promise<void>;
  deleteToCart: (productId: string, variantId?: string) => Promise<void>;
  removeFromCart: (productId: string, variantId?: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CART_STORAGE_KEY = 'storefront_cart_token';

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartToken, setCartToken] = useState<string>('');
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toast = useToast();

  // Initialize or retrieve cart token from localStorage
  useEffect(() => {
    let token = '';
    try {
      token = localStorage.getItem(CART_STORAGE_KEY) || '';
      if (!token) {
        token = `cart_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
        localStorage.setItem(CART_STORAGE_KEY, token);
      }
      setCartToken(token);
    } catch (err) {
      console.warn('LocalStorage unavailable for cartToken:', err);
    }

    if (token) {
      getCart(token)
        .then((data) => setCart(data))
        .catch(() => {})
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const refreshCart = useCallback(async () => {
    if (!cartToken) return;
    try {
      const data = await getCart(cartToken);
      setCart(data);
    } catch (err) {
      console.error('Error refreshing cart:', err);
    }
  }, [cartToken]);

  const addToCart = useCallback(
    async (input: Omit<AddToCartInput, 'cartToken'>) => {
      setIsLoading(true);
      try {
        const response = await apiAddToCart({
          ...input,
          cartToken: cartToken || undefined,
        });

        if (response.cartToken && response.cartToken !== cartToken) {
          setCartToken(response.cartToken);
          try {
            localStorage.setItem(CART_STORAGE_KEY, response.cartToken);
          } catch {}
        }

        setCart(response);
        toast.success(
          `Added to shopping bag (Qty: ${input.quantity || 1})`,
          'Bag Updated',
          {
            action: {
              label: 'View Bag',
              onClick: () => {
                window.location.href = '/cart';
              },
            },
          }
        );
      } catch (err) {
        console.error('Error in addToCart context:', err);
        toast.error('Failed to add item to bag. Please try again.');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [cartToken, toast]
  );

  const deleteToCart = useCallback(
    async (productId: string, variantId?: string) => {
      if (!cartToken) return;
      setIsLoading(true);
      try {
        const response = await apiDeleteToCart({
          cartToken,
          productId,
          variantId,
        });
        setCart(response);
        toast.info('Item removed from shopping bag', 'Bag Updated');
      } catch (err) {
        console.error('Error in deleteToCart context:', err);
        toast.error('Could not remove item from bag.');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [cartToken, toast]
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number, variantId?: string) => {
      if (!cartToken) return;
      setIsLoading(true);
      try {
        const response = await apiUpdateCartItem({
          cartToken,
          productId,
          variantId,
          quantity,
        });
        setCart(response);
      } catch (err) {
        console.error('Error in updateQuantity context:', err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [cartToken]
  );

  const clearCart = useCallback(async () => {
    if (!cartToken) return;
    setIsLoading(true);
    try {
      const response = await apiClearCart(cartToken);
      setCart(response);
    } catch (err) {
      console.error('Error in clearCart context:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [cartToken]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const items = cart?.items || [];
  const itemCount = cart?.itemCount ?? items.reduce((sum, it) => sum + it.quantity, 0);
  const totalAmount = cart?.totalAmount ?? items.reduce((sum, it) => sum + it.price * it.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        itemCount,
        totalAmount,
        cartToken,
        isLoading,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        deleteToCart,
        removeFromCart: deleteToCart,
        updateQuantity,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
