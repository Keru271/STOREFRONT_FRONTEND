// ─── Storefront API Types ───────────────────────────────────────────────────
// All interfaces are derived directly from the storefront-backend Zod schemas.
// Do NOT add hardcoded values here — everything flows from the backend config.

// ── Theme & Store Config ─────────────────────────────────────────────────────

export interface ThemeConfig {
  storeName: string;
  slug: string;
  logo?: string | null;
  favicon?: string | null;
  description?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
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
  themeBodyFont?: string | null;
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

  // SEO
  seoSiteTitle?: string | null;
  seoMetaDescription?: string | null;
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
  options?: Record<string, string>;
}

export interface ProductReview {
  id: string;
  rating: number;
  comment?: string | null;
  customerName?: string | null;
  createdAt?: string;
}

export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  search?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  collection?: string;
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
  id: string;
  label: string;
  url: string;
  children?: MenuItem[];
}

export interface Menu {
  id: string;
  title: string;
  handle: string;
  location: string;
  items: MenuItem[];
}

// ── Customer / Auth ───────────────────────────────────────────────────────────

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

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  customer: CustomerProfile;
}

// ── Orders ────────────────────────────────────────────────────────────────────

export interface Order {
  id: string;
  status: string;
  total: number;
  currency: string;
  items: OrderItem[];
  createdAt?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
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
