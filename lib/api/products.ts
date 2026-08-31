import { apiClient } from './client';
import type { Product, ProductDetail, ProductsQueryParams, ProductReview, FilterFacetsResponse, SearchSuggestionsResponse, ProductStockResponse, EligibleCoupon } from './types';

// Backend wraps the list response in this shape
interface ProductsApiResponse {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Fetches a list of products with optional filtering (getProducts).
 * Cached for 60 seconds on the server.
 */
export async function getProducts(params?: ProductsQueryParams): Promise<Product[]> {
  const searchParams = new URLSearchParams();

  if (params) {
    const brandsVal = Array.isArray(params.brands) ? params.brands.join(',') : params.brands || params.brand;
    const categoriesVal = Array.isArray(params.categories) ? params.categories.join(',') : params.categories || params.category;
    const searchVal = params.search || params.q;

    const mapped: Record<string, string> = {
      ...(params.page != null ? { page: String(params.page) } : {}),
      ...(params.limit != null ? { limit: String(params.limit) } : {}),
      ...(searchVal ? { search: searchVal } : {}),
      ...(categoriesVal ? { categories: categoriesVal } : {}),
      ...(brandsVal ? { brands: brandsVal } : {}),
      ...(params.collection ? { collection: params.collection } : {}),
      ...(params.minPrice != null ? { minPrice: String(params.minPrice) } : {}),
      ...(params.maxPrice != null ? { maxPrice: String(params.maxPrice) } : {}),
      ...(params.discount != null ? { discount: String(params.discount) } : {}),
      ...(params.minDiscount != null ? { minDiscount: String(params.minDiscount) } : {}),
      ...(params.gender ? { gender: params.gender } : {}),
      ...(params.sort ? { sortBy: params.sort } : {}),
    };
    Object.entries(mapped).forEach(([key, value]) => searchParams.set(key, value));
  }

  const queryString = searchParams.toString();
  const endpoint = `api/storefront/products${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await apiClient.get<ProductsApiResponse>(endpoint, {
      next: { revalidate: 60, tags: ['products'] },
    });
    return Array.isArray(response) ? response : (response.products ?? []);
  } catch {
    return [];
  }
}

/**
 * Fetches dynamic facet counts and ranges for categories, brands, price bounds, discounts, and genders.
 */
export async function getFilterFacets(): Promise<FilterFacetsResponse | null> {
  try {
    return await apiClient.get<FilterFacetsResponse>('api/storefront/catalog/filters', {
      next: { revalidate: 60, tags: ['filters'] },
    });
  } catch {
    return null;
  }
}

/**
 * Fetches instant live search auto-complete suggestions (matching products, categories, brands, popular searches).
 */
export async function getSearchSuggestions(query?: string, category?: string, limit?: number): Promise<SearchSuggestionsResponse | null> {
  const params = new URLSearchParams();
  if (query) params.set('q', query.trim());
  if (category && category !== 'all') params.set('category', category);
  if (limit) params.set('limit', String(limit));

  const qs = params.toString();
  try {
    return await apiClient.get<SearchSuggestionsResponse>(
      `api/storefront/products/suggestions${qs ? `?${qs}` : ''}`
    );
  } catch {
    return null;
  }
}

/**
 * Fetches detailed info for a single product by ID or URL slug (getProductsDetails).
 * Cached for 60 seconds on the server.
 */
export async function getProductDetail(idOrSlug: string): Promise<ProductDetail | null> {
  try {
    return await apiClient.get<ProductDetail>(
      `api/storefront/products/${encodeURIComponent(idOrSlug)}`,
      { next: { revalidate: 60, tags: ['products', `product-${idOrSlug}`] } }
    );
  } catch {
    return null;
  }
}

/**
 * Alias for getProductDetail.
 */
export const getProductsDetails = getProductDetail;

const inFlightReviewsMap = new Map<string, Promise<{
  productId: string;
  reviews: ProductReview[];
  total: number;
  averageRating: number;
}>>();

/**
 * Fetch approved customer reviews for a specific product with in-flight deduplication.
 */
export async function getProductReviews(productIdOrSlug: string): Promise<{
  productId: string;
  reviews: ProductReview[];
  total: number;
  averageRating: number;
}> {
  const key = String(productIdOrSlug || '').trim();
  if (inFlightReviewsMap.has(key)) {
    return inFlightReviewsMap.get(key)!;
  }

  const promise = apiClient.get<{
    productId: string;
    reviews: ProductReview[];
    total: number;
    averageRating: number;
  }>(`api/storefront/products/${encodeURIComponent(productIdOrSlug)}/reviews`);

  inFlightReviewsMap.set(key, promise);

  try {
    const res = await promise;
    return res;
  } catch (err) {
    inFlightReviewsMap.delete(key);
    throw err;
  }
}

/**
 * Post a new customer review for a product.
 */
export async function postProductReview(
  productId: string,
  review: {
    userName?: string;
    userEmail?: string;
    rating: number;
    title?: string;
    comment: string;
    imageUrl?: string;
  }
): Promise<{ success: boolean; message: string; review: ProductReview }> {
  return await apiClient.post<{ success: boolean; message: string; review: ProductReview }>(
    `api/storefront/products/${encodeURIComponent(productId)}/reviews`,
    review
  );
}

/**
 * Edit an existing customer review.
 */
export async function editProductReview(
  productId: string,
  reviewId: string,
  review: {
    userName?: string;
    rating?: number;
    title?: string;
    comment?: string;
    imageUrl?: string;
  }
): Promise<{ success: boolean; message: string; review: ProductReview }> {
  return await apiClient.put<{ success: boolean; message: string; review: ProductReview }>(
    `api/storefront/products/${encodeURIComponent(productId)}/reviews/${encodeURIComponent(reviewId)}`,
    review
  );
}

/**
 * Delete a customer review (only author allowed).
 */
export async function deleteProductReview(
  productId: string,
  reviewId: string
): Promise<{ success: boolean; message: string }> {
  return await apiClient.delete<{ success: boolean; message: string }>(
    `api/storefront/products/${encodeURIComponent(productId)}/reviews/${encodeURIComponent(reviewId)}`
  );
}

/**
 * Upvote or toggle like on a review's helpfulness.
 */
export async function upvoteProductReview(
  productId: string,
  reviewId: string,
  userIdentifier?: string
): Promise<{ success: boolean; helpfulCount: number; hasLiked?: boolean; likedBy?: string[] }> {
  return await apiClient.post<{ success: boolean; helpfulCount: number; hasLiked?: boolean; likedBy?: string[] }>(
    `api/storefront/products/${encodeURIComponent(productId)}/reviews/${encodeURIComponent(reviewId)}/helpful`,
    userIdentifier ? { userIdentifier } : {}
  );
}

/**
 * Checks real-time product or variant stock in the database.
 * Never cached (revalidate: 0).
 */
export async function getProductStock(
  idOrSlug: string,
  variantId?: string
): Promise<ProductStockResponse> {
  const query = variantId ? `?variantId=${encodeURIComponent(variantId)}` : '';
  return await apiClient.get<ProductStockResponse>(
    `api/storefront/products/${encodeURIComponent(idOrSlug)}/stock${query}`,
    { next: { revalidate: 0 } }
  );
}

/**
 * Fetches eligible discounts/coupons applicable to a product in real-time.
 */
export async function getProductEligibleCoupons(
  idOrSlug: string,
  price?: number
): Promise<EligibleCoupon[]> {
  const query = price !== undefined ? `?price=${encodeURIComponent(price)}` : '';
  return await apiClient.get<EligibleCoupon[]>(
    `api/storefront/discounts/product/${encodeURIComponent(idOrSlug)}${query}`,
    { next: { revalidate: 0 } }
  );
}

