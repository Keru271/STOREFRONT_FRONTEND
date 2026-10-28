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
import { Heart, ShoppingBag, Eye, MapPin, Check, Sparkles } from 'lucide-react';

export interface TechnoProductCardProps {
  product: Product;
}

// Curated artisan makers & origins for rich story metadata when product fields are general
const ARTISAN_MAKERS: { name: string; location: string; material: string; avatar: string }[] = [
  {
    name: 'Elena Vance',
    location: 'Asheville, NC',
    material: 'Hand-thrown Stoneware',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  },
  {
    name: 'Marcus Lind',
    location: 'Portland, OR',
    material: 'Carved Black Walnut',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  {
    name: 'Aoi Takahashi',
    location: 'Kyoto, Japan',
    material: 'Handwoven Indigo Linen',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
  },
  {
    name: 'Mateo Morales',
    location: 'Oaxaca, Mexico',
    material: 'Natural Terracotta Clay',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
  },
  {
    name: 'Clara Dubois',
    location: 'Provence, France',
    material: 'Botanical Cold-Pressed Oils',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
  },
];

export default function TechnoProductCard({ product }: TechnoProductCardProps) {
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
    'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800&auto=format&fit=crop';
  const secondaryImage =
    product.images && product.images.length > 1 ? product.images[1] : null;

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
        : 1;
  const isOutOfStock = stock <= 0;

  // Stable deterministic maker assignment based on product id
  const charCode = (product.id || '1').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const maker = ARTISAN_MAKERS[charCode % ARTISAN_MAKERS.length];
  const materialTag = (product as any).material || maker.material;

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
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  const href = `/products/${product.urlSlug || product.id}`;

  return (
    <>
      <div
        className="group relative flex flex-col justify-between bg-white rounded-[8px] border border-[#E7E5E4] hover:border-[#D6D3D1] transition-colors duration-200 overflow-hidden"
        style={{ fontFamily: "'Open Sans', sans-serif" }}
      >
        {/* Top Image Container — natural aspect ratio, flat border */}
        <div className="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden bg-[#FAF6F0] border-b border-[#E7E5E4]">
          <Link href={href} className="block w-full h-full relative">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`object-cover object-center transition-transform duration-500 group-hover:scale-105 ${
                secondaryImage ? 'group-hover:opacity-0' : ''
              }`}
            />
            {secondaryImage && (
              <Image
                src={secondaryImage}
                alt={`${product.name} alternate view`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-center absolute inset-0 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
              />
            )}
          </Link>

          {/* Floating Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
            {discount > 0 && (
              <span className="px-2 py-0.5 rounded-[4px] text-[11px] font-bold uppercase tracking-wider bg-[#DC2626] text-white">
                {discount}% Off
              </span>
            )}
            {/* Tertiary Forest Green Craft Process Badge */}
            <span className="px-2 py-0.5 rounded-[4px] text-[11px] font-bold uppercase tracking-wider bg-[#365314] text-[#DCFCE7]">
              Handcrafted
            </span>
            {isOutOfStock && (
              <span className="px-2 py-0.5 rounded-[4px] text-[11px] font-bold uppercase tracking-wider bg-[#1C1917] text-white">
                Sold Out
              </span>
            )}
          </div>

          {/* Action Buttons: Wishlist & Quick View */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
            <button
              onClick={handleWishlistClick}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className={`w-8 h-8 rounded-[4px] flex items-center justify-center transition-colors border ${
                isWishlisted
                  ? 'bg-[#C2410C] border-[#C2410C] text-white'
                  : 'bg-white/95 border-[#E7E5E4] text-[#57534E] hover:text-[#C2410C] hover:bg-[#FDF6EC]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleQuickViewClick}
              aria-label="Quick View"
              className="w-8 h-8 rounded-[4px] flex items-center justify-center bg-white/95 border border-[#E7E5E4] text-[#57534E] hover:text-[#C2410C] hover:bg-[#FDF6EC] transition-colors opacity-0 group-hover:opacity-100"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area — flat layout, generous 20px padding */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            {/* Maker Attribution & Studio Origin */}
            <div className="flex items-center gap-2 pb-1 border-b border-[#F5F5F4]">
              <img
                src={maker.avatar}
                alt={maker.name}
                className="w-5 h-5 rounded-full object-cover border border-[#D6D3D1] flex-shrink-0"
              />
              <span className="text-[12px] font-medium text-[#57534E] truncate">
                {maker.name}
              </span>
              <span className="text-[#D6D3D1] text-[11px]">·</span>
              <span className="text-[11px] text-[#A8A29E] flex items-center gap-0.5 truncate">
                <MapPin className="w-3 h-3 text-[#D4A373] inline flex-shrink-0" />
                {maker.location}
              </span>
            </div>

            {/* Product Title — Lora serif heading font */}
            <Link href={href} className="block group-hover:text-[#C2410C] transition-colors">
              <h3
                className="text-[17px] font-semibold text-[#1C1917] leading-snug line-clamp-2"
                style={{ fontFamily: "'Lora', serif" }}
              >
                {product.name}
              </h3>
            </Link>

            {/* Material & Craft Description Tag */}
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#365314] bg-[#DCFCE7]/60 px-2 py-0.5 rounded-[4px] border border-[#365314]/20">
                {materialTag}
              </span>
              {product.brandName && (
                <span className="text-[11px] text-[#57534E] font-medium">
                  by {product.brandName}
                </span>
              )}
            </div>
          </div>

          {/* Pricing & CTA Row */}
          <div className="pt-2 border-t border-[#E7E5E4] flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span
                  className="text-[18px] font-semibold text-[#1C1917]"
                  style={{ fontFamily: "'Source Code Pro', monospace" }}
                >
                  {hasPriceRange
                    ? `${formatPrice(minVariantPrice)} - ${formatPrice(maxVariantPrice)}`
                    : formatPrice(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span
                    className="text-[13px] text-[#A8A29E] line-through"
                    style={{ fontFamily: "'Source Code Pro', monospace" }}
                  >
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[#57534E]">Direct from artisan</span>
            </div>

            {/* Primary Action Button — Terracotta filled, 4px radius, flat border */}
            <button
              onClick={handleQuickAdd}
              disabled={isAdding}
              className={`h-[38px] px-3.5 rounded-[4px] text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                isOutOfStock
                  ? 'bg-transparent text-[#57534E] border border-[#D6D3D1] hover:bg-[#FDF6EC]'
                  : added
                    ? 'bg-[#166534] text-white border border-[#166534]'
                    : 'bg-[#C2410C] hover:bg-[#9A3412] active:bg-[#7C2D12] text-white border border-[#C2410C]'
              }`}
            >
              {isOutOfStock ? (
                <span>Notify Me</span>
              ) : added ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{hasVariants ? 'Options' : 'Add to Bag'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isVariantModalOpen && (
        <QuickVariantModal
          isOpen={isVariantModalOpen}
          onClose={() => setIsVariantModalOpen(false)}
          product={product as any}
        />
      )}

      {isQuickViewOpen && (
        <QuickViewModal
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
          product={product}
        />
      )}

      {isNotifyMeOpen && (
        <NotifyMeModal
          isOpen={isNotifyMeOpen}
          onClose={() => setIsNotifyMeOpen(false)}
          productId={product.id}
          productName={product.name}
        />
      )}
    </>
  );
}
