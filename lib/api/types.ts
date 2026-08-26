// ─── Storefront API Types ───────────────────────────────────────────────────
// All interfaces are derived directly from the storefront-backend Zod schemas.

// ── Theme & Store Config ─────────────────────────────────────────────────────

export interface ThemeConfig {
  id?: string;
  storeName: string;
  slug: string;
  logo?: string | null;
  favicon?: string | null;
  description?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  legalBusinessName?: string | null;
  addressStreet?: string | null;
  addressCity?: string | null;
  addressState?: string | null;
  addressZip?: string | null;
  addressCountry?: string | null;
  currency: string;
  language: string;
  timezone: string;

  // Template
  activeTemplateSlug?: string | null;

  // Colors (all map to CSS custom properties at runtime)
  themePrimaryColor?: string | null;
  themeSecondaryColor?: string | null;
  themeBackgroundColor?: string | null;
  themeTextColor?: string | null;
  themeAccentColor?: string | null;

  // Typography
  themeHeadingFont?: string | null;
  themeHeadingFontUrl?: string | null;
  themeBodyFont?: string | null;
  themeBodyFontUrl?: string | null;
  themeFontSize?: string | null;

  // Layout
  themeBorderRadius?: string | null;
  themeButtonStyle?: string | null;
  themeLayoutWidth?: string | null;

  // Header
  headerStyle?: string | null;
  headerSticky?: boolean | null;
  headerAnnouncement?: string | null;
  headerShowSearch?: boolean | null;
  headerShowCurrency?: boolean | null;

  // Footer
  footerStyle?: string | null;
  footerCopyright?: string | null;
  footerShowSocial?: boolean | null;
  footerShowNewsletter?: boolean | null;
  footerShowPaymentBadges?: boolean | null;

  // Social Links
  socialFacebook?: string | null;
  socialInstagram?: string | null;
  socialTwitter?: string | null;
  socialLinkedin?: string | null;
  socialYoutube?: string | null;
  socialTiktok?: string | null;
  socialPinterest?: string | null;

  // SEO
  seoSiteTitle?: string | null;
  seoMetaDescription?: string | null;
  seoCanonicalUrl?: string | null;
  seoOgTitle?: string | null;
  seoOgDescription?: string | null;
  seoOgImage?: string | null;
  seoRobotsTxt?: string | null;
  seoStructuredDataJson?: string | null;

  // Checkout, Shipping, Taxes & Payment Config
  shippingFreeThreshold?: number | null;
  shippingFlatRate?: number | null;
  taxName?: string | null;
  taxNumber?: string | null;
  taxRateStandard?: number | null;
  taxInclusive?: boolean | null;
  checkoutGuestAllowed?: boolean | null;
  checkoutPhoneRequired?: boolean | null;
  checkoutOrderNotes?: boolean | null;
  paymentStripeActive?: boolean | null;
  paymentRazorpayActive?: boolean | null;
  paymentCodActive?: boolean | null;
  paymentTestMode?: boolean | null;
}

export interface StoreInfo {
  id?: string;
  storeName: string;
  slug: string;
  logo?: string | null;
  favicon?: string | null;
  description?: string | null;
  seoSiteTitle?: string | null;
  seoMetaDescription?: string | null;
  seoCanonicalUrl?: string | null;
  seoOgTitle?: string | null;
  seoOgDescription?: string | null;
  seoOgImage?: string | null;
  seoRobotsTxt?: string | null;
  seoStructuredDataJson?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  addressStreet?: string | null;
  addressCity?: string | null;
  addressState?: string | null;
  addressZip?: string | null;
  addressCountry?: string | null;
  currency: string;
  language: string;
  timezone?: string;
  activeTemplateSlug?: string | null;
}

// ── Products ─────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  images: string[];
  image?: string;
  sku?: string | null;
  price: number;
  compareAtPrice?: number | null;
  costPrice?: number | null;
  taxRate?: number | null;
  taxable?: boolean;
  isTaxInclusive?: boolean;
  inventory: number;
  stockQuantity: number;
  brandName?: string | null;
  categoryName?: string | null;
  category?: string;
  collectionName?: string | null;
  status: string;
  urlSlug?: string | null;
  createdAt?: string;
}

export interface ProductDetail extends Product {
  weight?: number | null;
  dimensions?: string | null;
  sizeOptions?: string[];
  colorOptions?: string[];
  material?: string | null;
  tags?: string[];
  variants?: ProductVariant[];
  reviews?: ProductReview[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  structuredDataJson?: string | null;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  sku?: string | null;
  inventory: number;
  image?: string;
  options?: Record<string, string>;
}

export interface ProductReview {
  id: string;
  productId?: string;
  userName?: string;
  customerName?: string;
  userEmail?: string | null;
  rating: number;
  title?: string | null;
  comment?: string | null;
  verified?: boolean;
  status?: 'APPROVED' | 'PENDING' | 'REJECTED' | 'SPAM' | string;
  adminReply?: string | null;
  adminReplyAt?: string | null;
  helpfulCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  categories?: string | string[];
  brand?: string;
  brands?: string | string[];
  search?: string;
  q?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'name' | 'popular' | 'rating' | string;
  minPrice?: number;
  maxPrice?: number;
  discount?: number;
  minDiscount?: number;
  gender?: string;
  collection?: string;
}

export interface FilterFacetCategory {
  id?: string;
  name: string;
  slug: string;
  count: number;
}

export interface FilterFacetBrand {
  id?: string;
  name: string;
  slug: string;
  count: number;
}

export interface FilterFacetDiscount {
  label: string;
  value: number;
  count: number;
}

export interface FilterFacetGender {
  label: string;
  value: string;
  count: number;
}

export interface FilterFacetsResponse {
  categories: FilterFacetCategory[];
  brands: FilterFacetBrand[];
  priceRange: {
    min: number;
    max: number;
  };
  discounts: FilterFacetDiscount[];
  genders: FilterFacetGender[];
}

export interface ProductSuggestion {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
  categoryName?: string;
  brandName?: string | null;
  stockQuantity?: number;
  urlSlug?: string;
}

export interface SearchSuggestionsResponse {
  query: string;
  products: ProductSuggestion[];
  categories: Array<{ id: string; name: string; slug: string }>;
  brands: Array<{ id: string; name: string; slug: string }>;
  popularSearches?: string[];
  total: number;
}

export interface CmsPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  pageType: 'CUSTOM' | 'BRAND' | 'POLICY' | 'SYSTEM' | 'HOME' | string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  structuredDataJson?: string | null;
  status: string;
  storeId?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItemOption {
  size?: string;
  color?: string;
  material?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  sku?: string;
  price: number;
  image?: string;
  quantity: number;
  stockQuantity?: number;
  isOutOfStock?: boolean;
  options?: CartItemOption;
  totalPrice: number;
}

export interface Cart {
  id?: string;
  cartToken: string;
  customerName?: string | null;
  customerEmail?: string | null;
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
  message?: string;
  updatedAt?: string;
}

export interface AddToCartInput {
  cartToken?: string;
  productId: string;
  variantId?: string;
  quantity?: number;
  options?: CartItemOption;
}

export interface UpdateCartInput {
  cartToken: string;
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface RemoveCartInput {
  cartToken: string;
  productId: string;
  variantId?: string;
}

// ── Wishlist ─────────────────────────────────────────────────────────────────

export interface WishlistItem extends Product {}

export interface WishlistResponse {
  message?: string;
  productIds: string[];
  items: WishlistItem[];
  count: number;
}

export interface AddToWishlistInput {
  productId: string;
  customerEmail?: string;
  token?: string;
}

export interface RemoveFromWishlistInput {
  productId: string;
  customerEmail?: string;
  token?: string;
}

// ── Catalog ───────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  description?: string | null;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  description?: string | null;
  type: string;
  featured: boolean;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
}

export interface MenuItem {
  id?: string;
  label?: string;
  title?: string;
  url?: string;
  href?: string;
  target?: string;
  type?: string;
  children?: MenuItem[];
}

export interface Menu {
  id: string;
  title: string;
  handle: string;
  location: string;
  items: MenuItem[];
  storeId?: string | null;
}

// ── Customer / Account / Auth ─────────────────────────────────────────────────

export interface CustomerAddress {
  id?: string;
  label?: 'HOME' | 'OFFICE' | 'OTHER' | string;
  name?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  isDefault?: boolean;
}

export interface CustomerRegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface CustomerLoginInput {
  email: string;
  password: string;
}

export interface EditCustomerInput {
  name?: string;
  phone?: string;
  address?: CustomerAddress;
  addresses?: CustomerAddress[];
  addressJson?: string;
  acceptsMarketing?: boolean;
  currentPassword?: string;
  newPassword?: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role?: string;
  createdAt?: string;
}

export interface CustomerInfo {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  group?: string;
  address?: CustomerAddress | null;
  addresses?: CustomerAddress[];
  addressJson?: string | null;
  acceptsMarketing?: boolean;
  totalOrders?: number;
  totalSpent?: number;
  wishlistCount?: number;
  recentOrders?: Order[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  message?: string;
  accessToken?: string;
  token?: string;
  user?: CustomerProfile;
  customer?: CustomerProfile;
}

// ── Orders ────────────────────────────────────────────────────────────────────

export interface Order {
  id: string;
  orderNumber?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  status?: string;
  paymentStatus?: string;
  fulfillmentStatus?: string;
  subtotalAmount?: number;
  taxAmount?: number;
  shippingAmount?: number;
  totalAmount?: number;
  total?: number;
  currency?: string;
  items?: OrderItem[];
  itemsJson?: string;
  shippingAddressJson?: string;
  carrier?: string | null;
  trackingNumber?: string | null;
  notesJson?: string | null;
  storeId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  id?: string;
  productId?: string;
  productName?: string;
  name?: string;
  quantity: number;
  price: number;
  unitPrice?: number;
  subtotal?: number;
  sku?: string;
  image?: string;
}

// ── API Response Wrappers ─────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
}

// ── Checkout & Multi-Gateway Payment Types ────────────────────────────────────

export interface CheckoutAddress {
  street: string;
  city: string;
  state?: string;
  zip: string;
  country: string;
}

export interface CheckoutCartItemPayload {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  sku?: string;
  image?: string;
}

export interface CheckoutSummaryResponse {
  subtotal: number;
  discountSavings: number;
  discountedSubtotal: number;
  appliedCoupon: string | null;
  taxRate: number;
  taxAmount: number;
  shippingFee: number;
  grandTotal: number;
  currency: string;
  isTaxInclusive?: boolean;
  stockValid?: boolean;
  stockMessage?: string;
  outOfStockItem?: any;
}

export interface ValidateCouponResponse {
  valid: boolean;
  isAutomatic?: boolean;
  code?: string;
  title?: string;
  discountType?: string;
  value?: number;
  savings: number;
  newSubtotal?: number;
  message: string;
}

export interface AvailablePaymentMethodsResponse {
  country: string;
  currency: string;
  isDomesticIndia: boolean;
  recommendedGateway: 'RAZORPAY' | 'STRIPE';
  gateways: {
    razorpay: {
      enabled: boolean;
      keyId: string | null;
      testMode: boolean;
      supportedMethods: string[];
      ratesDescription: string;
      popularIn: string[];
    };
    stripe: {
      enabled: boolean;
      publishableKey: string | null;
      testMode: boolean;
      supportedMethods: string[];
      ratesDescription: string;
      popularIn: string[];
    };
    cod: {
      enabled: boolean;
      handlingFee: number;
      minLimit: number;
      maxLimit: number;
    };
  };
}

export interface RazorpayOrderResponse {
  success: boolean;
  gateway: 'RAZORPAY';
  keyId: string;
  razorpayOrderId: string;
  orderNumber: string;
  amount: number;
  displayAmount: number;
  currency: string;
  pricing: CheckoutSummaryResponse;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  notes?: Record<string, string>;
}

export interface StripeIntentResponse {
  success: boolean;
  gateway: 'STRIPE';
  publishableKey: string;
  clientSecret: string;
  orderNumber: string;
  amount: number;
  displayAmount: number;
  currency: string;
  pricing: CheckoutSummaryResponse;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
}

export interface OrderPlacedResponse {
  success: boolean;
  message: string;
  order: {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    totalAmount: number;
    currency: string;
    paymentStatus: string;
    fulfillmentStatus: string;
    paymentId?: string;
    createdAt: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  author?: string | null;
  featuredImage?: string | null;
  category?: string | null;
  tags?: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';
  publishedAt?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: string | null;
  canonicalUrl?: string | null;
  relatedProductIds?: string | null;
  relatedProducts?: Product[];
  storeId?: string | null;
  createdAt: string;
  updatedAt: string;
}
