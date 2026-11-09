'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/api/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/hooks/useCurrency';
import QuickVariantModal from '@/components/shared/QuickVariantModal';
import QuickViewModal from '@/components/shared/QuickViewModal';
import NotifyMeModal from '@/components/shared/NotifyMeModal';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';

export interface FurnitureProductCardProps {
  product: Product;
  badge?: string;
  badgeType?: 'new' | 'bestseller' | 'botanical' | 'limited';
}

export default function FurnitureProductCard({
  product,
  badge,
  badgeType = 'new',
}: FurnitureProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isNotifyMeOpen, setIsNotifyMeOpen] = useState(false);

  const hasVariants = Boolean(product.variants && product.variants.length > 0);
  const variantPrices = hasVariants
    ? product.variants!.map((v) => Number(v.price)).filter((p) => !isNaN(p))
    : [];
  const minVariantPrice =
    variantPrices.length > 0 ? Math.min(...variantPrices) : Number(product.price);
  const maxVariantPrice =
    variantPrices.length > 0 ? Math.max(...variantPrices) : Number(product.price);
  const hasPriceRange = hasVariants && minVariantPrice !== maxVariantPrice;

  const isWishlisted = isInWishlist(product.id);
  const mainImage =
    product.image ||
    (product.images && product.images[0]) ||
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop';

  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

  const stock = hasVariants
    ? product.variants!.reduce((sum, v) => sum + Number(v.inventory ?? 0), 0)
    : product.stockQuantity !== undefined
      ? Number(product.stockQuantity)
      : product.inventory !== undefined
        ? Number(product.inventory)
        : 10;
  const isOutOfStock = stock <= 0;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) {
      setIsNotifyMeOpen(true);
      return;
    }

    if (hasVariants) {
      setIsVariantModalOpen(true);
      return;
    }

    if (isAdding) return;
    setIsAdding(true);

    try {
      await addToCart({ productId: product.id, quantity: 1 });
      setAdded(true);
      setTimeout(() => setAdded(false), 2200);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    } finally {
      setIsAdding(false);
    }
  };

  const badgeStyle = {
    new: 'bg-[#c5e7d6] text-[#4a695b]',
    bestseller: 'bg-[#e9e8e5] text-[#040505] font-semibold',
    botanical: 'bg-[#ffdbce] text-[#7b2f0d]',
    limited: 'bg-[#adcebd] text-[#012116]',
  }[badgeType];

  const productUrl = `/products/${product.urlSlug || product.id}`;

  return (
    <>
      <div className="group relative flex flex-col bg-[#faf9f6] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-[#e3e2e0]/60">
        {/* Product Image Stage */}
        <div className="relative aspect-[3/4] w-full bg-[#efeeeb] overflow-hidden">
          {/* Badge */}
          {(badge || discount > 0) && (
            <span
              className={`absolute top-3 left-3 z-10 text-[11px] font-semibold px-2 py-1 rounded uppercase tracking-wider ${
                badge ? badgeStyle : 'bg-[#ba1a1a] text-white'
              }`}
              style={{ fontFamily: 'var(--font-plus-jakarta, sans-serif)' }}
            >
              {badge || `-${discount}%`}
            </span>
          )}

          {/* Wishlist Button */}
          <button
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-[#faf9f6]/80 backdrop-blur-sm flex items-center justify-center transition-colors shadow-sm ${
              isWishlisted ? 'text-[#ba1a1a]' : 'text-[#444748] hover:text-[#ba1a1a]'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#ba1a1a]' : ''}`} />
          </button>

          {/* Quick View Button */}
          <button
            aria-label="Quick View"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsQuickViewOpen(true);
            }}
            className="absolute top-14 right-3 z-10 w-9 h-9 rounded-full bg-[#faf9f6]/80 backdrop-blur-sm flex items-center justify-center text-[#444748] hover:text-[#040505] transition-all opacity-0 group-hover:opacity-100 shadow-sm"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Image */}
          <Link href={productUrl} className="block w-full h-full">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </Link>

          {/* Quick Add Overlay */}
          <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <button
              onClick={handleQuickAdd}
              disabled={isAdding}
              className={`w-full py-2.5 px-4 rounded-lg text-[13px] font-medium flex items-center justify-center gap-1.5 shadow-md transition-colors ${
                added
                  ? 'bg-[#466557] text-white'
                  : isOutOfStock
                    ? 'bg-[#e3e2e0] text-[#747878] cursor-not-allowed'
                    : 'bg-[#040505] text-white hover:bg-[#466557]'
              }`}
              style={{ fontFamily: 'var(--font-plus-jakarta, sans-serif)' }}
            >
              <ShoppingBag className="w-4 h-4" />
              {added
                ? 'Added to Bag'
                : isAdding
                  ? 'Adding...'
                  : isOutOfStock
                    ? 'Notify When Available'
                    : hasVariants
                      ? `Select Options • ${formatPrice(minVariantPrice)}`
                      : `Quick Add • ${formatPrice(product.price)}`}
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Rating */}
          <div className="flex items-center gap-1 mb-1.5">
            <div className="flex text-[#D4A373]">
              <Star className="w-3.5 h-3.5 fill-[#D4A373]" />
              <Star className="w-3.5 h-3.5 fill-[#D4A373]" />
              <Star className="w-3.5 h-3.5 fill-[#D4A373]" />
              <Star className="w-3.5 h-3.5 fill-[#D4A373]" />
              <Star className="w-3.5 h-3.5 fill-[#D4A373]" />
            </div>
            <span
              className="text-[12px] text-[#747878] ml-1"
              style={{ fontFamily: 'var(--font-plus-jakarta, sans-serif)' }}
            >
              ({product.reviewsCount ?? (100 + (product.id.charCodeAt(0) % 150))})
            </span>
          </div>

          {/* Product Title */}
          <Link href={productUrl}>
            <h3
              className="text-[17px] font-semibold text-[#040505] mb-1 hover:text-[#466557] transition-colors line-clamp-1"
              style={{ fontFamily: 'var(--font-playfair, serif)' }}
            >
              {product.name}
            </h3>
          </Link>

          {/* Short Description */}
          <p
            className="text-[13px] text-[#444748] line-clamp-1 mb-3"
            style={{ fontFamily: 'var(--font-plus-jakarta, sans-serif)' }}
          >
            {product.description || 'Artisanal interior and living design object.'}
          </p>

          {/* Price & Materials/Swatches */}
          <div className="mt-auto flex items-center justify-between pt-1 border-t border-[#e3e2e0]/40">
            <div className="flex items-baseline gap-2">
              <span
                className="text-[14px] font-semibold text-[#040505]"
                style={{ fontFamily: 'var(--font-plus-jakarta, sans-serif)' }}
              >
                {hasPriceRange
                  ? `${formatPrice(minVariantPrice)} - ${formatPrice(maxVariantPrice)}`
                  : formatPrice(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-[12px] text-[#747878] line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            {/* Subtle Craft Swatches */}
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#B85D38] border border-black/10" title="Terracotta Warmth" />
              <span className="w-3 h-3 rounded-full bg-[#756D63] border border-black/10" title="Smoked Carbon" />
              <span className="w-3 h-3 rounded-full bg-[#D8D2C6] border border-black/10" title="Natural Ash" />
            </div>
          </div>
        </div>
      </div>

      {/* Shared Modals */}
      {isVariantModalOpen && (
        <QuickVariantModal
          isOpen={isVariantModalOpen}
          product={product}
          onClose={() => setIsVariantModalOpen(false)}
        />
      )}
      {isQuickViewOpen && (
        <QuickViewModal
          isOpen={isQuickViewOpen}
          product={product}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}
      {isNotifyMeOpen && (
        <NotifyMeModal
          isOpen={isNotifyMeOpen}
          product={product}
          onClose={() => setIsNotifyMeOpen(false)}
        />
      )}
    </>
  );
}
