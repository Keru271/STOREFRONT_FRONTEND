'use client';

import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/** Base Skeleton primitive with pulsing shimmer */
export const Skeleton: React.FC<SkeletonProps> = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/80 ${className}`}
      {...props}
    />
  );
};

/** Product Card Skeleton */
export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-3 sm:p-4 space-y-3 shadow-xs">
      {/* Product Image Box */}
      <Skeleton className="w-full aspect-square rounded-xl" />

      {/* Category / Brand Pill */}
      <Skeleton className="h-3.5 w-20 rounded-full" />

      {/* Product Title (2 lines) */}
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-4/5 rounded" />
        <Skeleton className="h-4 w-3/5 rounded" />
      </div>

      {/* Rating Stars Shimmer */}
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-3 h-3 rounded-full" />
        ))}
      </div>

      {/* Price & Add to Cart button */}
      <div className="flex items-center justify-between pt-1">
        <div className="space-y-1">
          <Skeleton className="h-5 w-16 rounded" />
          <Skeleton className="h-3 w-10 rounded" />
        </div>
        <Skeleton className="h-9 w-9 sm:w-24 rounded-xl" />
      </div>
    </div>
  );
};

/** PLP (Product Listing Page) Catalog Skeleton */
export const PLPSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Breadcrumb & Header Banner */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-40 rounded" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <Skeleton className="h-8 w-64 rounded-xl" />
            <Skeleton className="h-4 w-80 max-w-full rounded" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-36 rounded-xl" />
            <Skeleton className="h-10 w-28 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Main Catalog Layout (Sidebar + Product Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar Skeleton */}
        <div className="hidden lg:block space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <Skeleton className="h-5 w-20 rounded" />
              <Skeleton className="h-4 w-12 rounded" />
            </div>

            {/* Filter Group 1: Categories */}
            <div className="space-y-2.5">
              <Skeleton className="h-4 w-28 rounded" />
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-3 w-6 rounded" />
                </div>
              ))}
            </div>

            {/* Filter Group 2: Price Range Slider */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-2 w-full rounded-full" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-10 rounded" />
                <Skeleton className="h-3 w-10 rounded" />
              </div>
            </div>

            {/* Filter Group 3: Colors */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Skeleton className="h-4 w-20 rounded" />
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="w-6 h-6 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid Skeleton (8 Items) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/** PDP (Product Detail Page) Skeleton */
export const PDPSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Breadcrumb */}
      <Skeleton className="h-4 w-52 rounded" />

      {/* Main 2-Column Product Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <Skeleton className="w-full aspect-square rounded-3xl" />
          <div className="flex items-center gap-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="w-20 h-20 rounded-2xl shrink-0" />
            ))}
          </div>
        </div>

        {/* Right Column: Purchasing & Product Info */}
        <div className="space-y-6">
          {/* Badge & Title */}
          <div className="space-y-2.5">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-9 w-4/5 rounded-xl" />
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="w-3.5 h-3.5 rounded-full" />
                ))}
              </div>
              <Skeleton className="h-4 w-28 rounded" />
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <Skeleton className="h-8 w-28 rounded-lg" />
            <Skeleton className="h-5 w-20 rounded line-through" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>

          {/* Variants Selector (Color / Size) */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 rounded" />
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="w-8 h-8 rounded-full" />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-16 rounded" />
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-9 w-14 rounded-xl" />
                ))}
              </div>
            </div>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              <Skeleton className="h-12 w-28 rounded-xl" />
              <Skeleton className="h-12 flex-1 rounded-xl" />
            </div>
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                <Skeleton className="w-6 h-6 rounded-lg" />
                <Skeleton className="h-3 w-16 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/** Cart Page Skeleton */
export const CartSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <Skeleton className="h-8 w-44 rounded-xl" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-4"
            >
              <Skeleton className="w-20 h-20 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/3 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
              </div>
              <div className="space-y-2 text-right">
                <Skeleton className="h-8 w-24 rounded-lg" />
                <Skeleton className="h-3 w-8 ml-auto rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Box (1 col) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-5 h-fit">
          <Skeleton className="h-6 w-36 rounded-lg" />
          <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-4 w-16 rounded" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-4 w-12 rounded" />
            </div>
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-5 w-20 rounded" />
            <Skeleton className="h-6 w-24 rounded" />
          </div>
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

/** Order Card Skeleton */
export const OrderCardSkeleton: React.FC = () => {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-40 rounded" />
          <Skeleton className="h-3.5 w-32 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="w-14 h-14 rounded-xl shrink-0" />
          ))}
        </div>
        <div className="text-right space-y-1.5">
          <Skeleton className="h-3 w-16 ml-auto rounded" />
          <Skeleton className="h-6 w-24 ml-auto rounded-lg" />
          <Skeleton className="h-8 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

/** Orders List Skeleton */
export const OrdersListSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 py-12 px-4 sm:px-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-8 w-44 rounded-xl" />
          <Skeleton className="h-4 w-60 rounded" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full shrink-0" />
        ))}
      </div>

      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <OrderCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

/** Order Detail Page Skeleton */
export const OrderDetailSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
      <Skeleton className="h-4 w-32 rounded" />

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48 rounded-xl" />
            <Skeleton className="h-3.5 w-36 rounded" />
          </div>
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>

        {/* Progress Tracker Strip */}
        <div className="grid grid-cols-4 gap-2 pt-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2 text-center">
              <Skeleton className="h-2 w-full rounded-full" />
              <Skeleton className="h-3 w-16 mx-auto rounded" />
            </div>
          ))}
        </div>

        {/* Itemized Products */}
        <div className="space-y-3 pt-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-t border-slate-100 dark:border-slate-800">
              <Skeleton className="w-16 h-16 rounded-xl shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-2/3 rounded" />
                <Skeleton className="h-3 w-28 rounded" />
              </div>
              <Skeleton className="h-4 w-16 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/** Home Page Skeleton */
export const HomePageSkeleton: React.FC = () => {
  return (
    <div className="space-y-14 pb-16">
      {/* Hero Banner Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="w-full aspect-[21/9] min-h-[360px] rounded-3xl bg-slate-200 dark:bg-slate-800 p-8 sm:p-14 flex flex-col justify-center space-y-4">
          <Skeleton className="h-5 w-32 rounded-full" />
          <Skeleton className="h-10 sm:h-14 w-3/5 rounded-2xl" />
          <Skeleton className="h-4 w-2/5 rounded" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-12 w-36 rounded-2xl" />
            <Skeleton className="h-12 w-36 rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Featured Categories Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-44 rounded-lg" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center space-y-2">
              <Skeleton className="w-14 h-14 rounded-full" />
              <Skeleton className="h-3.5 w-16 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-7 w-48 rounded-xl" />
            <Skeleton className="h-4 w-64 rounded" />
          </div>
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};
