'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { ThemeConfig, ProductDetail, Product, ProductReview, EligibleCoupon } from '@/lib/api/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import DefaultHeader from '@/templates/default/Header';
import DefaultFooter from '@/templates/default/Footer';
import DefaultProductCard from '@/templates/default/ProductCard';
import ReviewModal from '@/components/shared/ReviewModal';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { getProductReviews, postProductReview, editProductReview, deleteProductReview, upvoteProductReview, getProductEligibleCoupons } from '@/lib/api';

interface ProductDetailClientProps {
  theme: ThemeConfig;
  product: ProductDetail;
  relatedProducts: Product[];
}

export default function ProductDetailClient({
  theme,
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { customer, isAuthenticated } = useAuth();
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

  // Review System State
  const [reviewsList, setReviewsList] = useState<ProductReview[]>(product.reviews || []);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

  // Guard Ref: Ensures the reviews API is called EXACTLY ONCE, and ONLY when navigating to the reviews tab
  const hasFetchedReviewsRef = useRef(false);

  // Ensures the reviews API is called to fetch all posted reviews
  useEffect(() => {
    if (!hasFetchedReviewsRef.current && (product.id || product.urlSlug)) {
      hasFetchedReviewsRef.current = true;
      fetchProductReviewsOnce();
    }
  }, [product.id, product.urlSlug]);

  const fetchProductReviewsOnce = async () => {
    setIsReviewsLoading(true);
    try {
      const data = await getProductReviews(product.id || product.urlSlug || '');
      if (data && data.reviews && Array.isArray(data.reviews)) {
        setReviewsList(data.reviews);
      }
    } catch (err) {
      console.warn('Notice: Using pre-loaded reviews fallback:', err);
    } finally {
      setIsReviewsLoading(false);
    }
  };

  // Review Form
  const [reviewForm, setReviewForm] = useState<{
    userName: string;
    userEmail: string;
    rating: number;
    title: string;
    comment: string;
    imageUrl?: string;
  }>({
    userName: '',
    userEmail: '',
    rating: 5,
    title: '',
    comment: '',
    imageUrl: '',
  });
  const [hoverRating, setHoverRating] = useState(0);

  // Eligible Coupons state
  const [coupons, setCoupons] = useState<EligibleCoupon[]>(product.eligibleCoupons || []);
  const [copiedCouponCode, setCopiedCouponCode] = useState<string | null>(null);
  const [isCouponsExpanded, setIsCouponsExpanded] = useState(false);

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

  // Calculate Average Rating & Distribution
  const totalReviewsCount = reviewsList.length;
  const avgRating = totalReviewsCount > 0
    ? Number((reviewsList.reduce((acc, r) => acc + r.rating, 0) / totalReviewsCount).toFixed(1))
    : 5.0;

  const starCounts = {
    5: reviewsList.filter((r) => r.rating === 5).length,
    4: reviewsList.filter((r) => r.rating === 4).length,
    3: reviewsList.filter((r) => r.rating === 3).length,
    2: reviewsList.filter((r) => r.rating === 2).length,
    1: reviewsList.filter((r) => r.rating === 1).length,
  };

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
    setToastMessage(`🎉 Coupon "${code}" copied! Paste at checkout to redeem savings.`);
    setTimeout(() => {
      setCopiedCouponCode((curr) => (curr === code ? null : curr));
      setToastMessage(null);
    }, 3500);
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
      setToastMessage('🎉 Successfully added to cart!');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: any) {
      console.error('Error adding to cart:', err);
      const msg = err?.message || 'Failed to add to cart.';
      setToastMessage(`❌ ${msg}`);
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlistClick = async () => {
    await toggleWishlist(product.id);
  };

  const isReviewOwner = (rev: ProductReview): boolean => {
    if (!isAuthenticated || !customer) return false;
    if (rev.customerId && customer.id && rev.customerId === customer.id) return true;
    if (rev.userEmail && customer.email && rev.userEmail.toLowerCase() === customer.email.toLowerCase()) return true;
    return false;
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

  const handleDeleteReview = async (revId: string) => {
    if (!window.confirm('Are you sure you want to delete your review? This action cannot be undone.')) return;
    setDeletingReviewId(revId);
    try {
      await deleteProductReview(product.id, revId);
      setReviewsList((prev) => prev.filter((r) => r.id !== revId));
      setToastMessage('✓ Your review has been deleted.');
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err: any) {
      console.error('Error deleting review:', err);
      setToastMessage(`❌ ${err?.message || 'Failed to delete review'}`);
      setTimeout(() => setToastMessage(null), 3500);
    } finally {
      setDeletingReviewId(null);
    }
  };

  // Open Create Review Modal
  const handleOpenWriteReview = () => {
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

  // Open Edit Review Modal
  const handleOpenEditReview = (rev: ProductReview) => {
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

  // Submit Review Form (POST or EDIT)
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
        // Edit existing review
        const res = await editProductReview(product.id, editingReviewId, {
          userName: form.userName,
          rating: form.rating,
          title: form.title,
          comment: form.comment,
          imageUrl: form.imageUrl,
        });

        setReviewsList((prev) =>
          prev.map((r) => (r.id === editingReviewId ? { ...r, ...res.review } : r))
        );
        setToastMessage('✓ Your review has been updated!');
      } else {
        // Post new review
        const res = await postProductReview(product.id, {
          userName: form.userName,
          userEmail: form.userEmail || undefined,
          rating: form.rating,
          title: form.title || undefined,
          comment: form.comment,
          imageUrl: form.imageUrl,
        });

        setReviewsList((prev) => [res.review, ...prev]);
        setToastMessage('✓ Thank you! Your review has been published.');
      }

      setIsReviewModalOpen(false);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err: any) {
      console.error('Error submitting review:', err);
      setToastMessage(`❌ ${err?.response?.data?.message || 'Failed to submit review'}`);
      setTimeout(() => setToastMessage(null), 3500);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Toggle Review Helpful / Like
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
    } catch (err) {
      console.error('Error toggling review helpfulness:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--sf-bg)] text-[var(--sf-text)]">
      <DefaultHeader />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in border border-gray-700">
          <span>{toastMessage}</span>
          <Link
            href="/cart"
            className="text-xs font-bold underline text-amber-400 hover:text-amber-300"
          >
            View Cart
          </Link>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full text-xs text-gray-500 flex items-center gap-2">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:underline">Products</Link>
        {product.categoryName && (
          <>
            <span>/</span>
            <Link href={`/products?category=${encodeURIComponent(product.categoryName)}`} className="hover:underline">
              {product.categoryName}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-gray-800 dark:text-gray-200 truncate max-w-xs">{product.name}</span>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        {/* Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Gallery Column */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 relative shadow-inner">
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
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}

              {discount > 0 && (
                <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-black bg-rose-500 text-white shadow-lg z-10">
                  -{discount}% OFF
                </span>
              )}

              <button
                onClick={handleWishlistClick}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur shadow-md flex items-center justify-center text-lg transition hover:scale-110 z-10"
              >
                {isWishlisted ? '❤️' : '🤍'}
              </button>
            </div>

            {/* Thumbnail Row */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 relative transition ${
                      selectedImage === img
                        ? 'border-[var(--sf-primary)] shadow-md'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
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

          {/* Details & Actions Column */}
          <div className="space-y-6">
            <div>
              {product.brandName && (
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--sf-primary)] block mb-1">
                  {product.brandName}
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{product.name}</h1>
              
              {/* Rating stars banner */}
              <div className="flex items-center gap-3 mt-2">
                <div className="flex text-amber-400 text-sm">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>{star <= Math.round(avgRating) ? '★' : '☆'}</span>
                  ))}
                </div>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-xs font-bold text-gray-500 hover:text-[var(--sf-primary)] underline"
                >
                  {avgRating} ({totalReviewsCount} {totalReviewsCount === 1 ? 'review' : 'reviews'})
                </button>
                <span className="text-xs text-gray-300 dark:text-gray-700">•</span>
                <span className={`text-xs font-bold ${isOutOfStock ? 'text-rose-600' : stock <= 5 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {isOutOfStock ? '✕ Out of Stock' : stock <= 5 ? `⚠️ Only ${stock} units left` : `✓ In Stock (${stock} available)`}
                </span>
              </div>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-3 pb-6 border-b border-gray-100 dark:border-gray-800">
              <span className="text-3xl font-black text-[var(--sf-primary)]">
                ₹{activePrice.toFixed(2)}
              </span>
              {activeCompareAtPrice && activeCompareAtPrice > activePrice && (
                <span className="text-lg text-gray-400 line-through">
                  ₹{activeCompareAtPrice.toFixed(2)}
                </span>
              )}
              {discount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-black bg-rose-500/10 text-rose-600 border border-rose-500/20">
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Variant selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Select Option / Edition
                  </span>
                  {selectedVariant && (
                    <span className="text-xs font-mono font-bold text-gray-400">
                      SKU: {selectedVariant.sku}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
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
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition flex items-center gap-2 cursor-pointer ${
                          isVOut ? 'opacity-50' : ''
                        } ${
                          isSelected
                            ? 'border-[var(--sf-primary)] bg-[var(--sf-primary)] text-white shadow-md'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                        }`}
                      >
                        <span>{v.name}</span>
                        <span className={`text-[11px] font-mono ${isSelected ? 'text-white/90' : 'text-gray-500'}`}>
                          ₹{Number(v.price).toFixed(2)}
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

            {/* Size Options */}
            {product.sizeOptions && product.sizeOptions.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Size: <span className="text-gray-900 dark:text-gray-100">{selectedSize}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.sizeOptions.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                        selectedSize === size
                          ? 'border-[var(--sf-primary)] bg-[var(--sf-primary)] text-white shadow-md'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                      }`}
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
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Color: <span className="text-gray-900 dark:text-gray-100">{selectedColor}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                        selectedColor === color
                          ? 'border-[var(--sf-primary)] bg-[var(--sf-primary)] text-white shadow-md'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Eligible Coupons & Offers ───────────────────────────────── */}
            {coupons && coupons.length > 0 && (
              <div className="p-4 rounded-2xl border border-[var(--sf-primary)]/20 bg-[var(--sf-primary)]/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🏷️</span>
                    <span className="text-xs font-black uppercase tracking-wider text-[var(--sf-primary)]">
                      Eligible Coupons ({coupons.length})
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-gray-500">Tap code to copy</span>
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
                        className={`p-3 rounded-xl border border-dashed flex flex-col justify-between gap-2 transition hover:shadow-sm bg-white dark:bg-gray-800 ${
                          isCopied ? 'border-emerald-500' : 'border-[var(--sf-primary)]/30'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-600 border border-amber-500/30">
                              {coupon.badge || (coupon.discountType === 'PERCENTAGE' ? `${coupon.value}% OFF` : 'OFFER')}
                            </span>
                            {liveSavings > 0 && (
                              <span className="text-[11px] font-black text-emerald-600 font-mono">
                                Save ₹{liveSavings.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-bold truncate text-gray-900 dark:text-gray-100" title={coupon.title}>
                            {coupon.title}
                          </h4>
                          <p className="text-[11px] text-gray-500 line-clamp-1">
                            {coupon.description || coupon.terms || 'Applicable on this order'}
                          </p>
                          {coupon.minOrderAmount != null && coupon.minOrderAmount > 0 && (
                            <p className="text-[10px] font-medium text-gray-400">
                              {activePrice >= coupon.minOrderAmount
                                ? '✓ Min. spend criteria met'
                                : `Min spend ₹${coupon.minOrderAmount.toFixed(2)}`}
                            </p>
                          )}
                        </div>

                        {/* Code + Copy button */}
                        <div className="flex items-center justify-between pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                          <span className="font-mono text-xs font-black tracking-wider px-2 py-0.5 rounded border border-dashed border-[var(--sf-primary)] text-[var(--sf-primary)] bg-[var(--sf-primary)]/5">
                            {coupon.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCoupon(coupon.code)}
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer ${
                              isCopied
                                ? 'bg-emerald-500 text-white'
                                : 'bg-[var(--sf-primary)]/10 text-[var(--sf-primary)] hover:bg-[var(--sf-primary)]/20'
                            }`}
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
                    className="w-full text-center text-xs font-bold pt-1 text-[var(--sf-primary)] hover:underline cursor-pointer"
                  >
                    {isCouponsExpanded ? 'Show Less Offers ▲' : `View All ${coupons.length} Offers ▼`}
                  </button>
                )}
              </div>
            )}

            {/* Quantity Selector & Add to Cart */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-2xl p-1 bg-gray-50 dark:bg-gray-800">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={isOutOfStock || quantity <= 1}
                    className="w-9 h-9 flex items-center justify-center font-bold text-sm hover:bg-white dark:hover:bg-gray-700 rounded-xl transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-sm font-mono">{isOutOfStock ? 0 : quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                    disabled={isOutOfStock || quantity >= stock}
                    className="w-9 h-9 flex items-center justify-center font-bold text-sm hover:bg-white dark:hover:bg-gray-700 rounded-xl transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || isOutOfStock}
                  className="flex-1 py-4 rounded-2xl font-bold text-sm text-white shadow-xl transition hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ backgroundColor: isOutOfStock ? '#64748b' : 'var(--sf-primary)' }}
                >
                  <span>{isAdding ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Bag'}</span>
                  <span>🛍️</span>
                </button>
              </div>

              {/* Express Buy Now */}
              {!isOutOfStock && (
                <Link
                  href="/checkout"
                  onClick={async () => {
                    await handleAddToCart();
                  }}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm text-center border-2 border-[var(--sf-primary)] text-[var(--sf-primary)] hover:bg-[var(--sf-primary)] hover:text-white transition block shadow-sm cursor-pointer"
                >
                  Instant Express Checkout →
                </Link>
              )}
            </div>

            {/* Value Props Banner */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 grid grid-cols-3 gap-2 text-center text-[11px]">
              <div>
                <span className="block text-base mb-0.5">🚚</span>
                <span className="font-bold block">Free Shipping</span>
                <span className="text-gray-400">On orders ₹999+</span>
              </div>
              <div>
                <span className="block text-base mb-0.5">🔄</span>
                <span className="font-bold block">Easy Returns</span>
                <span className="text-gray-400">7-Day Guarantee</span>
              </div>
              <div>
                <span className="block text-base mb-0.5">🔒</span>
                <span className="font-bold block">Safe Payment</span>
                <span className="text-gray-400">Razorpay & Stripe</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs (Description, Specs, Reviews) */}
        <div className="mt-16 pt-10 border-t border-gray-100 dark:border-gray-800">
          <div className="flex gap-8 border-b border-gray-100 dark:border-gray-800 mb-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-4 text-sm font-bold tracking-wide transition-all border-b-2 ${
                activeTab === 'description'
                  ? 'border-[var(--sf-primary)] text-[var(--sf-primary)]'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-4 text-sm font-bold tracking-wide transition-all border-b-2 ${
                activeTab === 'specs'
                  ? 'border-[var(--sf-primary)] text-[var(--sf-primary)]'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-sm font-bold tracking-wide transition-all border-b-2 flex items-center gap-2 ${
                activeTab === 'reviews'
                  ? 'border-[var(--sf-primary)] text-[var(--sf-primary)]'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <span>Customer Reviews</span>
              <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-800 font-extrabold">
                {totalReviewsCount}
              </span>
            </button>
          </div>

          <div className="max-w-4xl text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <p>{product.description || 'No detailed description available.'}</p>
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-500 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                <div className="py-3 flex justify-between">
                  <span className="font-semibold text-gray-700 dark:text-gray-200">Category</span>
                  <span>{product.categoryName || 'General'}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="font-semibold text-gray-700 dark:text-gray-200">Brand</span>
                  <span>{product.brandName || 'Store Brand'}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="font-semibold text-gray-700 dark:text-gray-200">SKU</span>
                  <span>{product.sku || product.id}</span>
                </div>
                {product.material && (
                  <div className="py-3 flex justify-between">
                    <span className="font-semibold text-gray-700 dark:text-gray-200">Material</span>
                    <span>{product.material}</span>
                  </div>
                )}
                {product.weight && (
                  <div className="py-3 flex justify-between">
                    <span className="font-semibold text-gray-700 dark:text-gray-200">Weight</span>
                    <span>{product.weight} kg</span>
                  </div>
                )}
              </div>
            )}

            {/* 🌟 ENHANCED REVIEWS TAB */}
            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Reviews Breakdown Header */}
                <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Score */}
                  <div className="md:col-span-4 text-center md:text-left space-y-1">
                    <span className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-gray-100">
                      {avgRating}
                    </span>
                    <div className="flex justify-center md:justify-start text-amber-400 text-base">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star}>{star <= Math.round(avgRating) ? '★' : '☆'}</span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">Based on {totalReviewsCount} verified reviews</p>
                  </div>

                  {/* Distribution Bars */}
                  <div className="md:col-span-5 space-y-1.5 text-xs">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = (starCounts as any)[stars] || 0;
                      const percentage = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;
                      return (
                        <div key={stars} className="flex items-center gap-2">
                          <span className="w-8 text-right font-bold text-gray-500">{stars}★</span>
                          <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="w-6 text-gray-400 font-mono text-[10px]">{count}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Write a Review Button */}
                  <div className="md:col-span-3 text-center md:text-right">
                    {isAuthenticated ? (
                      <button
                        type="button"
                        onClick={handleOpenWriteReview}
                        className="w-full sm:w-auto px-5 py-3 rounded-2xl font-bold text-xs text-white shadow-lg transition hover:opacity-90 active:scale-95 cursor-pointer"
                        style={{ backgroundColor: 'var(--sf-primary)' }}
                      >
                        ✏️ Write a Review
                      </button>
                    ) : (
                      <Link
                        href={`/auth/login?redirect=/products/${product.urlSlug || product.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold border border-gray-200 dark:border-gray-700 transition hover:bg-gray-50 dark:hover:bg-gray-800"
                        style={{ color: 'var(--sf-primary)' }}
                      >
                        <span>🔒</span> Log in to write a review
                      </Link>
                    )}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {isReviewsLoading ? (
                    <div className="p-12 text-center bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-3">
                      <div className="w-7 h-7 border-2 border-[var(--sf-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-xs text-gray-500 font-semibold">Loading verified customer reviews...</p>
                    </div>
                  ) : reviewsList.length > 0 ? (
                    reviewsList.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-sm text-gray-900 dark:text-gray-100">
                                {rev.userName || rev.customerName || 'Verified Customer'}
                              </span>
                              {rev.verified !== false && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800">
                                  ✓ Verified Buyer
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-amber-400 text-xs">
                                {'★'.repeat(rev.rating)}{'☆'.repeat(Math.max(0, 5 - rev.rating))}
                              </span>
                              <span className="text-[11px] text-gray-400">
                                {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {isReviewOwner(rev) && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditReview(rev)}
                                  className="text-xs font-semibold text-gray-600 hover:text-[var(--sf-primary)] px-2.5 py-1 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 transition flex items-center gap-1"
                                >
                                  ✏️ Edit
                                </button>
                                <button
                                  type="button"
                                  disabled={deletingReviewId === rev.id}
                                  onClick={() => handleDeleteReview(rev.id)}
                                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 transition flex items-center gap-1 disabled:opacity-50"
                                >
                                  🗑️ {deletingReviewId === rev.id ? 'Deleting…' : 'Delete'}
                                </button>
                              </>
                            )}
                            <button
                              type="button"
                              onClick={() => handleHelpfulToggle(rev.id)}
                              className={`text-xs font-semibold px-2.5 py-1 rounded-xl transition flex items-center gap-1 ${
                                hasUserLiked(rev)
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-700 dark:text-emerald-300 font-bold'
                                  : 'text-gray-500 hover:text-emerald-600 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100'
                              }`}
                              title={hasUserLiked(rev) ? 'Click to unlike' : 'Mark as helpful'}
                            >
                              <span>{hasUserLiked(rev) ? '👍 Liked' : '👍'}</span>
                              <span>{rev.helpfulCount || 0}</span>
                            </button>
                          </div>
                        </div>

                        {rev.title && (
                          <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">
                            {rev.title}
                          </h4>
                        )}

                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                          {rev.comment}
                        </p>

                        {/* Customer Uploaded Review Photo */}
                        {rev.imageUrl && (
                          <div className="pt-2">
                            <div className="inline-block relative group">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={rev.imageUrl}
                                alt="Customer review photo"
                                className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm transition hover:opacity-90 cursor-pointer"
                                onClick={() => window.open(rev.imageUrl!, '_blank')}
                              />
                              <span className="text-[10px] text-gray-400 block mt-1">🔍 Click to expand</span>
                            </div>
                          </div>
                        )}

                        {/* Merchant Official Reply Display */}
                        {rev.adminReply && (
                          <div className="mt-3 p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900 space-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-400">
                              <span>💬 Store Response</span>
                              <span className="text-[10px] text-gray-400">• Official Merchant</span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                              {rev.adminReply}
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-3">
                      <span className="text-3xl">⭐</span>
                      <p className="font-bold text-sm">No reviews yet</p>
                      <p className="text-xs text-gray-400 max-w-sm mx-auto">
                        Be the first to share your thoughts and help other shoppers!
                      </p>
                      {isAuthenticated ? (
                        <button
                          type="button"
                          onClick={handleOpenWriteReview}
                          className="px-5 py-2.5 rounded-2xl text-xs font-bold text-white shadow cursor-pointer hover:opacity-90 transition"
                          style={{ backgroundColor: 'var(--sf-primary)' }}
                        >
                          Write First Review
                        </button>
                      ) : (
                        <Link
                          href={`/auth/login?redirect=/products/${product.urlSlug || product.id}`}
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl text-xs font-bold text-white shadow hover:opacity-90 transition"
                          style={{ backgroundColor: 'var(--sf-primary)' }}
                        >
                          Log in to write first review →
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* WRITE / EDIT REVIEW MODAL */}
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

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight">You May Also Like</h2>
              <Link href="/products" className="text-sm font-semibold text-[var(--sf-primary)] hover:underline">
                View All Products →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <DefaultProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}
      </main>

      <DefaultFooter />
    </div>
  );
}
