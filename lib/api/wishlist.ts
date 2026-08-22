// ─── Wishlist API ─────────────────────────────────────────────────────────────
// Wishlist operations: getWishlist, addToWishlist, deleteFromWishlist, clearWishlist

import { apiClient } from './client';
import type { WishlistResponse } from './types';

export interface WishlistOptions {
  token?: string;
  customerEmail?: string;
  productIds?: string[];
}

/**
 * Fetches the wishlist items for the authenticated user or email / guest product IDs.
 */
export async function getWishlist(options?: WishlistOptions): Promise<WishlistResponse> {
  const queryParams = new URLSearchParams();
  if (options?.customerEmail) queryParams.set('customerEmail', options.customerEmail);
  if (options?.productIds && options.productIds.length > 0) {
    queryParams.set('productIds', options.productIds.join(','));
  }

  const query = queryParams.toString();
  const endpoint = `api/storefront/wishlist${query ? `?${query}` : ''}`;

  try {
    return await apiClient.get<WishlistResponse>(endpoint, {
      token: options?.token,
    });
  } catch (error) {
    console.error('Failed to fetch wishlist:', error);
    return {
      productIds: options?.productIds || [],
      items: [],
      count: 0,
    };
  }
}

/**
 * Adds a product to the customer's wishlist (addToWishlist).
 */
export async function addToWishlist(
  productId: string,
  options?: { token?: string; customerEmail?: string }
): Promise<WishlistResponse> {
  return apiClient.post<WishlistResponse>(
    'api/storefront/wishlist/add',
    { productId, customerEmail: options?.customerEmail },
    { token: options?.token }
  );
}

/**
 * Removes a product from the customer's wishlist (deleteFromWishlist).
 */
export async function deleteFromWishlist(
  productId: string,
  options?: { token?: string; customerEmail?: string }
): Promise<WishlistResponse> {
  return apiClient.post<WishlistResponse>(
    'api/storefront/wishlist/remove',
    { productId, customerEmail: options?.customerEmail },
    { token: options?.token }
  );
}

/**
 * Alias for deleteFromWishlist.
 */
export const removeFromWishlist = deleteFromWishlist;

/**
 * Clears the customer's entire wishlist.
 */
export async function clearWishlist(
  options?: { token?: string; customerEmail?: string }
): Promise<WishlistResponse> {
  return apiClient.post<WishlistResponse>(
    'api/storefront/wishlist/clear',
    { customerEmail: options?.customerEmail },
    { token: options?.token }
  );
}
