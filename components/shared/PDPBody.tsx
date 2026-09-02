'use client';

// ─── Shared PDP Logic & Template Adaptive Component ───────────────────────────
// Adapts its layout, typography, borders, badges, gallery, CTAs, and perks
// according to the active template design:
//   - 'nova': Apple-inspired tech hardware showcase, floating stage, sleek pill CTAs, pro spec grid.
//   - 'luxe': Haute Couture editorial, serif typography, gold accents, portrait gallery, atelier craftsmanship.
//   - 'minimal': Scandinavian Bauhaus monochrome, razor-sharp edges, stark whitespace, monospace spec matrix.
//   - 'funo': Playful Nordic living, soft rounded curves, warm friendly badges, bubbly pill CTAs.
//   - 'mincom': High-density commercial studio, structured catalog grid, deal countdown, dual CTA row.
//   - 'default': Balanced, modern eCommerce layout.

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import type { ThemeConfig, ProductDetail, Product, ProductReview, EligibleCoupon } from '@/lib/api/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/hooks/useCurrency';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';
import { getProductReviews, postProductReview, editProductReview, deleteProductReview, upvoteProductReview, getProductEligibleCoupons } from '@/lib/api';

const ReviewModal = dynamic(() => import('./ReviewModal'), { ssr: false });

export interface PDPBodyProps {
  theme: ThemeConfig;
  product: ProductDetail;
  relatedProducts: Product[];
  /** Render the related product cards — each template passes its own ProductCard */
  renderRelatedCard: (product: Product) => React.ReactNode;
}

export function PDPBody({ theme, product, relatedProducts, renderRelatedCard }: PDPBodyProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const toast = useToast();
  const { customer, isAuthenticated } = useAuth();

  // Active template detection
  const activeTemplate = (theme?.activeTemplateSlug || 'default').toLowerCase();
  const isNova = activeTemplate === 'nova';
  const isLuxe = activeTemplate === 'luxe';
  const isMinimal = activeTemplate === 'minimal';
  const isFuno = activeTemplate === 'funo';
  const isMincom = activeTemplate === 'mincom';

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
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  const hasFetchedReviewsRef = useRef(false);
  const [reviewForm, setReviewForm] = useState<{
    userName: string;
    userEmail: string;
    rating: number;
    title: string;
    comment: string;
    imageUrl?: string;
  }>({ userName: '', userEmail: '', rating: 5, title: '', comment: '', imageUrl: '' });
  const [hoverRating, setHoverRating] = useState(0);

  // Eligible Coupons state
  const [coupons, setCoupons] = useState<EligibleCoupon[]>(product.eligibleCoupons || []);
  const [copiedCouponCode, setCopiedCouponCode] = useState<string | null>(null);
  const [isCouponsExpanded, setIsCouponsExpanded] = useState(false);

  useEffect(() => {
    if (!hasFetchedReviewsRef.current && (product.id || product.urlSlug)) {
      hasFetchedReviewsRef.current = true;
      setIsReviewsLoading(true);
      getProductReviews(product.id || product.urlSlug || '')
        .then((data) => {
          if (data?.reviews) setReviewsList(data.reviews);
        })
        .catch((err) => {
          console.warn('Using pre-loaded reviews fallback:', err);
        })
        .finally(() => setIsReviewsLoading(false));
    }
  }, [product.id, product.urlSlug]);

  const isWishlisted = isInWishlist(product.id);

  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId);
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

  const totalReviewsCount = reviewsList.length;
  const avgRating = totalReviewsCount > 0
    ? Number((reviewsList.reduce((acc, r) => acc + r.rating, 0) / totalReviewsCount).toFixed(1))
    : 5.0;

  const starCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviewsList.forEach((r) => { if (r.rating >= 1 && r.rating <= 5) (starCounts as Record<number, number>)[r.rating]++; });

  // Fetch eligible coupons dynamically if not preloaded
  useEffect(() => {
    if (!product.eligibleCoupons || product.eligibleCoupons.length === 0) {
      getProductEligibleCoupons(product.id || product.urlSlug || '', activePrice)
        .then((data) => {
          if (Array.isArray(data)) setCoupons(data);
        })
        .catch(() => {});
    }
  }, [product.id, product.urlSlug, product.eligibleCoupons, activePrice]);

  const handleCopyCoupon = (code: string) => {
    if (!code) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopiedCouponCode(code);
    toast.success(`Coupon "${code}" copied! Paste at checkout to redeem savings.`, 'Offer Unlocked');
    setTimeout(() => {
      setCopiedCouponCode((curr) => (curr === code ? null : curr));
    }, 3000);
  };

  const handleAddToCart = async () => {
    if (isAdding || isOutOfStock) return;
    setIsAdding(true);
    try {
      await addToCart({
        productId: product.id,
        variantId: selectedVariantId || undefined,
        quantity: Math.min(quantity, Math.max(1, stock)),
        options: {
          size: selectedSize || undefined,
          color: selectedColor || undefined,
          variant: selectedVariant?.name || undefined,
        },
      });
    } catch (err: any) {
      console.warn('Failed to add product to cart:', err?.message || err);
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
    imageUrl?: string;
  }) => {
    if (!form.comment.trim()) return;
    setIsSubmittingReview(true);
    try {
      if (editingReviewId) {
        const res = await editProductReview(product.id, editingReviewId, {
          userName: form.userName,
          rating: form.rating,
          title: form.title,
          comment: form.comment,
          imageUrl: form.imageUrl,
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
          imageUrl: form.imageUrl,
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

  const hasUserLiked = (rev: ProductReview): boolean => {
    if (rev.hasLiked !== undefined) return Boolean(rev.hasLiked);
    if (!rev.likedByJson) return false;
    try {
      const list = JSON.parse(rev.likedByJson);
      if (!Array.isArray(list)) return false;
      if (customer?.id && list.includes(customer.id)) return true;
      if (customer?.email && list.includes(customer.email.toLowerCase())) return true;
      return false;
    } catch {
      return false;
    }
  };

  const handleHelpfulToggle = async (revId: string) => {
    try {
      const userIdentifier = customer?.id || customer?.email || undefined;
      const res = await upvoteProductReview(product.id, revId, userIdentifier);
      setReviewsList((prev) =>
        prev.map((r) =>
          r.id === revId
            ? {
                ...r,
                helpfulCount: res.helpfulCount,
                hasLiked: res.hasLiked,
                likedByJson: res.likedBy ? JSON.stringify(res.likedBy) : r.likedByJson,
              }
            : r
        )
      );
    } catch { /* silent */ }
  };

  const isReviewOwner = (rev: ProductReview): boolean => {
    if (!isAuthenticated || !customer) return false;
    if (rev.customerId && customer.id && rev.customerId === customer.id) return true;
    if (rev.userEmail && customer.email && rev.userEmail.toLowerCase() === customer.email.toLowerCase()) return true;
    return false;
  };

  const handleDeleteReview = async (revId: string) => {
    if (!window.confirm('Are you sure you want to delete your review? This action cannot be undone.')) return;
    setDeletingReviewId(revId);
    try {
      await deleteProductReview(product.id, revId);
      setReviewsList((prev) => prev.filter((r) => r.id !== revId));
      toast.success('Your review has been deleted.', 'Review Removed');
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || 'Failed to delete review';
      toast.error(msg, 'Delete Failed');
    } finally {
      setDeletingReviewId(null);
    }
  };

  const openWriteReview = () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to your account to post a review.', 'Authentication Required');
      if (typeof window !== 'undefined') {
        window.location.href = `/auth/login?redirect=/products/${product.urlSlug || product.id}`;
      }
      return;
    }
    setEditingReviewId(null);
    setReviewForm({
      userName: customer?.name || '',
      userEmail: customer?.email || '',
      rating: 5,
      title: '',
      comment: '',
      imageUrl: '',
    });
    setIsReviewModalOpen(true);
  };

  const openEditReview = (rev: ProductReview) => {
    setEditingReviewId(rev.id);
    setReviewForm({
      userName: rev.userName || rev.customerName || '',
      userEmail: rev.userEmail || '',
      rating: rev.rating,
      title: rev.title || '',
      comment: rev.comment || '',
      imageUrl: rev.imageUrl || '',
    });
    setIsReviewModalOpen(true);
  };

  // ─── Design Tokens per Template ─────────────────────────────────────────────
  const radiusBox = isMinimal
    ? 'rounded-none'
    : isLuxe
    ? 'rounded-sm'
    : isMincom
    ? 'rounded-xl'
    : isNova
    ? 'rounded-[26px]'
    : isFuno
    ? 'rounded-[32px]'
    : 'rounded-3xl';

  const radiusPill = isMinimal || isLuxe ? 'rounded-none' : 'rounded-full';

  const titleClass = isLuxe
    ? 'font-serif text-3xl sm:text-5xl font-normal tracking-wide text-stone-900 dark:text-stone-100'
    : isNova
    ? 'font-sans text-3xl sm:text-5xl font-semibold tracking-tight text-[#1d1d1f] dark:text-white'
    : isMinimal
    ? 'font-sans text-3xl sm:text-5xl font-extralight tracking-tight uppercase text-black dark:text-white'
    : isFuno
    ? 'font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white'
    : isMincom
    ? 'font-sans text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100'
    : 'font-sans text-3xl sm:text-4xl font-black tracking-tight text-[var(--sf-text)]';

  const galleryAspect = isLuxe
    ? 'aspect-[3/4]'
    : 'aspect-square';

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fadeIn border border-gray-700">
          <span>{toastMessage}</span>
          <Link href="/cart" className="text-xs font-bold underline" style={{ color: 'var(--sf-accent)' }}>View Cart</Link>
        </div>
      )}

      {/* ── Top Breadcrumbs Strip ────────────────────────────────────── */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full text-xs flex items-center gap-2"
        style={{ color: 'color-mix(in srgb, var(--sf-text) 45%, transparent)' }}
      >
        <Link href="/" className="hover:underline transition">Home</Link>
        <span>{isMinimal ? '//' : isLuxe ? '✦' : '/'}</span>
        <Link href="/products" className="hover:underline transition">Products</Link>
        {product.categoryName && (
          <>
            <span>{isMinimal ? '//' : isLuxe ? '✦' : '/'}</span>
            <Link href={`/products?category=${encodeURIComponent(product.categoryName)}`} className="hover:underline transition">
              {product.categoryName}
            </Link>
          </>
        )}
        <span>{isMinimal ? '//' : isLuxe ? '✦' : '/'}</span>
        <span className="truncate max-w-xs font-medium" style={{ color: 'var(--sf-text)' }}>
          {product.name}
        </span>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">

        {/* ── Product Hero Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

          {/* ── 1. Media Gallery (Left Column) ─────────────────────────── */}
          <div className="lg:col-span-6 space-y-4">
            <div
              className={`${galleryAspect} ${radiusBox} overflow-hidden relative shadow-inner border`}
              style={{
                backgroundColor: isNova
                  ? 'color-mix(in srgb, var(--sf-text) 3%, var(--sf-bg))'
                  : 'color-mix(in srgb, var(--sf-text) 5%, var(--sf-bg))',
                borderColor: isMinimal
                  ? 'color-mix(in srgb, var(--sf-text) 30%, transparent)'
                  : 'color-mix(in srgb, var(--sf-text) 10%, transparent)',
              }}
            >
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center transition duration-500 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">📦</div>
              )}

              {/* Discount Tag */}
              {discount > 0 && (
                <span
                  className={`absolute top-4 left-4 px-3 py-1.5 text-xs font-black text-white shadow-lg z-10 ${
                    isMinimal
                      ? 'rounded-none bg-black text-white font-mono'
                      : isLuxe
                      ? 'rounded-none bg-stone-900 uppercase tracking-[0.2em] text-[10px]'
                      : 'rounded-full'
                  }`}
                  style={isMinimal || isLuxe ? undefined : { backgroundColor: 'var(--sf-accent)' }}
                >
                  -{discount}% OFF
                </span>
              )}

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 w-10 h-10 backdrop-blur shadow-md flex items-center justify-center text-lg transition hover:scale-110 z-10 ${
                  isMinimal ? 'rounded-none bg-white border border-black' : isLuxe ? 'rounded-none bg-white/90 border border-stone-300' : 'rounded-full bg-white/85'
                }`}
                title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                {isWishlisted ? '❤️' : '🤍'}
              </button>
            </div>

            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 overflow-hidden border-2 flex-shrink-0 relative transition cursor-pointer ${
                      isMinimal
                        ? 'rounded-none'
                        : isLuxe
                        ? 'rounded-none'
                        : isMincom
                        ? 'rounded-lg'
                        : 'rounded-2xl'
                    } ${selectedImage === img ? 'shadow-md opacity-100 scale-95' : 'opacity-60 hover:opacity-100'}`}
                    style={{
                      borderColor: selectedImage === img ? 'var(--sf-primary)' : 'color-mix(in srgb, var(--sf-text) 15%, transparent)',
                    }}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── 2. Product Details & Actions (Right Column) ──────────────── */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Header Badge / Meta */}
            <div>
              {isNova ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-[#0071e3]/10 text-[#0071e3] border border-[#0071e3]/20 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3] animate-ping" />
                  <span>Flagship Innovation • Pro Tech Series</span>
                </div>
              ) : isLuxe ? (
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-px bg-amber-600/40" />
                  <span className="text-[10px] tracking-[0.3em] uppercase text-amber-800 dark:text-amber-400 font-medium">
                    Atelier Collection {product.brandName ? `• ${product.brandName}` : ''}
                  </span>
                </div>
              ) : isMinimal ? (
                <div className="text-[11px] font-mono tracking-widest uppercase text-zinc-500 mb-2">
                  [ SPEC_ID: {activeSku || 'EDITION_01'} ]
                </div>
              ) : isFuno ? (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 text-xs font-bold mb-2">
                  <span>💛 Customer Favorite • Nordic Living</span>
                </div>
              ) : isMincom ? (
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-2">
                  <span>★ Commercial Grade Spec</span>
                </div>
              ) : product.brandName ? (
                <span className="text-xs font-bold uppercase tracking-widest block mb-1" style={{ color: 'var(--sf-primary)' }}>
                  {product.brandName}
                </span>
              ) : null}

              <h1 className={titleClass}>
                {product.name}
              </h1>

              {/* Rating & Stock Summary */}
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <div className="flex text-sm" style={{ color: 'var(--sf-accent, #f59e0b)' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s}>{s <= Math.round(avgRating) ? '★' : '☆'}</span>
                  ))}
                </div>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-xs font-bold hover:underline transition"
                  style={{ color: 'color-mix(in srgb, var(--sf-text) 60%, transparent)' }}
                >
                  {avgRating} ({totalReviewsCount} {totalReviewsCount === 1 ? 'verified review' : 'reviews'})
                </button>
                <span style={{ color: 'color-mix(in srgb, var(--sf-text) 25%, transparent)' }}>•</span>
                <span className={`text-xs font-bold ${isOutOfStock ? 'text-rose-600' : stock <= 5 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {isOutOfStock ? '✕ Out of Stock' : stock <= 5 ? `⚠️ Only ${stock} units remaining` : `✓ In Stock (${stock} available)`}
                </span>
              </div>
            </div>

            {/* Price Presentation */}
            <div
              className="flex items-baseline gap-3 pb-6 border-b"
              style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}
            >
              <span className={`text-3xl sm:text-4xl ${isLuxe ? 'font-serif' : 'font-black'}`} style={{ color: 'var(--sf-primary)' }}>
                {formatPrice(activePrice)}
              </span>
              {activeCompareAtPrice && activeCompareAtPrice > activePrice && (
                <span className="text-lg line-through" style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>
                  {formatPrice(activeCompareAtPrice)}
                </span>
              )}
              {discount > 0 && (
                <span
                  className={`px-2.5 py-0.5 text-xs font-black ${
                    isMinimal ? 'rounded-none bg-black text-white' : isLuxe ? 'rounded-none border border-amber-500 text-amber-700' : 'rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20'
                  }`}
                >
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Variant Selector (if product has variants) */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--sf-text) 60%, transparent)' }}>
                    {isNova ? 'Hardware Configuration' : isLuxe ? 'Select Atelier Finish' : isMinimal ? 'EDITION_OPTIONS' : 'Choose Variant'}
                  </span>
                  {selectedVariant && (
                    <span className="text-xs font-mono font-bold" style={{ color: 'color-mix(in srgb, var(--sf-text) 60%, transparent)' }}>
                      SKU: {selectedVariant.sku}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((v) => {
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
                        className={`px-4 py-2 text-xs font-bold border transition flex items-center gap-2 cursor-pointer ${
                          isMinimal ? 'rounded-none' : isLuxe ? 'rounded-none' : isMincom ? 'rounded-lg' : 'rounded-xl'
                        } ${isVOut ? 'opacity-40 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                        style={{
                          backgroundColor: isSelected ? 'var(--sf-primary)' : 'transparent',
                          color: isSelected ? '#ffffff' : 'var(--sf-text)',
                          borderColor: isSelected ? 'var(--sf-primary)' : 'color-mix(in srgb, var(--sf-text) 20%, transparent)',
                        }}
                      >
                        <span>{v.name}</span>
                        <span className={`text-[11px] font-mono ${isSelected ? 'text-white/90' : 'opacity-70'}`}>
                          {formatPrice(v.price)}
                        </span>
                        {isVOut && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-500 font-black">
                            Sold Out
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Eligible Coupons Section ─────────────────────────────── */}
            {coupons && coupons.length > 0 && (
              <div
                className={`p-4 border space-y-3 transition-all ${radiusBox}`}
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--sf-primary) 3%, var(--sf-bg))',
                  borderColor: 'color-mix(in srgb, var(--sf-primary) 20%, transparent)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🏷️</span>
                    <span className="text-xs font-black uppercase tracking-wider" style={{ color: 'var(--sf-primary)' }}>
                      Available Coupons ({coupons.length})
                    </span>
                  </div>
                  <span className="text-[11px] font-medium" style={{ color: 'color-mix(in srgb, var(--sf-text) 55%, transparent)' }}>
                    Click code to copy
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(isCouponsExpanded ? coupons : coupons.slice(0, 4)).map((coupon) => {
                    const isCopied = copiedCouponCode === coupon.code;
                    const liveSavings =
                      coupon.discountType === 'PERCENTAGE'
                        ? (activePrice * (coupon.value || 0)) / 100
                        : coupon.discountType === 'FIXED_AMOUNT'
                        ? Math.min(activePrice, coupon.value || 0)
                        : 0;

                    return (
                      <div
                        key={coupon.id}
                        className={`p-3 border border-dashed flex flex-col justify-between gap-2.5 transition hover:shadow-sm ${
                          isMinimal ? 'rounded-none' : isLuxe ? 'rounded-none' : 'rounded-xl'
                        }`}
                        style={{
                          backgroundColor: 'color-mix(in srgb, var(--sf-text) 2%, var(--sf-bg))',
                          borderColor: isCopied ? '#10b981' : 'color-mix(in srgb, var(--sf-primary) 30%, transparent)',
                        }}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-1">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${radiusPill}`}
                              style={{
                                backgroundColor: 'color-mix(in srgb, var(--sf-accent) 15%, transparent)',
                                color: 'var(--sf-accent)',
                              }}
                            >
                              {coupon.badge || (coupon.discountType === 'PERCENTAGE' ? `${coupon.value}% OFF` : 'OFFER')}
                            </span>
                            {liveSavings > 0 && (
                              <span className="text-[11px] font-black text-emerald-600 font-mono">
                                Save {formatPrice(liveSavings)}
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-bold truncate" style={{ color: 'var(--sf-text)' }} title={coupon.title}>
                            {coupon.title}
                          </h4>
                          <p className="text-[11px] line-clamp-1" style={{ color: 'color-mix(in srgb, var(--sf-text) 65%, transparent)' }}>
                            {coupon.description || coupon.terms || 'Applicable on this order'}
                          </p>
                        </div>

                        <div
                          className="flex items-center justify-between pt-2 border-t border-dashed"
                          style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}
                        >
                          <span
                            className="font-mono text-xs font-black tracking-wider px-2 py-0.5 rounded border border-dashed"
                            style={{
                              borderColor: 'var(--sf-primary)',
                              color: 'var(--sf-primary)',
                              backgroundColor: 'color-mix(in srgb, var(--sf-primary) 5%, transparent)',
                            }}
                          >
                            {coupon.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCoupon(coupon.code)}
                            className="text-[11px] font-bold px-2.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer"
                            style={{
                              backgroundColor: isCopied ? '#10b981' : 'color-mix(in srgb, var(--sf-primary) 12%, transparent)',
                              color: isCopied ? '#ffffff' : 'var(--sf-primary)',
                            }}
                          >
                            {isCopied ? '✓ Copied' : 'Copy 📋'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {coupons.length > 4 && (
                  <button
                    type="button"
                    onClick={() => setIsCouponsExpanded(!isCouponsExpanded)}
                    className="w-full text-center text-xs font-bold pt-1 hover:underline cursor-pointer"
                    style={{ color: 'var(--sf-primary)' }}
                  >
                    {isCouponsExpanded ? 'Show Less Offers ▲' : `View All ${coupons.length} Offers ▼`}
                  </button>
                )}
              </div>
            )}

            {/* ── Quantity & Add to Cart Action Area ───────────────────── */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                {/* Stepper */}
                <div
                  className={`flex items-center p-1 ${
                    isMinimal ? 'rounded-none border border-black dark:border-white' : isLuxe ? 'rounded-none border border-stone-300 dark:border-stone-700' : 'rounded-2xl border'
                  }`}
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--sf-text) 4%, var(--sf-bg))',
                    borderColor: isMinimal || isLuxe ? undefined : 'color-mix(in srgb, var(--sf-text) 15%, transparent)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={isOutOfStock || quantity <= 1}
                    className="w-9 h-9 flex items-center justify-center font-bold text-sm transition hover:opacity-70 disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ color: 'var(--sf-text)' }}
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-sm" style={{ color: 'var(--sf-text)' }}>
                    {isOutOfStock ? 0 : quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                    disabled={isOutOfStock || quantity >= stock}
                    className="w-9 h-9 flex items-center justify-center font-bold text-sm transition hover:opacity-70 disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ color: 'var(--sf-text)' }}
                  >
                    +
                  </button>
                </div>

                {/* Primary Add to Cart Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isAdding || isOutOfStock}
                  className={`flex-1 py-4 font-bold text-sm text-white shadow-xl transition active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                    isLuxe
                      ? 'rounded-none uppercase tracking-[0.25em] text-xs py-4.5 bg-stone-950 hover:bg-stone-800'
                      : isMinimal
                      ? 'rounded-none uppercase tracking-widest text-xs py-4 bg-black dark:bg-white dark:text-black'
                      : isNova
                      ? 'rounded-full py-4 text-sm bg-[#0071e3] hover:bg-[#0077ed]'
                      : isFuno
                      ? 'rounded-full py-4 text-sm bg-slate-950 hover:bg-orange-600'
                      : isMincom
                      ? 'rounded-xl py-3.5 text-sm'
                      : 'rounded-2xl py-4 text-sm'
                  }`}
                  style={
                    isLuxe || isMinimal || isNova || isFuno
                      ? undefined
                      : { backgroundColor: isOutOfStock ? '#64748b' : 'var(--sf-primary)' }
                  }
                >
                  {isAdding ? 'Adding to Bag…' : isOutOfStock ? 'Out of Stock' : isLuxe ? 'Add to Atelier Bag' : isNova ? 'Add to Bag' : 'Add to Bag'} 🛍️
                </button>
              </div>

              {!isOutOfStock && (
                <Link
                  href="/checkout"
                  onClick={handleAddToCart}
                  className={`w-full text-center border-2 transition block hover:opacity-90 cursor-pointer ${
                    isLuxe
                      ? 'rounded-none py-3.5 uppercase tracking-[0.2em] text-xs font-semibold'
                      : isMinimal
                      ? 'rounded-none py-3 uppercase tracking-widest text-xs font-bold'
                      : isNova
                      ? 'rounded-full py-3.5 text-sm font-semibold'
                      : isFuno
                      ? 'rounded-full py-3.5 text-xs font-extrabold'
                      : 'rounded-2xl py-3 text-sm font-bold'
                  }`}
                  style={{ borderColor: 'var(--sf-primary)', color: 'var(--sf-primary)' }}
                >
                  {isLuxe ? 'Proceed to Bespoke Checkout →' : 'Express Checkout →'}
                </Link>
              )}
            </div>

            {/* ── Template Trust / Highlights Strip ────────────────────── */}
            <div
              className={`p-4 grid grid-cols-3 gap-2 text-center text-[11px] border ${radiusBox}`}
              style={{
                backgroundColor: 'color-mix(in srgb, var(--sf-text) 3%, var(--sf-bg))',
                borderColor: 'color-mix(in srgb, var(--sf-text) 8%, transparent)',
              }}
            >
              {isNova ? (
                <>
                  <div>
                    <span className="block text-base mb-0.5">⚡</span>
                    <span className="font-bold block" style={{ color: 'var(--sf-text)' }}>Next-Day Courier</span>
                    <span className="opacity-60">Express dispatch</span>
                  </div>
                  <div>
                    <span className="block text-base mb-0.5">🔒</span>
                    <span className="font-bold block" style={{ color: 'var(--sf-text)' }}>Encrypted Pay</span>
                    <span className="opacity-60">Hardware security</span>
                  </div>
                  <div>
                    <span className="block text-base mb-0.5">🛡️</span>
                    <span className="font-bold block" style={{ color: 'var(--sf-text)' }}>2-Yr Warranty</span>
                    <span className="opacity-60">Complete coverage</span>
                  </div>
                </>
              ) : isLuxe ? (
                <>
                  <div>
                    <span className="block text-base mb-0.5">✦</span>
                    <span className="font-bold block uppercase tracking-wider text-[10px]" style={{ color: 'var(--sf-text)' }}>Atelier Craft</span>
                    <span className="opacity-60 text-[10px]">Master materials</span>
                  </div>
                  <div>
                    <span className="block text-base mb-0.5">✦</span>
                    <span className="font-bold block uppercase tracking-wider text-[10px]" style={{ color: 'var(--sf-text)' }}>Gift Presentation</span>
                    <span className="opacity-60 text-[10px]">Signature box</span>
                  </div>
                  <div>
                    <span className="block text-base mb-0.5">✦</span>
                    <span className="font-bold block uppercase tracking-wider text-[10px]" style={{ color: 'var(--sf-text)' }}>White Glove</span>
                    <span className="opacity-60 text-[10px]">Insured delivery</span>
                  </div>
                </>
              ) : isMinimal ? (
                <>
                  <div>
                    <span className="font-mono text-sm block mb-0.5">// 01</span>
                    <span className="font-bold block text-[10px] uppercase" style={{ color: 'var(--sf-text)' }}>Zero Plastic</span>
                    <span className="opacity-60 text-[10px]">100% Recyclable</span>
                  </div>
                  <div>
                    <span className="font-mono text-sm block mb-0.5">// 02</span>
                    <span className="font-bold block text-[10px] uppercase" style={{ color: 'var(--sf-text)' }}>Carbon Neutral</span>
                    <span className="opacity-60 text-[10px]">Global logistics</span>
                  </div>
                  <div>
                    <span className="font-mono text-sm block mb-0.5">// 03</span>
                    <span className="font-bold block text-[10px] uppercase" style={{ color: 'var(--sf-text)' }}>5-Yr Pledge</span>
                    <span className="opacity-60 text-[10px]">Built to endure</span>
                  </div>
                </>
              ) : isFuno ? (
                <>
                  <div>
                    <span className="block text-base mb-0.5">🚚</span>
                    <span className="font-bold block" style={{ color: 'var(--sf-text)' }}>Free Shipping</span>
                    <span className="opacity-60">To your doorstep</span>
                  </div>
                  <div>
                    <span className="block text-base mb-0.5">☕</span>
                    <span className="font-bold block" style={{ color: 'var(--sf-text)' }}>30-Day Trial</span>
                    <span className="opacity-60">Love it or return</span>
                  </div>
                  <div>
                    <span className="block text-base mb-0.5">💛</span>
                    <span className="font-bold block" style={{ color: 'var(--sf-text)' }}>Human Support</span>
                    <span className="opacity-60">7 days a week</span>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="block text-base mb-0.5">🚚</span>
                    <span className="font-bold block" style={{ color: 'var(--sf-text)' }}>Free Shipping</span>
                    <span className="opacity-60">Orders over ₹999</span>
                  </div>
                  <div>
                    <span className="block text-base mb-0.5">🔄</span>
                    <span className="font-bold block" style={{ color: 'var(--sf-text)' }}>Easy Returns</span>
                    <span className="opacity-60">7-Day Guarantee</span>
                  </div>
                  <div>
                    <span className="block text-base mb-0.5">🔒</span>
                    <span className="font-bold block" style={{ color: 'var(--sf-text)' }}>Safe Payment</span>
                    <span className="opacity-60">Stripe & Razorpay</span>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>

        {/* ── 3. Content Tabs Section (Description, Specs, Reviews) ─────── */}
        <div className="mt-16 pt-10 border-t" style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}>
          
          {/* Tab Headers */}
          <div className="flex gap-8 border-b mb-8" style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}>
            {(['description', 'specs', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-bold tracking-wide transition-all border-b-2 cursor-pointer ${
                  isLuxe ? 'font-serif tracking-widest uppercase text-xs' : isMinimal ? 'uppercase font-mono text-xs' : ''
                }`}
                style={{
                  borderColor: activeTab === tab ? 'var(--sf-primary)' : 'transparent',
                  color: activeTab === tab ? 'var(--sf-primary)' : 'color-mix(in srgb, var(--sf-text) 40%, transparent)',
                }}
              >
                {tab === 'description' ? 'Overview' : tab === 'specs' ? 'Specifications' : (
                  <span className="flex items-center gap-2">
                    Customer Reviews
                    <span
                      className={`px-2 py-0.5 text-xs font-extrabold ${radiusPill}`}
                      style={{ backgroundColor: 'color-mix(in srgb, var(--sf-text) 8%, var(--sf-bg))' }}
                    >
                      {totalReviewsCount}
                    </span>
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl text-sm leading-relaxed" style={{ color: 'color-mix(in srgb, var(--sf-text) 70%, transparent)' }}>
            
            {/* Overview / Description */}
            {activeTab === 'description' && (
              <div className="space-y-4">
                <p className="leading-relaxed" style={{ color: 'var(--sf-text)' }}>
                  {product.description || 'No detailed description provided for this product.'}
                </p>
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-3 py-1 text-xs font-medium ${radiusPill}`}
                        style={{
                          backgroundColor: 'color-mix(in srgb, var(--sf-text) 8%, var(--sf-bg))',
                          color: 'color-mix(in srgb, var(--sf-text) 60%, transparent)',
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Specifications Matrix */}
            {activeTab === 'specs' && (
              <div className={`border divide-y ${radiusBox}`} style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}>
                {[
                  { label: 'Category', value: product.categoryName || 'General Merchandise' },
                  { label: 'Brand / Maker', value: product.brandName || theme.storeName },
                  { label: 'Model Identifier / SKU', value: activeSku || product.id },
                  ...(product.material ? [{ label: 'Primary Material', value: product.material }] : []),
                  ...(product.weight ? [{ label: 'Item Weight', value: `${product.weight} kg` }] : []),
                  ...(product.dimensions ? [{ label: 'Physical Dimensions', value: product.dimensions }] : []),
                  { label: 'Quality Verification', value: 'Inspected & Guaranteed Authentic' },
                ].map((row, idx) => (
                  <div
                    key={row.label}
                    className={`py-3.5 px-4 flex justify-between items-center text-xs ${
                      idx % 2 === 0 ? 'bg-black/[0.01] dark:bg-white/[0.01]' : ''
                    }`}
                    style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 8%, transparent)' }}
                  >
                    <span className="font-bold" style={{ color: 'var(--sf-text)' }}>{row.label}</span>
                    <span className="font-medium" style={{ color: 'color-mix(in srgb, var(--sf-text) 65%, transparent)' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Customer Reviews Module */}
            {activeTab === 'reviews' && (
              <div className="space-y-8">
                
                {/* Breakdown Card */}
                <div
                  className={`p-6 border grid grid-cols-1 md:grid-cols-12 gap-6 items-center ${radiusBox}`}
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--sf-text) 3%, var(--sf-bg))',
                    borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)',
                  }}
                >
                  <div className="md:col-span-4 text-center md:text-left space-y-1">
                    <span className="text-5xl font-black" style={{ color: 'var(--sf-text)' }}>{avgRating}</span>
                    <div className="flex justify-center md:justify-start text-base" style={{ color: 'var(--sf-accent, #f59e0b)' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s}>{s <= Math.round(avgRating) ? '★' : '☆'}</span>
                      ))}
                    </div>
                    <p className="text-xs" style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}>
                      Based on {totalReviewsCount} verified customer submissions
                    </p>
                  </div>

                  <div className="md:col-span-5 space-y-1.5 text-xs">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = (starCounts as Record<number, number>)[stars] || 0;
                      const pct = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;
                      return (
                        <div key={stars} className="flex items-center gap-2">
                          <span className="w-8 text-right font-bold" style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}>
                            {stars}★
                          </span>
                          <div
                            className="flex-1 h-2 rounded-full overflow-hidden"
                            style={{ backgroundColor: 'color-mix(in srgb, var(--sf-text) 12%, transparent)' }}
                          >
                            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: 'var(--sf-accent, #f59e0b)' }} />
                          </div>
                          <span className="w-6 font-mono text-[10px]" style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="md:col-span-3 text-center md:text-right">
                    {isAuthenticated ? (
                      <button
                        type="button"
                        onClick={openWriteReview}
                        className={`w-full sm:w-auto px-5 py-3 font-bold text-xs text-white shadow-lg transition hover:opacity-90 cursor-pointer ${
                          isMinimal ? 'rounded-none bg-black text-white dark:bg-white dark:text-black uppercase tracking-wider' : isLuxe ? 'rounded-none bg-stone-900 uppercase tracking-widest' : isNova ? 'rounded-full bg-[#0071e3]' : isFuno ? 'rounded-full bg-slate-900' : 'rounded-2xl'
                        }`}
                        style={isMinimal || isLuxe || isNova || isFuno ? undefined : { backgroundColor: 'var(--sf-primary)' }}
                      >
                        ✏️ Write a Review
                      </button>
                    ) : (
                      <Link
                        href={`/auth/login?redirect=/products/${product.urlSlug || product.id}`}
                        className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border transition hover:opacity-80 ${radiusPill}`}
                        style={{
                          borderColor: 'color-mix(in srgb, var(--sf-text) 18%, transparent)',
                          color: 'var(--sf-primary)',
                        }}
                      >
                        <span>🔒</span> Log in to write a review
                      </Link>
                    )}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {isReviewsLoading ? (
                    <div
                      className={`p-12 text-center border ${radiusBox}`}
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--sf-text) 3%, var(--sf-bg))',
                        borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)',
                      }}
                    >
                      <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-2" style={{ borderColor: 'var(--sf-primary)', borderTopColor: 'transparent' }} />
                      <p className="text-xs font-semibold">Loading reviews…</p>
                    </div>
                  ) : reviewsList.length > 0 ? (
                    reviewsList.map((rev) => (
                      <div
                        key={rev.id}
                        className={`p-6 border space-y-3 ${radiusBox}`}
                        style={{
                          backgroundColor: 'var(--sf-bg)',
                          borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)',
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`font-bold text-sm ${isLuxe ? 'font-serif' : ''}`} style={{ color: 'var(--sf-text)' }}>
                                {rev.userName || rev.customerName || 'Verified Customer'}
                              </span>
                              {rev.verified !== false && (
                                <span
                                  className={`px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 border border-emerald-200 ${radiusPill}`}
                                  style={{ backgroundColor: '#f0fdf4' }}
                                >
                                  ✓ Verified
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs" style={{ color: 'var(--sf-accent, #f59e0b)' }}>
                                {'★'.repeat(rev.rating)}{'☆'.repeat(Math.max(0, 5 - rev.rating))}
                              </span>
                              <span className="text-[11px]" style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>
                                {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {isReviewOwner(rev) && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => openEditReview(rev)}
                                  className={`text-xs font-semibold px-2.5 py-1 transition hover:opacity-70 flex items-center gap-1 cursor-pointer ${radiusPill}`}
                                  style={{
                                    backgroundColor: 'color-mix(in srgb, var(--sf-text) 6%, var(--sf-bg))',
                                    color: 'color-mix(in srgb, var(--sf-text) 70%, transparent)',
                                  }}
                                >
                                  ✏️ Edit
                                </button>
                                <button
                                  type="button"
                                  disabled={deletingReviewId === rev.id}
                                  onClick={() => handleDeleteReview(rev.id)}
                                  className={`text-xs font-semibold px-2.5 py-1 transition hover:opacity-70 flex items-center gap-1 text-rose-500 hover:text-rose-600 disabled:opacity-50 cursor-pointer ${radiusPill}`}
                                  style={{
                                    backgroundColor: 'color-mix(in srgb, #f43f5e 10%, var(--sf-bg))',
                                  }}
                                >
                                  🗑️ {deletingReviewId === rev.id ? 'Deleting…' : 'Delete'}
                                </button>
                              </>
                            )}
                            <button
                              type="button"
                              onClick={() => handleHelpfulToggle(rev.id)}
                              className={`text-xs font-semibold px-2.5 py-1 flex items-center gap-1 transition cursor-pointer ${radiusPill} ${
                                hasUserLiked(rev)
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/50 dark:border-emerald-700 dark:text-emerald-300 font-bold'
                                  : 'hover:opacity-70'
                              }`}
                              style={
                                hasUserLiked(rev)
                                  ? undefined
                                  : {
                                      backgroundColor: 'color-mix(in srgb, var(--sf-text) 6%, var(--sf-bg))',
                                      color: 'color-mix(in srgb, var(--sf-text) 55%, transparent)',
                                    }
                              }
                              title={hasUserLiked(rev) ? 'Click to unlike' : 'Mark as helpful'}
                            >
                              <span>{hasUserLiked(rev) ? '👍 Liked' : '👍'}</span>
                              <span>{rev.helpfulCount || 0}</span>
                            </button>
                          </div>
                        </div>

                        {rev.title && (
                          <h4 className="font-bold text-sm" style={{ color: 'var(--sf-text)' }}>
                            {rev.title}
                          </h4>
                        )}
                        <p className="text-xs leading-relaxed">{rev.comment}</p>

                        {/* Customer Attached Photo */}
                        {rev.imageUrl && (
                          <div className="pt-2">
                            <div className="inline-block relative group">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={rev.imageUrl}
                                alt="Review attachment"
                                className={`w-24 h-24 sm:w-28 sm:h-28 object-cover border border-gray-200 dark:border-gray-700 shadow-sm transition hover:opacity-90 cursor-pointer ${radiusBox}`}
                                onClick={() => window.open(rev.imageUrl!, '_blank')}
                              />
                              <span className="text-[10px] text-gray-400 block mt-1">🔍 Click to expand</span>
                            </div>
                          </div>
                        )}

                        {rev.adminReply && (
                          <div
                            className={`mt-3 p-3.5 border space-y-1 ${radiusBox}`}
                            style={{
                              backgroundColor: 'color-mix(in srgb, var(--sf-primary) 5%, var(--sf-bg))',
                              borderColor: 'color-mix(in srgb, var(--sf-primary) 20%, transparent)',
                            }}
                          >
                            <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--sf-primary)' }}>
                              💬 Store Response
                            </div>
                            <p className="text-xs leading-relaxed">{rev.adminReply}</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div
                      className={`p-12 text-center border ${radiusBox}`}
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--sf-text) 3%, var(--sf-bg))',
                        borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)',
                      }}
                    >
                      <span className="text-3xl block mb-2">⭐</span>
                      <p className="font-bold text-sm mb-1" style={{ color: 'var(--sf-text)' }}>No reviews yet</p>
                      <p className="text-xs mb-4" style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>
                        Be the first to share your experience with this item!
                      </p>
                      {isAuthenticated ? (
                        <button
                          onClick={openWriteReview}
                          className={`px-5 py-2.5 text-xs font-bold text-white shadow cursor-pointer ${
                            isMinimal ? 'rounded-none bg-black text-white uppercase' : isLuxe ? 'rounded-none bg-stone-900 uppercase' : 'rounded-2xl'
                          }`}
                          style={isMinimal || isLuxe ? undefined : { backgroundColor: 'var(--sf-primary)' }}
                        >
                          Write First Review
                        </button>
                      ) : (
                        <Link
                          href={`/auth/login?redirect=/products/${product.urlSlug || product.id}`}
                          className={`inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white shadow transition hover:opacity-90 ${radiusBox}`}
                          style={{ backgroundColor: 'var(--sf-primary)' }}
                        >
                          Sign in to write first review →
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── 4. Related Products Section ──────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2
                className={`text-2xl font-bold tracking-tight ${isLuxe ? 'font-serif italic text-3xl font-normal' : ''}`}
                style={{ color: 'var(--sf-text)' }}
              >
                {isNova ? 'You Might Also Want' : isLuxe ? 'Curated Companions' : isMinimal ? 'RELATED_PIECES' : 'You May Also Like'}
              </h2>
              <Link
                href="/products"
                className={`text-sm font-semibold hover:underline transition ${isLuxe ? 'uppercase tracking-[0.2em] text-xs' : ''}`}
                style={{ color: 'var(--sf-primary)' }}
              >
                View All →
              </Link>
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
          isAuthenticated={isAuthenticated}
          currentUser={customer}
          initialForm={reviewForm}
          onSubmit={handleSubmitReview}
          isSubmitting={isSubmittingReview}
        />
      )}
    </>
  );
}
