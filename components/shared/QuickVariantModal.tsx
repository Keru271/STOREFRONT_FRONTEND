'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product, ProductVariant } from '@/lib/api/types';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/hooks/useCurrency';
import { useToast } from '@/hooks/useToast';

export interface QuickVariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export default function QuickVariantModal({ isOpen, onClose, product }: QuickVariantModalProps) {
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const toast = useToast();

  const variants = product.variants || [];
  const [selectedVariantId, setSelectedVariantId] = useState<string>(variants[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // Sync selected variant when product changes
  useEffect(() => {
    if (variants.length > 0) {
      // Pick first in-stock variant if available
      const firstInStock = variants.find((v) => Number(v.inventory ?? 0) > 0);
      setSelectedVariantId(firstInStock ? firstInStock.id : variants[0].id);
      setQuantity(1);
    }
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

  const selectedVariant: ProductVariant | undefined =
    variants.find((v) => v.id === selectedVariantId) || variants[0];

  const activePrice = selectedVariant?.price != null ? Number(selectedVariant.price) : Number(product.price);
  const activeCompareAtPrice = selectedVariant?.compareAtPrice != null
    ? Number(selectedVariant.compareAtPrice)
    : product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const stock = selectedVariant?.inventory != null
    ? Number(selectedVariant.inventory)
    : (product.stockQuantity !== undefined ? Number(product.stockQuantity) : product.inventory !== undefined ? Number(product.inventory) : 1);
  const isOutOfStock = stock <= 0;
  const activeSku = selectedVariant?.sku || product.sku;

  const discount = activeCompareAtPrice && activeCompareAtPrice > activePrice
    ? Math.round(((activeCompareAtPrice - activePrice) / activeCompareAtPrice) * 100)
    : 0;

  const displayImage = selectedVariant?.image || product.image || (product.images && product.images[0]);
  const productHref = `/products/${product.urlSlug || product.id}`;

  const handleAdd = async () => {
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
        `Added ${quantity}x "${selectedVariant?.name || product.name}" to your shopping bag.`,
        'Option Added'
      );
      onClose();
    } catch (err: any) {
      console.warn('Quick variant add failed:', err?.message || err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border transition-all z-10 flex flex-col max-h-[90vh]"
        style={{
          backgroundColor: 'var(--sf-bg)',
          borderColor: 'color-mix(in srgb, var(--sf-text) 12%, transparent)',
          color: 'var(--sf-text)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 sm:p-5 border-b"
          style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 8%, transparent)' }}
        >
          <div className="min-w-0 pr-4">
            <span
              className="text-[10px] font-black uppercase tracking-widest block"
              style={{ color: 'var(--sf-primary)' }}
            >
              Select Product Option
            </span>
            <h3 className="text-base font-bold truncate mt-0.5" style={{ color: 'var(--sf-text)' }}>
              {product.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition hover:bg-black/10 dark:hover:bg-white/10 flex-shrink-0 cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Top Product & Variant Summary */}
          <div className="flex gap-4 items-center">
            <div
              className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden flex-shrink-0 border"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--sf-text) 3%, var(--sf-bg))',
                borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)',
              }}
            >
              {displayImage ? (
                <Image
                  src={displayImage}
                  alt={product.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl opacity-40">
                  🛍️
                </div>
              )}
            </div>

            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold font-mono" style={{ color: 'var(--sf-primary)' }}>
                  {formatPrice(activePrice)}
                </span>
                {activeCompareAtPrice && activeCompareAtPrice > activePrice && (
                  <span className="text-xs line-through opacity-50 font-mono">
                    {formatPrice(activeCompareAtPrice)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-rose-500 text-white shadow-xs">
                    -{discount}%
                  </span>
                )}
              </div>

              {selectedVariant && (
                <p className="text-xs font-semibold" style={{ color: 'var(--sf-text)' }}>
                  Selected: <span className="underline">{selectedVariant.name}</span>
                </p>
              )}

              <div className="flex items-center gap-3 text-xs">
                {activeSku && (
                  <span className="font-mono opacity-60 text-[11px]">
                    SKU: {activeSku}
                  </span>
                )}
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isOutOfStock
                      ? 'bg-rose-500/15 text-rose-600'
                      : stock <= 5
                      ? 'bg-amber-500/15 text-amber-600'
                      : 'bg-emerald-500/15 text-emerald-600'
                  }`}
                >
                  {isOutOfStock ? 'Sold Out' : stock <= 5 ? `Only ${stock} left` : `✓ In Stock (${stock})`}
                </span>
              </div>
            </div>
          </div>

          {/* Variant Selection Pill Matrix */}
          {variants.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider opacity-70">
                  Available Editions / Options ({variants.length})
                </label>
                <span className="text-[11px] opacity-60">Select to update price</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                        if (quantity > Math.max(1, vStock)) {
                          setQuantity(Math.max(1, vStock));
                        }
                      }}
                      className={`p-3 rounded-2xl border text-left transition flex items-center justify-between gap-2 cursor-pointer ${
                        isSelected
                          ? 'ring-2 shadow-sm'
                          : 'hover:border-primary/40'
                      } ${isVOut ? 'opacity-55' : ''}`}
                      style={{
                        backgroundColor: isSelected
                          ? 'color-mix(in srgb, var(--sf-primary) 8%, var(--sf-bg))'
                          : 'color-mix(in srgb, var(--sf-text) 2%, var(--sf-bg))',
                        borderColor: isSelected
                          ? 'var(--sf-primary)'
                          : 'color-mix(in srgb, var(--sf-text) 12%, transparent)',
                        outlineColor: isSelected ? 'var(--sf-primary)' : 'transparent',
                      }}
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate" style={{ color: 'var(--sf-text)' }}>
                          {v.name}
                        </div>
                        <div className="text-[11px] font-mono mt-0.5 opacity-70">
                          {formatPrice(v.price)}
                        </div>
                      </div>

                      <div className="flex-shrink-0 text-right">
                        {isVOut ? (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-500">
                            Sold Out
                          </span>
                        ) : isSelected ? (
                          <span className="text-sm font-black" style={{ color: 'var(--sf-primary)' }}>
                            ✓
                          </span>
                        ) : (
                          <span className="text-[10px] opacity-60">
                            {vStock} in stock
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Controls */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-bold uppercase tracking-wider opacity-70">
              Quantity
            </span>

            <div
              className="flex items-center rounded-2xl p-1 border"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--sf-text) 4%, var(--sf-bg))',
                borderColor: 'color-mix(in srgb, var(--sf-text) 15%, transparent)',
              }}
            >
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={isOutOfStock || quantity <= 1}
                className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm transition hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                -
              </button>
              <span className="w-10 text-center font-mono font-bold text-sm">
                {isOutOfStock ? 0 : quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                disabled={isOutOfStock || quantity >= stock}
                className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm transition hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          className="p-4 sm:p-5 border-t space-y-2.5"
          style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 8%, transparent)' }}
        >
          <button
            type="button"
            onClick={handleAdd}
            disabled={isAdding || isOutOfStock}
            className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm text-white shadow-lg transition hover:opacity-90 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            style={{
              backgroundColor: isOutOfStock ? '#64748b' : 'var(--sf-primary)',
            }}
          >
            {isAdding ? (
              <span>Adding to bag...</span>
            ) : isOutOfStock ? (
              <span>Variant Sold Out</span>
            ) : (
              <>
                <span>Add to Shopping Bag</span>
                <span>•</span>
                <span className="font-mono">{formatPrice(activePrice * quantity)}</span>
                <span>🛍️</span>
              </>
            )}
          </button>

          <div className="text-center">
            <Link
              href={productHref}
              onClick={onClose}
              className="text-xs font-semibold hover:underline opacity-70 hover:opacity-100 transition"
              style={{ color: 'var(--sf-text)' }}
            >
              View Full Product Page & Details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
