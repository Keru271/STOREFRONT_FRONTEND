'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product, ProductVariant, ThemeConfig } from '@/lib/api/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/hooks/useCurrency';
import { useToast } from '@/hooks/useToast';
import NotifyMeModal from './NotifyMeModal';

export interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  activeTemplate?: string;
  theme?: ThemeConfig;
}

export default function QuickViewModal({
  isOpen,
  onClose,
  product,
  activeTemplate = 'default',
  theme,
}: QuickViewModalProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const toast = useToast();

  const templateSlug = (activeTemplate || theme?.activeTemplateSlug || 'default').toLowerCase();
  const isNova = templateSlug === 'nova' || templateSlug === 'electronics' || templateSlug === 'tech';
  const isLuxe = templateSlug === 'luxe' || templateSlug === 'luxury' || templateSlug === 'fashion';
  const isMinimal = templateSlug === 'minimal' || templateSlug === 'minimalist' || templateSlug === 'clean';
  const isFuno =
    templateSlug === 'funo' ||
    templateSlug === 'demo' ||
    templateSlug === 'funie' ||
    templateSlug === 'nordic';
  const isPawzy = templateSlug === 'pawzy' || templateSlug === 'pets';
  const isMincom = templateSlug === 'mincom' || templateSlug === 'furniture' || templateSlug === 'modern';

  const variants = product.variants || [];
  const hasVariants = variants.length > 0;
  const [selectedVariantId, setSelectedVariantId] = useState<string>(variants[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isNotifyMeOpen, setIsNotifyMeOpen] = useState<boolean>(false);

  // Gallery image selection
  const allImages =
    product.images && product.images.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : [];
  const [selectedImage, setSelectedImage] = useState<string>(allImages[0] || '');

  // Reset state when product changes
  useEffect(() => {
    if (variants.length > 0) {
      const firstInStock = variants.find((v) => Number(v.inventory ?? 0) > 0);
      const chosen = firstInStock || variants[0];
      setSelectedVariantId(chosen.id);
      if (chosen.image) {
        setSelectedImage(chosen.image);
      } else if (allImages[0]) {
        setSelectedImage(allImages[0]);
      }
    } else {
      setSelectedImage(allImages[0] || '');
    }
    setQuantity(1);
  }, [product.id, variants]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const selectedVariant: ProductVariant | undefined = hasVariants
    ? variants.find((v) => v.id === selectedVariantId) || variants[0]
    : undefined;

  const activePrice =
    selectedVariant?.price != null ? Number(selectedVariant.price) : Number(product.price);
  const activeCompareAtPrice =
    selectedVariant?.compareAtPrice != null
      ? Number(selectedVariant.compareAtPrice)
      : product.compareAtPrice
        ? Number(product.compareAtPrice)
        : null;

  const stock = hasVariants
    ? selectedVariant?.inventory != null
      ? Number(selectedVariant.inventory)
      : 0
    : product.stockQuantity !== undefined
      ? Number(product.stockQuantity)
      : product.inventory !== undefined
        ? Number(product.inventory)
        : 1;

  const isOutOfStock = stock <= 0;
  const activeSku = selectedVariant?.sku || product.sku;
  const isWishlisted = isInWishlist(product.id);

  const discount =
    activeCompareAtPrice && activeCompareAtPrice > activePrice
      ? Math.round(((activeCompareAtPrice - activePrice) / activeCompareAtPrice) * 100)
      : 0;

  const productHref = product.urlSlug ? `/products/${product.urlSlug}` : `/products/${product.id}`;

  const handleAddToCart = async () => {
    if (isAdding || isOutOfStock) return;
    setIsAdding(true);
    try {
      await addToCart({
        productId: product.id,
        variantId: selectedVariant?.id,
        quantity: Math.min(quantity, Math.max(1, stock)),
        options: {
          variant: selectedVariant?.name,
        },
      });
      toast.success(
        `Added ${quantity}x "${selectedVariant?.name || product.name}" to cart.`,
        'Item Added',
      );
      onClose();
    } catch (err: any) {
      console.warn('Quick view add to cart failed:', err?.message || err);
      toast.error('Failed to add item to bag. Please try again.', 'Error');
    } finally {
      setIsAdding(false);
    }
  };

  // ─── Design Tokens ──────────────────────────────────────────────────────────
  const modalRadius = isMinimal
    ? 'rounded-none'
    : isLuxe
      ? 'rounded-sm'
      : isMincom
        ? 'rounded-2xl'
        : isNova
          ? 'rounded-[28px]'
          : isFuno
            ? 'rounded-[32px]'
            : 'rounded-3xl';

  const pillRadius = isMinimal || isLuxe ? 'rounded-none' : 'rounded-full';

  const galleryAspect = isLuxe ? 'aspect-[3/4]' : 'aspect-square';

  const titleClass = isLuxe
    ? 'font-serif text-2xl sm:text-3xl font-normal tracking-wide text-stone-900 dark:text-stone-100'
    : isNova
      ? 'font-sans text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f] dark:text-white'
      : isMinimal
        ? 'font-sans text-2xl sm:text-3xl font-extralight tracking-tight uppercase text-black dark:text-white'
        : isFuno
          ? 'font-sans text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white'
          : isMincom
            ? 'font-sans text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100'
            : 'font-sans text-2xl sm:text-3xl font-black tracking-tight text-[var(--sf-text)]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        className={`relative w-full max-w-4xl overflow-hidden shadow-2xl border transition-all z-10 flex flex-col my-auto max-h-[92vh] ${modalRadius}`}
        style={{
          backgroundColor: 'var(--sf-bg)',
          borderColor: 'color-mix(in srgb, var(--sf-text) 12%, transparent)',
          color: 'var(--sf-text)',
        }}
      >
        {/* Top Floating Close & Quick Badge Bar */}
        <div
          className="flex items-center justify-between px-5 py-3.5 border-b"
          style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 8%, transparent)' }}
        >
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${pillRadius}`}
              style={{
                backgroundColor: 'color-mix(in srgb, var(--sf-primary) 12%, transparent)',
                color: 'var(--sf-primary)',
              }}
            >
              {isNova
                ? '⚡ Pro Tech Quick Preview'
                : isLuxe
                  ? '✦ Atelier Exclusive Preview'
                  : isMinimal
                    ? '[ QUICK_SPEC_VIEW ]'
                    : isFuno
                      ? '💛 Quick Look'
                      : '⚡ Quick View'}
            </span>
            {product.categoryName && (
              <span
                className="text-xs font-semibold opacity-60 hidden sm:inline"
                style={{ color: 'var(--sf-text)' }}
              >
                • {product.categoryName}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Wishlist Button */}
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition hover:scale-110 cursor-pointer ${
                isWishlisted ? 'bg-rose-50 text-rose-500' : 'hover:bg-black/5 dark:hover:bg-white/5'
              }`}
              title={isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
            >
              {isWishlisted ? '❤️' : '🤍'}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable Content: 2-Column Grid */}
        <div className="overflow-y-auto p-5 sm:p-7 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* ── Column 1: Image Gallery & Thumbnails ────────────────────── */}
            <div className="md:col-span-6 space-y-3">
              <div
                className={`relative ${galleryAspect} overflow-hidden border ${modalRadius}`}
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--sf-text) 4%, var(--sf-bg))',
                  borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)',
                }}
              >
                {selectedImage ? (
                  <Image
                    src={selectedImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">
                    🛍️
                  </div>
                )}

                {/* Discount Badge */}
                {discount > 0 && (
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-black text-white shadow-md z-10 ${
                      isMinimal
                        ? 'rounded-none bg-black text-white font-mono'
                        : isLuxe
                          ? 'rounded-none bg-stone-900 uppercase tracking-widest text-[10px]'
                          : pillRadius
                    }`}
                    style={isMinimal || isLuxe ? undefined : { backgroundColor: 'var(--sf-accent, #e11d48)' }}
                  >
                    -{discount}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails Strip */}
              {allImages.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
                  {allImages.map((img, idx) => {
                    const isSelected = selectedImage === img;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImage(img)}
                        className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition cursor-pointer ${
                          isSelected ? 'shadow-md scale-95 opacity-100' : 'opacity-60 hover:opacity-100'
                        }`}
                        style={{
                          borderColor: isSelected
                            ? 'var(--sf-primary)'
                            : 'color-mix(in srgb, var(--sf-text) 15%, transparent)',
                        }}
                      >
                        <Image
                          src={img}
                          alt={`${product.name} preview ${idx + 1}`}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Column 2: Details & Interactive Actions ──────────────────── */}
            <div className="md:col-span-6 space-y-4">
              {/* Brand & Title */}
              <div>
                {product.brandName && (
                  <span
                    className="text-xs font-bold uppercase tracking-widest block mb-1"
                    style={{ color: 'var(--sf-primary)' }}
                  >
                    {product.brandName}
                  </span>
                )}
                <h2 className={titleClass}>{product.name}</h2>

                {/* Rating & Stock Status */}
                <div className="flex flex-wrap items-center gap-2.5 mt-2 text-xs">
                  <div className="flex text-amber-400">
                    {'★★★★★'}
                  </div>
                  <span className="font-semibold opacity-70">
                    4.9 (Verified)
                  </span>
                  <span>•</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full ${
                      isOutOfStock
                        ? 'bg-rose-500/15 text-rose-600'
                        : stock <= 5
                          ? 'bg-amber-500/15 text-amber-600'
                          : 'bg-emerald-500/15 text-emerald-600'
                    }`}
                  >
                    {isOutOfStock
                      ? 'Out of Stock'
                      : stock <= 5
                        ? `Only ${stock} left`
                        : `✓ In Stock (${stock})`}
                  </span>
                </div>
              </div>

              {/* Price Row */}
              <div
                className="flex items-baseline gap-3 pb-3 border-b"
                style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 8%, transparent)' }}
              >
                <span
                  className={`text-2xl sm:text-3xl font-black font-mono`}
                  style={{ color: 'var(--sf-primary)' }}
                >
                  {formatPrice(activePrice)}
                </span>
                {activeCompareAtPrice && activeCompareAtPrice > activePrice && (
                  <span className="text-sm line-through opacity-50 font-mono">
                    {formatPrice(activeCompareAtPrice)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="text-xs font-bold text-rose-600">
                    Save {formatPrice(activeCompareAtPrice! - activePrice)}
                  </span>
                )}
              </div>

              {/* Short Description */}
              {product.description && (
                <div
                  className="text-xs sm:text-sm leading-relaxed line-clamp-3 opacity-80
                    [&_p]:inline [&_ul]:inline [&_ol]:inline [&_li]:inline [&_li]:after:content-['_']
                    [&_h1]:inline [&_h2]:inline [&_h3]:inline [&_br]:hidden [&_strong]:font-semibold"
                  style={{ color: 'var(--sf-text)' }}
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              )}

              {/* Variant Selector */}
              {hasVariants && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold uppercase tracking-wider opacity-70">
                      {isLuxe
                        ? 'Select Edition'
                        : isNova
                          ? 'Hardware Configuration'
                          : isMinimal
                            ? 'EDITION_OPTIONS'
                            : 'Select Variant'}
                    </span>
                    {activeSku && (
                      <span className="font-mono opacity-60 text-[11px]">SKU: {activeSku}</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                    {variants.map((v) => {
                      const isSelected = selectedVariantId === v.id;
                      const vStock = Number(v.inventory ?? 0);
                      const isVOut = vStock <= 0;

                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => {
                            setSelectedVariantId(v.id);
                            if (v.image) setSelectedImage(v.image);
                          }}
                          className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between gap-2 cursor-pointer ${
                            isSelected ? 'ring-2 shadow-xs' : 'hover:opacity-90'
                          } ${isVOut ? 'opacity-50' : ''}`}
                          style={{
                            backgroundColor: isSelected
                              ? 'color-mix(in srgb, var(--sf-primary) 8%, var(--sf-bg))'
                              : 'color-mix(in srgb, var(--sf-text) 2%, var(--sf-bg))',
                            borderColor: isSelected
                              ? 'var(--sf-primary)'
                              : 'color-mix(in srgb, var(--sf-text) 12%, transparent)',
                          }}
                        >
                          <div className="min-w-0">
                            <div className="text-xs font-bold truncate">{v.name}</div>
                            <div className="text-[11px] font-mono opacity-70">{formatPrice(v.price)}</div>
                          </div>
                          <div className="flex-shrink-0 text-[10px] font-bold">
                            {isVOut ? (
                              <span className="text-rose-500">Sold Out</span>
                            ) : isSelected ? (
                              <span style={{ color: 'var(--sf-primary)' }}>✓</span>
                            ) : (
                              <span className="opacity-50">{vStock} left</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Add to Bag Actions */}
              <div className="space-y-3 pt-1">
                {isOutOfStock ? (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setIsNotifyMeOpen(true)}
                      className={`w-full py-3.5 px-4 font-bold text-xs text-white shadow-lg transition flex items-center justify-center gap-2 cursor-pointer bg-amber-600 hover:bg-amber-700 ${modalRadius}`}
                    >
                      <span>🔔</span>
                      <span>Notify Me When Back in Stock</span>
                    </button>
                    <p className="text-center text-[11px] text-rose-500 font-medium">
                      This item is currently out of stock. Get alerted instantly.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    {/* Quantity Stepper */}
                    <div
                      className={`flex items-center p-1 border ${modalRadius}`}
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--sf-text) 4%, var(--sf-bg))',
                        borderColor: 'color-mix(in srgb, var(--sf-text) 14%, transparent)',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center font-bold text-sm transition hover:opacity-70 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-mono font-bold text-xs">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                        disabled={quantity >= stock}
                        className="w-8 h-8 flex items-center justify-center font-bold text-sm transition hover:opacity-70 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {/* Add to Bag CTA */}
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={isAdding || isOutOfStock}
                      className={`flex-1 py-3.5 px-4 font-bold text-xs text-white shadow-xl transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer ${
                        isLuxe
                          ? 'rounded-none uppercase tracking-[0.2em] bg-stone-950 hover:bg-stone-800'
                          : isMinimal
                            ? 'rounded-none uppercase tracking-widest bg-black dark:bg-white text-white dark:text-black'
                            : isNova
                              ? 'rounded-full bg-[#0071e3] hover:bg-[#0077ed]'
                              : isFuno
                                ? 'rounded-full bg-slate-950 hover:bg-orange-600'
                                : modalRadius
                      }`}
                      style={
                        isLuxe || isMinimal || isNova || isFuno
                          ? undefined
                          : { backgroundColor: 'var(--sf-primary)' }
                      }
                    >
                      {isAdding ? (
                        <span>Adding to Bag…</span>
                      ) : (
                        <>
                          <span>Add to Shopping Bag</span>
                          <span>•</span>
                          <span className="font-mono">{formatPrice(activePrice * quantity)}</span>
                          <span>🛍️</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* View Full Page Link */}
                <div className="text-center pt-1">
                  <Link
                    href={productHref}
                    onClick={onClose}
                    className="text-xs font-bold hover:underline opacity-80 hover:opacity-100 transition inline-flex items-center gap-1"
                    style={{ color: 'var(--sf-primary)' }}
                  >
                    <span>View full product specifications & customer reviews</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              {/* Trust Badge Bar */}
              <div
                className={`p-3 grid grid-cols-3 gap-1.5 text-center text-[10px] border ${modalRadius}`}
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--sf-text) 2.5%, var(--sf-bg))',
                  borderColor: 'color-mix(in srgb, var(--sf-text) 8%, transparent)',
                }}
              >
                <div>
                  <span className="block text-sm mb-0.5">🚚</span>
                  <span className="font-bold block">Free Shipping</span>
                  <span className="opacity-60">Orders over ₹999</span>
                </div>
                <div>
                  <span className="block text-sm mb-0.5">🔒</span>
                  <span className="font-bold block">Secure Pay</span>
                  <span className="opacity-60">Encrypted</span>
                </div>
                <div>
                  <span className="block text-sm mb-0.5">🔄</span>
                  <span className="font-bold block">Easy Returns</span>
                  <span className="opacity-60">7-Day Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notify Me Modal Integration */}
      {isNotifyMeOpen && (
        <NotifyMeModal
          isOpen={isNotifyMeOpen}
          onClose={() => setIsNotifyMeOpen(false)}
          product={product}
          variant={selectedVariant ? {
            id: selectedVariant.id,
            name: selectedVariant.name,
            sku: selectedVariant.sku,
            price: selectedVariant.price,
          } : null}
          activeTemplate={templateSlug}
        />
      )}
    </div>
  );
}
