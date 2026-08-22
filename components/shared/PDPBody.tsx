'use client';

// ─── Shared PDP Logic Component ───────────────────────────────────────────────
// Contains ALL product detail commerce logic: gallery, variants, cart, wishlist,
// reviews (lazy-loaded), related products.
//
// This is NOT a page — it's the inner content body.
// Each template wraps this with its own Header, Footer, and ProductCard.
// Only the layout shell (wrapper div, Header, Footer) differs per template.

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import type { ThemeConfig, ProductDetail, Product, ProductReview } from '@/lib/api/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/hooks/useCurrency';
import { useToast } from '@/hooks/useToast';
import { getProductReviews, postProductReview, editProductReview, upvoteProductReview } from '@/lib/api';

const ReviewModal = dynamic(() => import('./ReviewModal'), { ssr: false });

export interface PDPBodyProps {
  theme: ThemeConfig;
  product: ProductDetail;
  relatedProducts: Product[];
  /** Render the related product cards — each template passes its own ProductCard */
  renderRelatedCard: (product: Product) => React.ReactNode;
}

export function PDPBody({ theme: _theme, product, relatedProducts, renderRelatedCard }: PDPBodyProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const toast = useToast();

  const allImages = product.images.length > 0 ? product.images : (product.image ? [product.image] : []);
  const [selectedImage, setSelectedImage] = useState<string>(allImages[0] || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizeOptions && product.sizeOptions.length > 0 ? product.sizeOptions[0] : ''
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colorOptions && product.colorOptions.length > 0 ? product.colorOptions[0] : ''
  );
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants && product.variants.length > 0 ? product.variants[0].id : ''
  );
  const [isAdding, setIsAdding] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');

  // Review state
  const [reviewsList, setReviewsList] = useState<ProductReview[]>(product.reviews || []);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);
  const hasFetchedReviewsRef = useRef(false);
  const [reviewForm, setReviewForm] = useState({ userName: '', userEmail: '', rating: 5, title: '', comment: '' });
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (activeTab === 'reviews' && !hasFetchedReviewsRef.current) {
      hasFetchedReviewsRef.current = true;
      setIsReviewsLoading(true);
      getProductReviews(product.id || product.urlSlug || '')
        .then((data) => { if (data?.reviews) setReviewsList(data.reviews); })
        .catch(() => {})
        .finally(() => setIsReviewsLoading(false));
    }
  }, [activeTab, product.id, product.urlSlug]);

  const isWishlisted = isInWishlist(product.id);
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const totalReviewsCount = reviewsList.length;
  const avgRating = totalReviewsCount > 0
    ? Number((reviewsList.reduce((acc, r) => acc + r.rating, 0) / totalReviewsCount).toFixed(1))
    : 5.0;

  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviewsList.forEach((r) => { if (r.rating >= 1 && r.rating <= 5) (starCounts as Record<number, number>)[r.rating]++; });

  const handleAddToCart = async () => {
    if (isAdding || product.stockQuantity === 0) return;
    setIsAdding(true);
    try {
      await addToCart({
        productId: product.id,
        variantId: selectedVariantId || undefined,
        quantity,
        options: {
          size: selectedSize || undefined,
          color: selectedColor || undefined,
        },
      });
    } catch {
      toast.error('Failed to add product to cart. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleSubmitReview = async (form: {
    userName: string;
    userEmail: string;
    rating: number;
    title: string;
    comment: string;
  }) => {
    if (!form.userName.trim() || !form.comment.trim()) return;
    setIsSubmittingReview(true);
    try {
      if (editingReviewId) {
        const res = await editProductReview(product.id, editingReviewId, {
          userName: form.userName,
          rating: form.rating,
          title: form.title,
          comment: form.comment,
        });
        setReviewsList((prev) => prev.map((r) => (r.id === editingReviewId ? { ...r, ...res.review } : r)));
        toast.success('Your product review has been updated.', 'Review Updated');
      } else {
        const res = await postProductReview(product.id, {
          userName: form.userName,
          userEmail: form.userEmail || undefined,
          rating: form.rating,
          title: form.title || undefined,
          comment: form.comment,
        });
        setReviewsList((prev) => [res.review, ...prev]);
        toast.success('Thank you for sharing your feedback!', 'Review Submitted');
      }
      setIsReviewModalOpen(false);
      setEditingReviewId(null);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || 'Failed to submit review';
      toast.error(msg, 'Review Failed');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleHelpfulUpvote = async (revId: string) => {
    try {
      const res = await upvoteProductReview(product.id, revId);
      setReviewsList((prev) => prev.map((r) => (r.id === revId ? { ...r, helpfulCount: res.helpfulCount } : r)));
    } catch { /* silent */ }
  };

  const openWriteReview = () => {
    setEditingReviewId(null);
    setReviewForm({ userName: '', userEmail: '', rating: 5, title: '', comment: '' });
    setIsReviewModalOpen(true);
  };

  const openEditReview = (rev: ProductReview) => {
    setEditingReviewId(rev.id);
    setReviewForm({ userName: rev.userName || rev.customerName || '', userEmail: rev.userEmail || '', rating: rev.rating, title: rev.title || '', comment: rev.comment || '' });
    setIsReviewModalOpen(true);
  };

  return (
    <>
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fadeIn border border-gray-700">
          <span>{toastMessage}</span>
          <Link href="/cart" className="text-xs font-bold underline" style={{ color: 'var(--sf-accent)' }}>View Cart</Link>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full text-xs flex items-center gap-2" style={{ color: 'color-mix(in srgb, var(--sf-text) 45%, transparent)' }}>
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:underline">Products</Link>
        {product.categoryName && (
          <>
            <span>/</span>
            <Link href={`/products?category=${encodeURIComponent(product.categoryName)}`} className="hover:underline">{product.categoryName}</Link>
          </>
        )}
        <span>/</span>
        <span className="truncate max-w-xs" style={{ color: 'var(--sf-text)' }}>{product.name}</span>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">

        {/* ── Product Hero Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          {/* Gallery */}
          <div className="space-y-4">
            <div
              className="aspect-square rounded-3xl overflow-hidden relative shadow-inner"
              style={{ backgroundColor: 'color-mix(in srgb, var(--sf-text) 5%, var(--sf-bg))' }}
            >
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">📦</div>
              )}
              {discount > 0 && (
                <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-black text-white shadow-lg z-10" style={{ backgroundColor: 'var(--sf-accent)' }}>
                  -{discount}% OFF
                </span>
              )}
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full backdrop-blur shadow-md flex items-center justify-center text-lg transition hover:scale-110 z-10"
                style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}
              >
                {isWishlisted ? '❤️' : '🤍'}
              </button>
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 relative transition ${
                      selectedImage === img ? 'shadow-md' : 'opacity-60 hover:opacity-100'
                    }`}
                    style={{ borderColor: selectedImage === img ? 'var(--sf-primary)' : 'transparent' }}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Actions */}
          <div className="space-y-6">
            <div>
              {product.brandName && (
                <span className="text-xs font-bold uppercase tracking-widest block mb-1" style={{ color: 'var(--sf-primary)' }}>
                  {product.brandName}
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: 'var(--sf-text)' }}>
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex text-sm" style={{ color: 'var(--sf-accent)' }}>
                  {[1,2,3,4,5].map((s) => <span key={s}>{s <= Math.round(avgRating) ? '★' : '☆'}</span>)}
                </div>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-xs font-bold hover:underline"
                  style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}
                >
                  {avgRating} ({totalReviewsCount} {totalReviewsCount === 1 ? 'review' : 'reviews'})
                </button>
                <span style={{ color: 'color-mix(in srgb, var(--sf-text) 20%, transparent)' }}>•</span>
                <span className="text-xs font-semibold text-emerald-600">✓ In Stock</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 pb-6 border-b" style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}>
              <span className="text-3xl font-black" style={{ color: 'var(--sf-primary)' }}>
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-lg line-through" style={{ color: 'color-mix(in srgb, var(--sf-text) 35%, transparent)' }}>
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            {/* Size Options */}
            {product.sizeOptions && product.sizeOptions.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}>
                  Size: <span style={{ color: 'var(--sf-text)' }}>{selectedSize}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.sizeOptions.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className="px-4 py-2 rounded-xl text-xs font-bold border transition"
                      style={{
                        backgroundColor: selectedSize === size ? 'var(--sf-primary)' : 'transparent',
                        color: selectedSize === size ? 'white' : 'var(--sf-text)',
                        borderColor: selectedSize === size ? 'var(--sf-primary)' : 'color-mix(in srgb, var(--sf-text) 20%, transparent)',
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Options */}
            {product.colorOptions && product.colorOptions.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}>
                  Color: <span style={{ color: 'var(--sf-text)' }}>{selectedColor}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className="px-4 py-2 rounded-xl text-xs font-bold border transition"
                      style={{
                        backgroundColor: selectedColor === color ? 'var(--sf-primary)' : 'transparent',
                        color: selectedColor === color ? 'white' : 'var(--sf-text)',
                        borderColor: selectedColor === color ? 'var(--sf-primary)' : 'color-mix(in srgb, var(--sf-text) 20%, transparent)',
                      }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Variant selector */}
            {product.variants && product.variants.length > 1 && (
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}>Variant</span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantId(v.id)}
                      className="px-4 py-2 rounded-xl text-xs font-bold border transition"
                      style={{
                        backgroundColor: selectedVariantId === v.id ? 'var(--sf-primary)' : 'transparent',
                        color: selectedVariantId === v.id ? 'white' : 'var(--sf-text)',
                        borderColor: selectedVariantId === v.id ? 'var(--sf-primary)' : 'color-mix(in srgb, var(--sf-text) 20%, transparent)',
                      }}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty + Add to Cart */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <div
                  className="flex items-center rounded-2xl p-1"
                  style={{ border: '1.5px solid color-mix(in srgb, var(--sf-text) 15%, transparent)', backgroundColor: 'color-mix(in srgb, var(--sf-text) 4%, var(--sf-bg))' }}
                >
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center font-bold text-sm rounded-xl transition hover:opacity-70"
                    style={{ color: 'var(--sf-text)' }}
                  >-</button>
                  <span className="w-10 text-center font-bold text-sm" style={{ color: 'var(--sf-text)' }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-9 h-9 flex items-center justify-center font-bold text-sm rounded-xl transition hover:opacity-70"
                    style={{ color: 'var(--sf-text)' }}
                  >+</button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || product.stockQuantity === 0}
                  className="flex-1 py-4 rounded-2xl font-bold text-sm text-white shadow-xl transition hover:opacity-90 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ backgroundColor: 'var(--sf-primary)' }}
                >
                  {isAdding ? 'Adding…' : product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Bag'} 🛍️
                </button>
              </div>
              <Link
                href="/checkout"
                onClick={handleAddToCart}
                className="w-full py-3.5 rounded-2xl font-bold text-sm text-center border-2 transition block"
                style={{ borderColor: 'var(--sf-primary)', color: 'var(--sf-primary)' }}
              >
                Express Checkout →
              </Link>
            </div>

            {/* Trust strip */}
            <div
              className="p-4 rounded-2xl grid grid-cols-3 gap-2 text-center text-[11px]"
              style={{ backgroundColor: 'color-mix(in srgb, var(--sf-text) 4%, var(--sf-bg))', border: '1px solid color-mix(in srgb, var(--sf-text) 8%, transparent)' }}
            >
              {[
                { icon: '🚚', label: 'Free Shipping', sub: 'On orders ₹999+' },
                { icon: '🔄', label: 'Easy Returns',  sub: '7-Day Guarantee' },
                { icon: '🔒', label: 'Safe Payment',  sub: 'Razorpay & Stripe' },
              ].map((t) => (
                <div key={t.label}>
                  <span className="block text-base mb-0.5">{t.icon}</span>
                  <span className="font-bold block" style={{ color: 'var(--sf-text)' }}>{t.label}</span>
                  <span style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>{t.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs ──────────────────────────────────────────────────────── */}
        <div className="mt-16 pt-10 border-t" style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}>
          <div className="flex gap-8 border-b mb-8" style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}>
            {(['description', 'specs', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="pb-4 text-sm font-bold tracking-wide transition-all border-b-2"
                style={{
                  borderColor: activeTab === tab ? 'var(--sf-primary)' : 'transparent',
                  color: activeTab === tab ? 'var(--sf-primary)' : 'color-mix(in srgb, var(--sf-text) 40%, transparent)',
                }}
              >
                {tab === 'description' ? 'Description' : tab === 'specs' ? 'Specifications' : (
                  <span className="flex items-center gap-2">
                    Customer Reviews
                    <span className="px-2 py-0.5 rounded-full text-xs font-extrabold" style={{ backgroundColor: 'color-mix(in srgb, var(--sf-text) 8%, var(--sf-bg))' }}>{totalReviewsCount}</span>
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="max-w-4xl text-sm leading-relaxed" style={{ color: 'color-mix(in srgb, var(--sf-text) 70%, transparent)' }}>
            {activeTab === 'description' && (
              <div className="space-y-4">
                <p style={{ color: 'var(--sf-text)' }}>{product.description || 'No detailed description available.'}</p>
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4">
                    {product.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'color-mix(in srgb, var(--sf-text) 8%, var(--sf-bg))', color: 'color-mix(in srgb, var(--sf-text) 55%, transparent)' }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="divide-y" style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 8%, transparent)' }}>
                {[
                  { label: 'Category', value: product.categoryName || 'General' },
                  { label: 'Brand',    value: product.brandName    || 'Store Brand' },
                  { label: 'SKU',      value: product.sku || product.id },
                  ...(product.material ? [{ label: 'Material', value: product.material }] : []),
                  ...(product.weight   ? [{ label: 'Weight',   value: `${product.weight} kg` }] : []),
                  ...(product.dimensions ? [{ label: 'Dimensions', value: product.dimensions }] : []),
                ].map((row) => (
                  <div key={row.label} className="py-3 flex justify-between">
                    <span className="font-semibold" style={{ color: 'var(--sf-text)' }}>{row.label}</span>
                    <span>{row.value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Rating breakdown */}
                <div
                  className="p-6 rounded-3xl border grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--sf-text) 3%, var(--sf-bg))', borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}
                >
                  <div className="md:col-span-4 text-center md:text-left space-y-1">
                    <span className="text-5xl font-black" style={{ color: 'var(--sf-text)' }}>{avgRating}</span>
                    <div className="flex justify-center md:justify-start text-base" style={{ color: 'var(--sf-accent)' }}>
                      {[1,2,3,4,5].map((s) => <span key={s}>{s <= Math.round(avgRating) ? '★' : '☆'}</span>)}
                    </div>
                    <p className="text-xs" style={{ color: 'color-mix(in srgb, var(--sf-text) 45%, transparent)' }}>Based on {totalReviewsCount} verified reviews</p>
                  </div>
                  <div className="md:col-span-5 space-y-1.5 text-xs">
                    {[5,4,3,2,1].map((stars) => {
                      const count = (starCounts as Record<number, number>)[stars] || 0;
                      const pct = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;
                      return (
                        <div key={stars} className="flex items-center gap-2">
                          <span className="w-8 text-right font-bold" style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}>{stars}★</span>
                          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'color-mix(in srgb, var(--sf-text) 12%, transparent)' }}>
                            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: 'var(--sf-accent)' }} />
                          </div>
                          <span className="w-6 font-mono text-[10px]" style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>{count}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="md:col-span-3 text-center md:text-right">
                    <button
                      onClick={openWriteReview}
                      className="w-full sm:w-auto px-5 py-3 rounded-2xl font-bold text-xs text-white shadow-lg transition hover:opacity-90"
                      style={{ backgroundColor: 'var(--sf-primary)' }}
                    >
                      ✏️ Write a Review
                    </button>
                  </div>
                </div>

                {/* Reviews list */}
                <div className="space-y-4">
                  {isReviewsLoading ? (
                    <div className="p-12 text-center rounded-3xl border" style={{ backgroundColor: 'color-mix(in srgb, var(--sf-text) 3%, var(--sf-bg))', borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}>
                      <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-2" style={{ borderColor: 'var(--sf-primary)', borderTopColor: 'transparent' }} />
                      <p className="text-xs font-semibold">Loading reviews…</p>
                    </div>
                  ) : reviewsList.length > 0 ? reviewsList.map((rev) => (
                    <div key={rev.id} className="p-6 rounded-3xl border space-y-3" style={{ backgroundColor: 'var(--sf-bg)', borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm" style={{ color: 'var(--sf-text)' }}>{rev.userName || rev.customerName || 'Verified Customer'}</span>
                            {rev.verified !== false && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold text-emerald-700 border border-emerald-200" style={{ backgroundColor: '#f0fdf4' }}>✓ Verified</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs" style={{ color: 'var(--sf-accent)' }}>{'★'.repeat(rev.rating)}{'☆'.repeat(Math.max(0, 5 - rev.rating))}</span>
                            <span className="text-[11px]" style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>
                              {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEditReview(rev)} className="text-xs font-semibold px-2.5 py-1 rounded-xl transition hover:opacity-70" style={{ backgroundColor: 'color-mix(in srgb, var(--sf-text) 6%, var(--sf-bg))', color: 'color-mix(in srgb, var(--sf-text) 55%, transparent)' }}>✏️ Edit</button>
                          <button onClick={() => handleHelpfulUpvote(rev.id)} className="text-xs font-semibold px-2.5 py-1 rounded-xl flex items-center gap-1 transition hover:opacity-70" style={{ backgroundColor: 'color-mix(in srgb, var(--sf-text) 6%, var(--sf-bg))', color: 'color-mix(in srgb, var(--sf-text) 55%, transparent)' }}>👍 {rev.helpfulCount || 0}</button>
                        </div>
                      </div>
                      {rev.title && <h4 className="font-bold text-sm" style={{ color: 'var(--sf-text)' }}>{rev.title}</h4>}
                      <p className="text-xs leading-relaxed">{rev.comment}</p>
                      {rev.adminReply && (
                        <div className="mt-3 p-3.5 rounded-2xl border space-y-1" style={{ backgroundColor: 'color-mix(in srgb, var(--sf-primary) 5%, var(--sf-bg))', borderColor: 'color-mix(in srgb, var(--sf-primary) 20%, transparent)' }}>
                          <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--sf-primary)' }}>💬 Store Response</div>
                          <p className="text-xs leading-relaxed">{rev.adminReply}</p>
                        </div>
                      )}
                    </div>
                  )) : (
                    <div className="p-12 text-center rounded-3xl border" style={{ backgroundColor: 'color-mix(in srgb, var(--sf-text) 3%, var(--sf-bg))', borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}>
                      <span className="text-3xl block mb-2">⭐</span>
                      <p className="font-bold text-sm mb-1" style={{ color: 'var(--sf-text)' }}>No reviews yet</p>
                      <p className="text-xs mb-4" style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>Be the first to share your experience!</p>
                      <button onClick={openWriteReview} className="px-5 py-2.5 rounded-2xl text-xs font-bold text-white shadow" style={{ backgroundColor: 'var(--sf-primary)' }}>Write First Review</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Related Products ──────────────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--sf-text)' }}>You May Also Like</h2>
              <Link href="/products" className="text-sm font-semibold hover:underline" style={{ color: 'var(--sf-primary)' }}>View All →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => renderRelatedCard(p))}
            </div>
          </div>
        )}
      </main>

      {/* Review Modal (Loaded dynamically on demand) */}
      {isReviewModalOpen && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          productName={product.name}
          editingReviewId={editingReviewId}
          initialForm={reviewForm}
          onSubmit={handleSubmitReview}
          isSubmitting={isSubmittingReview}
        />
      )}
    </>
  );
}
