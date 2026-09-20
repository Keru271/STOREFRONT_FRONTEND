'use client';

import { useEffect } from 'react';
import { trackViewContent } from '@/lib/analytics/events';
import type { Product } from '@/lib/api/types';

interface ProductViewTrackerProps {
  product: Product;
  currency?: string;
}

export function ProductViewTracker({ product, currency = 'USD' }: ProductViewTrackerProps) {
  useEffect(() => {
    if (!product) return;
    trackViewContent({
      id: product.id,
      name: product.name,
      price: product.price,
      currency: currency || 'USD',
      category: product.categoryName || undefined,
    });
  }, [product, currency]);

  return null;
}
