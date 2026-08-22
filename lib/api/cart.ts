// ─── Cart API ─────────────────────────────────────────────────────────────────
// Cart operations: getCart, addToCart, deleteToCart, updateCartItem, clearCart

import { apiClient } from './client';
import type {
  Cart,
  AddToCartInput,
  UpdateCartInput,
  RemoveCartInput,
} from './types';

/**
 * Fetches the current cart by cartToken.
 */
export async function getCart(cartToken: string): Promise<Cart> {
  if (!cartToken) {
    return {
      cartToken: '',
      items: [],
      totalAmount: 0,
      itemCount: 0,
    };
  }

  try {
    return await apiClient.get<Cart>(`api/storefront/cart/${encodeURIComponent(cartToken)}`);
  } catch (error) {
    console.error('Failed to get cart:', error);
    return {
      cartToken,
      items: [],
      totalAmount: 0,
      itemCount: 0,
    };
  }
}

/**
 * Adds an item to the cart (addToCart).
 * Generates a cartToken if one is not provided.
 */
export async function addToCart(input: AddToCartInput): Promise<Cart> {
  return apiClient.post<Cart>('api/storefront/cart/add', input);
}

/**
 * Removes an item from the cart (deleteToCart / removeFromCart).
 */
export async function deleteToCart(input: RemoveCartInput): Promise<Cart> {
  return apiClient.post<Cart>('api/storefront/cart/remove', input);
}

/**
 * Alias for deleteToCart.
 */
export const removeFromCart = deleteToCart;

/**
 * Updates the quantity of a cart line item.
 */
export async function updateCartItem(input: UpdateCartInput): Promise<Cart> {
  return apiClient.post<Cart>('api/storefront/cart/update', input);
}

/**
 * Clears all items in the cart.
 */
export async function clearCart(cartToken: string): Promise<Cart> {
  return apiClient.post<Cart>('api/storefront/cart/clear', { cartToken });
}
