// ─── Template Registry ────────────────────────────────────────────────────────
// Maps activeTemplateSlug (from backend) to the correct set of page components.
//
// Uses Next.js dynamic() imports for code-splitting and on-demand chunk loading,
// ensuring stores only download the bundle for their active template.
//
// To add a new template:
//   1. Create a folder: templates/<your-slug>/
//   2. Export the required page components from it
//   3. Add the entry to TEMPLATE_REGISTRY below
//
// The slug must match exactly what the CMS admin stores in `activeTemplateSlug`.

import dynamic from 'next/dynamic';
import type {
  ThemeConfig,
  Product,
  ProductDetail,
  Collection,
  Category,
  Brand,
  FilterFacetsResponse,
} from '@/lib/api/types';

// Default template (dynamic chunks)
const DefaultHeader = dynamic(() => import('./default/Header'));
const DefaultFooter = dynamic(() => import('./default/Footer'));
const DefaultHomePage = dynamic(() => import('./default/HomePage'));
const DefaultPLPPage = dynamic(() => import('./default/PLPPage'));
const DefaultLoginPage = dynamic(() => import('./default/LoginPage'));
const DefaultSignupPage = dynamic(() => import('./default/SignupPage'));
const DefaultForgotPasswordPage = dynamic(() => import('./default/ForgotPasswordPage'));
const DefaultPDPPage = dynamic(() => import('./default/PDPPage'));
const DefaultWishlistPage = dynamic(() => import('./default/WishlistPage'));
const DefaultCartPage = dynamic(() => import('./default/CartPage'));
const DefaultAccountPage = dynamic(() => import('./default/AccountPage'));
const DefaultSupportPage = dynamic(() => import('./default/SupportPage'));

// Minimal template (dynamic chunks)
const MinimalHeader = dynamic(() => import('./minimal/Header'));
const MinimalFooter = dynamic(() => import('./minimal/Footer'));
const MinimalHomePage = dynamic(() => import('./minimal/HomePage'));
const MinimalPLPPage = dynamic(() => import('./minimal/PLPPage'));
const MinimalLoginPage = dynamic(() => import('./minimal/LoginPage'));
const MinimalSignupPage = dynamic(() => import('./minimal/SignupPage'));
const MinimalForgotPasswordPage = dynamic(() => import('./minimal/ForgotPasswordPage'));
const MinimalPDPPage = dynamic(() => import('./minimal/PDPPage'));
const MinimalWishlistPage = dynamic(() => import('./minimal/WishlistPage'));
const MinimalCartPage = dynamic(() => import('./minimal/CartPage'));
const MinimalAccountPage = dynamic(() => import('./minimal/AccountPage'));
const MinimalSupportPage = dynamic(() => import('./minimal/SupportPage'));

// Luxe template (dynamic chunks)
const LuxeHeader = dynamic(() => import('./luxe/Header'));
const LuxeFooter = dynamic(() => import('./luxe/Footer'));
const LuxeHomePage = dynamic(() => import('./luxe/HomePage'));
const LuxePLPPage = dynamic(() => import('./luxe/PLPPage'));
const LuxeLoginPage = dynamic(() => import('./luxe/LoginPage'));
const LuxeSignupPage = dynamic(() => import('./luxe/SignupPage'));
const LuxeForgotPasswordPage = dynamic(() => import('./luxe/ForgotPasswordPage'));
const LuxePDPPage = dynamic(() => import('./luxe/PDPPage'));
const LuxeWishlistPage = dynamic(() => import('./luxe/WishlistPage'));
const LuxeCartPage = dynamic(() => import('./luxe/CartPage'));
const LuxeAccountPage = dynamic(() => import('./luxe/AccountPage'));
const LuxeSupportPage = dynamic(() => import('./luxe/SupportPage'));

// Nova template (Apple Design System - dynamic chunks, aliases to minimal)
const NovaHeader = MinimalHeader;
const NovaFooter = MinimalFooter;
const NovaHomePage = MinimalHomePage;
const NovaPLPPage = MinimalPLPPage;
const NovaLoginPage = MinimalLoginPage;
const NovaSignupPage = MinimalSignupPage;
const NovaForgotPasswordPage = MinimalForgotPasswordPage;
const NovaPDPPage = MinimalPDPPage;
const NovaWishlistPage = MinimalWishlistPage;
const NovaCartPage = MinimalCartPage;
const NovaAccountPage = MinimalAccountPage;
const NovaSupportPage = MinimalSupportPage;

// Mincom template (Modern Furniture & Living - dynamic chunks)
const MincomHeader = dynamic(() => import('./mincom/Header'));
const MincomFooter = dynamic(() => import('./mincom/Footer'));
const MincomHomePage = dynamic(() => import('./mincom/HomePage'));
const MincomPLPPage = dynamic(() => import('./mincom/PLPPage'));
const MincomLoginPage = dynamic(() => import('./mincom/LoginPage'));
const MincomSignupPage = dynamic(() => import('./mincom/SignupPage'));
const MincomForgotPasswordPage = dynamic(() => import('./mincom/ForgotPasswordPage'));
const MincomPDPPage = dynamic(() => import('./mincom/PDPPage'));
const MincomWishlistPage = dynamic(() => import('./mincom/WishlistPage'));
const MincomCartPage = dynamic(() => import('./mincom/CartPage'));
const MincomAccountPage = dynamic(() => import('./mincom/AccountPage'));
const MincomSupportPage = dynamic(() => import('./mincom/SupportPage'));

// Funo template (Scandinavian Modern Furniture & Decor - dynamic chunks)
const FunoHeader = dynamic(() => import('./funo/Header'));
const FunoFooter = dynamic(() => import('./funo/Footer'));
const FunoHomePage = dynamic(() => import('./funo/HomePage'));
const FunoPLPPage = dynamic(() => import('./funo/PLPPage'));
const FunoLoginPage = dynamic(() => import('./funo/LoginPage'));
const FunoSignupPage = dynamic(() => import('./funo/SignupPage'));
const FunoForgotPasswordPage = dynamic(() => import('./funo/ForgotPasswordPage'));
const FunoPDPPage = dynamic(() => import('./funo/PDPPage'));
const FunoWishlistPage = dynamic(() => import('./funo/WishlistPage'));
const FunoCartPage = dynamic(() => import('./funo/CartPage'));
const FunoAccountPage = dynamic(() => import('./funo/AccountPage'));
const FunoSupportPage = dynamic(() => import('./funo/SupportPage'));

// ── Shared Prop Interfaces ────────────────────────────────────────────────────
// All page components in all templates must satisfy these contracts.

export interface HomePageProps {
  theme: ThemeConfig;
  products: Product[];
  collections: Collection[];
  categories: Category[];
}

export interface PLPPageProps {
  theme: ThemeConfig;
  products: Product[];
  categories: Category[];
  brands: Brand[];
  filterFacets?: FilterFacetsResponse | null;
  searchParams: Record<string, string | string[] | undefined>;
}

export interface AuthPageProps {
  theme: ThemeConfig;
}

/**
 * PDPPageProps — per-template product detail page.
 */
export interface PDPPageProps {
  theme: ThemeConfig;
  product: ProductDetail;
  relatedProducts: Product[];
}

/**
 * WishlistPageProps — per-template wishlist page.
 */
export interface WishlistPageProps {
  theme: ThemeConfig;
}

/**
 * CartPageProps — per-template cart page.
 */
export interface CartPageProps {
  theme: ThemeConfig;
}

/**
 * AccountPageProps — per-template account page.
 */
export interface AccountPageProps {
  theme: ThemeConfig;
}

/**
 * CollectionsPageProps — used by optional per-template collections index.
 */
export interface CollectionsPageProps {
  theme: ThemeConfig;
  collections: Collection[];
}

/**
 * SupportPageProps — per-template customer support and help center page.
 */
export interface SupportPageProps {
  theme: ThemeConfig;
}

export interface TemplateComponents {
  Header?: React.ComponentType<any>;
  Footer?: React.ComponentType<any>;
  HomePage: React.ComponentType<HomePageProps>;
  PLPPage: React.ComponentType<PLPPageProps>;
  LoginPage: React.ComponentType<AuthPageProps>;
  SignupPage: React.ComponentType<AuthPageProps>;
  ForgotPasswordPage: React.ComponentType<AuthPageProps>;
  /** Per-template product detail page (required). */
  PDPPage: React.ComponentType<PDPPageProps>;
  /** Per-template wishlist page (required). */
  WishlistPage: React.ComponentType<WishlistPageProps>;
  /** Per-template cart page (required). */
  CartPage: React.ComponentType<CartPageProps>;
  /** Per-template customer account page (required). */
  AccountPage: React.ComponentType<AccountPageProps>;
  /** Per-template customer support and help center page (required). */
  SupportPage: React.ComponentType<SupportPageProps>;
  /** Optional: per-template collections index. Falls back to shared /collections if absent. */
  CollectionsPage?: React.ComponentType<CollectionsPageProps>;
}

// ── Registry ──────────────────────────────────────────────────────────────────

const mincomComponents: TemplateComponents = {
  Header: MincomHeader,
  Footer: MincomFooter,
  HomePage: MincomHomePage,
  PLPPage: MincomPLPPage,
  LoginPage: MincomLoginPage,
  SignupPage: MincomSignupPage,
  ForgotPasswordPage: MincomForgotPasswordPage,
  PDPPage: MincomPDPPage,
  WishlistPage: MincomWishlistPage,
  CartPage: MincomCartPage,
  AccountPage: MincomAccountPage,
  SupportPage: MincomSupportPage,
};

const novaComponents: TemplateComponents = {
  Header: NovaHeader,
  Footer: NovaFooter,
  HomePage: NovaHomePage,
  PLPPage: NovaPLPPage,
  LoginPage: NovaLoginPage,
  SignupPage: NovaSignupPage,
  ForgotPasswordPage: NovaForgotPasswordPage,
  PDPPage: NovaPDPPage,
  WishlistPage: NovaWishlistPage,
  CartPage: NovaCartPage,
  AccountPage: NovaAccountPage,
  SupportPage: NovaSupportPage,
};

const defaultComponents: TemplateComponents = {
  Header: DefaultHeader,
  Footer: DefaultFooter,
  HomePage: DefaultHomePage,
  PLPPage: DefaultPLPPage,
  LoginPage: DefaultLoginPage,
  SignupPage: DefaultSignupPage,
  ForgotPasswordPage: DefaultForgotPasswordPage,
  PDPPage: DefaultPDPPage,
  WishlistPage: DefaultWishlistPage,
  CartPage: DefaultCartPage,
  AccountPage: DefaultAccountPage,
  SupportPage: DefaultSupportPage,
};

const minimalComponents: TemplateComponents = {
  Header: MinimalHeader,
  Footer: MinimalFooter,
  HomePage: MinimalHomePage,
  PLPPage: MinimalPLPPage,
  LoginPage: MinimalLoginPage,
  SignupPage: MinimalSignupPage,
  ForgotPasswordPage: MinimalForgotPasswordPage,
  PDPPage: MinimalPDPPage,
  WishlistPage: MinimalWishlistPage,
  CartPage: MinimalCartPage,
  AccountPage: MinimalAccountPage,
  SupportPage: MinimalSupportPage,
};

const luxeComponents: TemplateComponents = {
  Header: LuxeHeader,
  Footer: LuxeFooter,
  HomePage: LuxeHomePage,
  PLPPage: LuxePLPPage,
  LoginPage: LuxeLoginPage,
  SignupPage: LuxeSignupPage,
  ForgotPasswordPage: LuxeForgotPasswordPage,
  PDPPage: LuxePDPPage,
  WishlistPage: LuxeWishlistPage,
  CartPage: LuxeCartPage,
  AccountPage: LuxeAccountPage,
  SupportPage: LuxeSupportPage,
};

const funoComponents: TemplateComponents = {
  Header: FunoHeader,
  Footer: FunoFooter,
  HomePage: FunoHomePage,
  PLPPage: FunoPLPPage,
  LoginPage: FunoLoginPage,
  SignupPage: FunoSignupPage,
  ForgotPasswordPage: FunoForgotPasswordPage,
  PDPPage: FunoPDPPage,
  WishlistPage: FunoWishlistPage,
  CartPage: FunoCartPage,
  AccountPage: FunoAccountPage,
  SupportPage: FunoSupportPage,
};

const TEMPLATE_REGISTRY: Record<string, TemplateComponents> = {
  // Fashion & Luxury
  fashion: luxeComponents,
  luxury: luxeComponents,
  luxe: luxeComponents,
  'velvet-luxury': luxeComponents,
  'haute-couture': luxeComponents,

  // Electronics, Tech & Apple Design
  electronics: novaComponents,
  tech: novaComponents,
  nova: novaComponents,
  'nova-tech': novaComponents,
  gadgets: novaComponents,

  // Minimalist & Monochrome
  minimal: minimalComponents,
  minimalist: minimalComponents,
  clean: minimalComponents,
  scandinavian: minimalComponents,

  // Modern Living, Commercial & Furniture
  furniture: mincomComponents,
  mincom: mincomComponents,
  'mincom-furniture': mincomComponents,
  'mincom-theme': mincomComponents,
  'artisan-craft': mincomComponents,
  modern: mincomComponents,

  // Playful Nordic
  funo: funoComponents,
  funie: funoComponents,
  'funo-furniture': funoComponents,
  nordic: funoComponents,

  // Default & Streetwear
  default: defaultComponents,
  general: defaultComponents,
  'pulse-streetwear': defaultComponents,
};

/**
 * Resolves the active template components from the slug.
 * Case-insensitive, trimmed, and gracefully falls back to mincom/nova/default.
 */
export function resolveTemplate(slug?: string | null): TemplateComponents {
  if (slug) {
    const normalized = slug.toLowerCase().trim();
    if (TEMPLATE_REGISTRY[normalized]) {
      return TEMPLATE_REGISTRY[normalized];
    }
  }
  return TEMPLATE_REGISTRY['mincom'] || TEMPLATE_REGISTRY['nova'] || TEMPLATE_REGISTRY['default'];
}

/** List all available template slugs (useful for CMS admin dropdowns). */
export function getAvailableTemplates(): string[] {
  return Object.keys(TEMPLATE_REGISTRY);
}
