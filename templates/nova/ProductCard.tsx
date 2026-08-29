'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import type { Product } from '@/lib/api/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/hooks/useCurrency';
import QuickVariantModal from '@/components/shared/QuickVariantModal';

interface NovaProductCardProps {
  product: Product;
}

export default function NovaProductCard({ product }: NovaProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const [isAdding, setIsAdding] = useState(false);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);

  const hasVariants = Boolean(product.variants && product.variants.length > 0);
  const variantPrices = hasVariants
    ? product.variants!.map((v) => Number(v.price)).filter((p) => !isNaN(p))
    : [];
  const minVariantPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : Number(product.price);
  const maxVariantPrice = variantPrices.length > 0 ? Math.max(...variantPrices) : Number(product.price);
  const hasPriceRange = hasVariants && minVariantPrice !== maxVariantPrice;

  const isLiked = isInWishlist(product.id);
  const primaryImage = product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80';
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const stock = hasVariants
    ? product.variants!.reduce((sum, v) => sum + Number(v.inventory ?? 0), 0)
    : (product.stockQuantity !== undefined ? Number(product.stockQuantity) : product.inventory !== undefined ? Number(product.inventory) : 1);
  const isOutOfStock = stock <= 0;
  const productHref = `/products/${product.urlSlug || product.id}`;
  const categoryLabel = product.categoryName || (typeof product.category === 'string' ? product.category : '');

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    if (hasVariants) {
      setIsVariantModalOpen(true);
      return;
    }

    setIsAdding(true);
    try {
      await addToCart({ productId: product.id, quantity: 1 });
    } finally {
      setTimeout(() => setIsAdding(false), 400);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="group relative bg-white border border-[#e2e2e5] rounded-[8px] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-[#d2d2d7]">
      
      {/* Top Image Container */}
      <div className="relative w-full aspect-[4/3] bg-[#f5f5f7] flex items-center justify-center p-6 overflow-hidden">
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {hasVariants && (
            <span className="px-2 py-0.5 text-[10px] font-semibold tracking-tight uppercase bg-indigo-600 text-white rounded-[980px]">
              {product.variants!.length} Options
            </span>
          )}
          {hasDiscount && (
            <span className="px-2 py-0.5 text-[10px] font-semibold tracking-tight uppercase bg-[#1d1d1f] text-white rounded-[980px]">
              Special Offer
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-tight uppercase bg-rose-600 text-white rounded-[980px]">
              Out of Stock
            </span>
          )}
        </div>

        {/* Wishlist Heart Action */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#1d1d1f] hover:text-[#e11d48] hover:bg-white shadow-sm transition-all"
          title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#e11d48] text-[#e11d48]' : 'fill-none stroke-currentColor'}`} strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Product Image */}
        <Link href={productHref} className="w-full h-full flex items-center justify-center relative">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-6 transform transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Brand or Category */}
          {categoryLabel && (
            <span className="text-[11px] font-medium text-[#858585] uppercase tracking-wider block mb-1">
              {categoryLabel}
            </span>
          )}

          {/* Product Title */}
          <Link href={productHref}>
            <h3 className="text-[15px] font-semibold text-[#1d1d1f] leading-snug line-clamp-2 hover:text-[#0071e3] transition-colors mb-2">
              {product.name}
            </h3>
          </Link>

          {/* Description snippet */}
          {product.description && (
            <p className="text-[12px] text-[#707070] line-clamp-2 mb-3 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-[#f5f5f7]">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-[16px] font-semibold text-[#1d1d1f]">
              {hasPriceRange ? `From ${formatPrice(minVariantPrice)}` : formatPrice(minVariantPrice)}
            </span>
            {hasDiscount && (
              <span className="text-[12px] text-[#858585] line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleQuickAdd}
              disabled={isOutOfStock || isAdding}
              className={`flex-1 py-1.5 px-3 rounded-[980px] text-[12px] font-normal text-white transition-all flex items-center justify-center gap-1 ${
                isOutOfStock
                  ? 'bg-[#e2e2e5] text-[#858585] cursor-not-allowed'
                  : 'bg-[#0071e3] hover:bg-[#0077ed] active:scale-[0.98]'
              }`}
            >
              {isAdding ? (
                <span>Adding...</span>
              ) : isOutOfStock ? (
                <span>Out of Stock</span>
              ) : hasVariants ? (
                <span>Select Options ⚡</span>
              ) : (
                <span>Add to Bag</span>
              )}
            </button>

            <Link
              href={productHref}
              className="py-1.5 px-2.5 rounded-[980px] border border-[#0066cc] text-[#0066cc] text-[12px] font-normal hover:bg-[#f4f8fb] transition-colors"
            >
              Buy &gt;
            </Link>
          </div>
        </div>

      </div>

      {/* Quick Variant Modal */}
      {hasVariants && (
        <QuickVariantModal
          isOpen={isVariantModalOpen}
          onClose={() => setIsVariantModalOpen(false)}
          product={product}
        />
      )}
    </div>
  );
}
