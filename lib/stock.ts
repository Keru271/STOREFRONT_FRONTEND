import type { Product, CartItem } from './api/types';

export interface ProductStockInfo {
  isOutOfStock: boolean;
  stock: number;
  hasVariants: boolean;
  isInStock: boolean;
  isLowStock: boolean;
  label: string;
}

/**
 * Universal helper to calculate real-time out of stock status for products and variants
 * across all storefront templates, product cards, PDP, wishlist, and cart.
 */
export function getProductStockInfo(
  product?: Partial<Product> | null,
  selectedVariantId?: string | null
): ProductStockInfo {
  if (!product) {
    return {
      isOutOfStock: true,
      stock: 0,
      hasVariants: false,
      isInStock: false,
      isLowStock: false,
      label: 'Out of Stock',
    };
  }

  // 1. Explicit status or flag check
  if (
    product.status === 'OUT_OF_STOCK' ||
    product.status === 'ARCHIVED' ||
    (product as any).inStock === false ||
    (product as any).isOutOfStock === true
  ) {
    return {
      isOutOfStock: true,
      stock: 0,
      hasVariants: Boolean(product.variants && product.variants.length > 0),
      isInStock: false,
      isLowStock: false,
      label: 'Out of Stock',
    };
  }

  const variants = product.variants && Array.isArray(product.variants) ? product.variants : [];
  const hasVariants = variants.length > 0;

  // 2. Specific variant selected
  if (selectedVariantId && hasVariants) {
    const selectedVariant = variants.find((v) => v.id === selectedVariantId);
    if (selectedVariant) {
      const vStock = Number(
        selectedVariant.inventory ??
          (selectedVariant as any).stockQuantity ??
          (selectedVariant as any).quantity ??
          (selectedVariant as any).stock ??
          0
      );
      const isOut = isNaN(vStock) || vStock <= 0;
      return {
        isOutOfStock: isOut,
        stock: Math.max(0, isNaN(vStock) ? 0 : vStock),
        hasVariants: true,
        isInStock: !isOut,
        isLowStock: vStock > 0 && vStock <= 5,
        label: isOut ? 'Out of Stock' : vStock <= 5 ? `Only ${vStock} left` : 'In Stock',
      };
    }
  }

  // 3. Overall product stock calculation
  let stock = 0;
  if (hasVariants) {
    stock = variants.reduce((sum, v) => {
      const inv = Number(
        v.inventory ??
          (v as any).stockQuantity ??
          (v as any).quantity ??
          (v as any).stock ??
          0
      );
      return sum + (isNaN(inv) ? 0 : inv);
    }, 0);
  } else if (product.stockQuantity !== undefined && product.stockQuantity !== null) {
    stock = Number(product.stockQuantity);
  } else if (product.inventory !== undefined && product.inventory !== null) {
    stock = Number(product.inventory);
  } else if ((product as any).stock !== undefined && (product as any).stock !== null) {
    stock = Number((product as any).stock);
  } else {
    // If not specified at all, check if status is active or default to 0
    stock = product.status === 'ACTIVE' ? 0 : 0;
  }

  if (isNaN(stock)) stock = 0;

  const isOutOfStock = stock <= 0;
  return {
    isOutOfStock,
    stock: Math.max(0, stock),
    hasVariants,
    isInStock: !isOutOfStock,
    isLowStock: stock > 0 && stock <= 5,
    label: isOutOfStock ? 'Out of Stock' : stock <= 5 ? `Only ${stock} left` : 'In Stock',
  };
}

/**
 * Checks whether an item in the shopping cart is out of stock.
 */
export function isCartItemOutOfStock(item: CartItem): boolean {
  if (item.isOutOfStock === true) return true;
  if (item.stockQuantity !== undefined && item.stockQuantity !== null && Number(item.stockQuantity) <= 0) {
    return true;
  }
  return false;
}
