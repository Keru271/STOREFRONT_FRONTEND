'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  getWishlist,
  addToWishlist as apiAddToWishlist,
  deleteFromWishlist as apiDeleteFromWishlist,
  clearWishlist as apiClearWishlist,
} from '@/lib/api/wishlist';
import type { WishlistItem } from '@/lib/api/types';
import { useToast } from '@/context/ToastContext';

interface WishlistContextValue {
  productIds: string[];
  items: WishlistItem[];
  wishlistCount: number;
  isLoading: boolean;
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => Promise<void>;
  deleteFromWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WISHLIST_STORAGE_KEY = 'storefront_wishlist_ids';

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [productIds, setProductIds] = useState<string[]>([]);
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const toast = useToast();

  // Load wishlist IDs from localStorage or API
  useEffect(() => {
    let savedIds: string[] = [];

    try {
      const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (raw) {
        savedIds = JSON.parse(raw);
        if (Array.isArray(savedIds)) setProductIds(savedIds);
      }
    } catch {}

    getWishlist({
      productIds: savedIds.length > 0 ? savedIds : undefined,
    })
      .then((res) => {
        if (res.productIds) {
          setProductIds(res.productIds);
          try {
            localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(res.productIds));
          } catch {}
        }
        if (res.items) setItems(res.items);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const refreshWishlist = useCallback(async () => {
    try {
      const res = await getWishlist({
        productIds: productIds.length > 0 ? productIds : undefined,
      });
      if (res.productIds) {
        setProductIds(res.productIds);
        try {
          localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(res.productIds));
        } catch {}
      }
      if (res.items) setItems(res.items);
    } catch (err) {
      console.error('Error refreshing wishlist:', err);
    }
  }, [productIds]);

  const isInWishlist = useCallback(
    (productId: string) => productIds.includes(productId),
    [productIds]
  );

  const addToWishlist = useCallback(
    async (productId: string) => {
      // Optimistic update
      const nextIds = Array.from(new Set([...productIds, productId]));
      setProductIds(nextIds);
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(nextIds));
      } catch {}

      toast.success('Saved to your wishlist', 'Wishlist', {
        action: {
          label: 'View Wishlist',
          onClick: () => {
            window.location.href = '/wishlist';
          },
        },
      });

      try {
        const res = await apiAddToWishlist(productId);
        if (res.productIds) setProductIds(res.productIds);
        if (res.items) setItems(res.items);
      } catch (err) {
        console.error('Error in addToWishlist:', err);
      }
    },
    [productIds, toast]
  );

  const deleteFromWishlist = useCallback(
    async (productId: string) => {
      // Optimistic update
      const nextIds = productIds.filter((id) => id !== productId);
      setProductIds(nextIds);
      setItems((prev) => prev.filter((it) => it.id !== productId));
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(nextIds));
      } catch {}

      toast.info('Item removed from wishlist', 'Wishlist');

      try {
        const res = await apiDeleteFromWishlist(productId);
        if (res.productIds) setProductIds(res.productIds);
        if (res.items) setItems(res.items);
      } catch (err) {
        console.error('Error in deleteFromWishlist:', err);
      }
    },
    [productIds, toast]
  );

  const toggleWishlist = useCallback(
    async (productId: string) => {
      if (isInWishlist(productId)) {
        await deleteFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    },
    [isInWishlist, deleteFromWishlist, addToWishlist]
  );

  const clearWishlist = useCallback(async () => {
    setProductIds([]);
    setItems([]);
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify([]));
    } catch {}

    try {
      await apiClearWishlist({});
    } catch (err) {
      console.error('Error in clearWishlist:', err);
    }
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        productIds,
        items,
        wishlistCount: productIds.length,
        isLoading,
        isInWishlist,
        addToWishlist,
        deleteFromWishlist,
        removeFromWishlist: deleteFromWishlist,
        toggleWishlist,
        clearWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
