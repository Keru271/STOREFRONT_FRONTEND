// ─── Storefront API SDK Index ──────────────────────────────────────────────────
// Central entrypoint exporting all storefront APIs.
// 1. getProducts / getProductsDetails
// 2. addToWishlist / deleteFromWishlist
// 3. addToCart / deleteToCart
// 4. getInfo / editInfo
// 5. searchProducts
// 6. Catalog: categories, collections, brands, menus, pages
// 7. Checkout: Razorpay, Stripe, COD

export { apiClient, ApiError } from './client';

// 1 & 2. Product APIs
export {
  getProducts,
  getFilterFacets,
  getSearchSuggestions,
  getProductDetail,
  getProductsDetails,
  getProductReviews,
  postProductReview,
  editProductReview,
  upvoteProductReview,
  getProductStock,
  getProductEligibleCoupons,
} from './products';

// 3 & 4. Wishlist APIs
export {
  getWishlist,
  addToWishlist,
  deleteFromWishlist,
  removeFromWishlist,
  clearWishlist,
} from './wishlist';

// 5 & 6. Cart APIs
export {
  getCart,
  addToCart,
  deleteToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
} from './cart';

// 7 & 8. Customer Profile / Account APIs
export {
  getInfo,
  editInfo,
  getCustomerProfile,
  editCustomerProfile,
  registerCustomer,
  loginCustomer,
  logoutCustomer,
  forgotPassword,
  verifyOtp,
  resetPassword,
  getCustomerOrders,
  getCustomerOrder,
} from './customer';

// Catalog & Theme APIs
export { getTheme, getStoreInfo } from './theme';
export {
  getCategories,
  getCollections,
  getCollectionBySlug,
  getBrands,
  getMenus,
  getMenu,
  getPage,
} from './catalog';

// Search API
export { searchProducts } from './search';

// Checkout & Multi-Gateway Payment APIs
export {
  validateCoupon,
  getAvailablePaymentMethods,
  getCheckoutSummary,
  createRazorpayOrder,
  verifyRazorpayPayment,
  createStripePaymentIntent,
  verifyStripePayment,
  processDirectCheckout,
} from './checkout';

// Shipping & Logistics APIs
export {
  checkShippingServiceability,
  getShippingRateQuotes,
  trackShipmentAwb,
} from './shipping';

// All Type Definitions
export * from './types';

