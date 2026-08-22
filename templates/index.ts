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
import type { ThemeConfig, Product, ProductDetail, Collection, Category, Brand, FilterFacetsResponse } from '@/lib/api/types';

// Default template (dynamic chunks)
const DefaultHomePage           = dynamic(() => import('./default/HomePage'));
const DefaultPLPPage            = dynamic(() => import('./default/PLPPage'));
const DefaultLoginPage          = dynamic(() => import('./default/LoginPage'));
const DefaultSignupPage         = dynamic(() => import('./default/SignupPage'));
const DefaultForgotPasswordPage = dynamic(() => import('./default/ForgotPasswordPage'));
const DefaultPDPPage            = dynamic(() => import('./default/PDPPage'));
const DefaultWishlistPage       = dynamic(() => import('./default/WishlistPage'));
const DefaultCartPage           = dynamic(() => import('./default/CartPage'));
const DefaultAccountPage        = dynamic(() => import('./default/AccountPage'));

// Minimal template (dynamic chunks)
const MinimalHomePage           = dynamic(() => import('./minimal/HomePage'));
const MinimalPLPPage            = dynamic(() => import('./minimal/PLPPage'));
const MinimalLoginPage          = dynamic(() => import('./minimal/LoginPage'));
const MinimalSignupPage         = dynamic(() => import('./minimal/SignupPage'));
const MinimalForgotPasswordPage = dynamic(() => import('./minimal/ForgotPasswordPage'));
const MinimalPDPPage            = dynamic(() => import('./minimal/PDPPage'));
const MinimalWishlistPage       = dynamic(() => import('./minimal/WishlistPage'));
const MinimalCartPage           = dynamic(() => import('./minimal/CartPage'));
const MinimalAccountPage        = dynamic(() => import('./minimal/AccountPage'));

// Luxe template (dynamic chunks)
const LuxeHomePage           = dynamic(() => import('./luxe/HomePage'));
const LuxePLPPage            = dynamic(() => import('./luxe/PLPPage'));
const LuxeLoginPage          = dynamic(() => import('./luxe/LoginPage'));
const LuxeSignupPage         = dynamic(() => import('./luxe/SignupPage'));
const LuxeForgotPasswordPage = dynamic(() => import('./luxe/ForgotPasswordPage'));
const LuxePDPPage            = dynamic(() => import('./luxe/PDPPage'));
const LuxeWishlistPage       = dynamic(() => import('./luxe/WishlistPage'));
const LuxeCartPage           = dynamic(() => import('./luxe/CartPage'));
const LuxeAccountPage        = dynamic(() => import('./luxe/AccountPage'));

// Nova template (Apple Design System - dynamic chunks)
const NovaHomePage           = dynamic(() => import('./nova/HomePage'));
const NovaPLPPage            = dynamic(() => import('./nova/PLPPage'));
const NovaLoginPage          = dynamic(() => import('./nova/LoginPage'));
const NovaSignupPage         = dynamic(() => import('./nova/SignupPage'));
const NovaForgotPasswordPage = dynamic(() => import('./nova/ForgotPasswordPage'));
const NovaPDPPage            = dynamic(() => import('./nova/PDPPage'));
const NovaWishlistPage       = dynamic(() => import('./nova/WishlistPage'));
const NovaCartPage           = dynamic(() => import('./nova/CartPage'));
const NovaAccountPage        = dynamic(() => import('./nova/AccountPage'));

// Mincom template (Modern Furniture & Living - dynamic chunks)
const MincomHomePage           = dynamic(() => import('./mincom/HomePage'));
const MincomPLPPage            = dynamic(() => import('./mincom/PLPPage'));
const MincomLoginPage          = dynamic(() => import('./mincom/LoginPage'));
const MincomSignupPage         = dynamic(() => import('./mincom/SignupPage'));
const MincomForgotPasswordPage = dynamic(() => import('./mincom/ForgotPasswordPage'));
const MincomPDPPage            = dynamic(() => import('./mincom/PDPPage'));
const MincomWishlistPage       = dynamic(() => import('./mincom/WishlistPage'));
const MincomCartPage           = dynamic(() => import('./mincom/CartPage'));
const MincomAccountPage        = dynamic(() => import('./mincom/AccountPage'));

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

export interface TemplateComponents {
  HomePage:           React.ComponentType<HomePageProps>;
  PLPPage:            React.ComponentType<PLPPageProps>;
  LoginPage:          React.ComponentType<AuthPageProps>;
  SignupPage:         React.ComponentType<AuthPageProps>;
  ForgotPasswordPage: React.ComponentType<AuthPageProps>;
  /** Per-template product detail page (required). */
  PDPPage:            React.ComponentType<PDPPageProps>;
  /** Per-template wishlist page (required). */
  WishlistPage:       React.ComponentType<WishlistPageProps>;
  /** Per-template cart page (required). */
  CartPage:           React.ComponentType<CartPageProps>;
  /** Per-template customer account page (required). */
  AccountPage:        React.ComponentType<AccountPageProps>;
  /** Optional: per-template collections index. Falls back to shared /collections if absent. */
  CollectionsPage?:   React.ComponentType<CollectionsPageProps>;
}

// ── Registry ──────────────────────────────────────────────────────────────────

const mincomComponents: TemplateComponents = {
  HomePage:           MincomHomePage,
  PLPPage:            MincomPLPPage,
  LoginPage:          MincomLoginPage,
  SignupPage:         MincomSignupPage,
  ForgotPasswordPage: MincomForgotPasswordPage,
  PDPPage:            MincomPDPPage,
  WishlistPage:       MincomWishlistPage,
  CartPage:           MincomCartPage,
  AccountPage:        MincomAccountPage,
};

const novaComponents: TemplateComponents = {
  HomePage:           NovaHomePage,
  PLPPage:            NovaPLPPage,
  LoginPage:          NovaLoginPage,
  SignupPage:         NovaSignupPage,
  ForgotPasswordPage: NovaForgotPasswordPage,
  PDPPage:            NovaPDPPage,
  WishlistPage:       NovaWishlistPage,
  CartPage:           NovaCartPage,
  AccountPage:        NovaAccountPage,
};

const defaultComponents: TemplateComponents = {
  HomePage:           DefaultHomePage,
  PLPPage:            DefaultPLPPage,
  LoginPage:          DefaultLoginPage,
  SignupPage:         DefaultSignupPage,
  ForgotPasswordPage: DefaultForgotPasswordPage,
  PDPPage:            DefaultPDPPage,
  WishlistPage:       DefaultWishlistPage,
  CartPage:           DefaultCartPage,
  AccountPage:        DefaultAccountPage,
};

const minimalComponents: TemplateComponents = {
  HomePage:           MinimalHomePage,
  PLPPage:            MinimalPLPPage,
  LoginPage:          MinimalLoginPage,
  SignupPage:         MinimalSignupPage,
  ForgotPasswordPage: MinimalForgotPasswordPage,
  PDPPage:            MinimalPDPPage,
  WishlistPage:       MinimalWishlistPage,
  CartPage:           MinimalCartPage,
  AccountPage:        MinimalAccountPage,
};

const luxeComponents: TemplateComponents = {
  HomePage:           LuxeHomePage,
  PLPPage:            LuxePLPPage,
  LoginPage:          LuxeLoginPage,
  SignupPage:         LuxeSignupPage,
  ForgotPasswordPage: LuxeForgotPasswordPage,
  PDPPage:            LuxePDPPage,
  WishlistPage:       LuxeWishlistPage,
  CartPage:           LuxeCartPage,
  AccountPage:        LuxeAccountPage,
};

const TEMPLATE_REGISTRY: Record<string, TemplateComponents> = {
  mincom: mincomComponents,
  'mincom-furniture': mincomComponents,
  'mincom-theme': mincomComponents,
  'artisan-craft': mincomComponents,
  nova: novaComponents,
  'nova-tech': novaComponents,
  default: defaultComponents,
  'pulse-streetwear': defaultComponents,
  minimal: minimalComponents,
  luxe: luxeComponents,
  'velvet-luxury': luxeComponents,
};

/**
 * Resolves the active template components from the slug.
 * Falls back to 'mincom', 'nova', or 'default' if slug is unknown or not provided.
 */
export function resolveTemplate(slug?: string | null): TemplateComponents {
  if (slug && TEMPLATE_REGISTRY[slug]) {
    return TEMPLATE_REGISTRY[slug];
  }
  return TEMPLATE_REGISTRY['mincom'] || TEMPLATE_REGISTRY['nova'] || TEMPLATE_REGISTRY['default'];
}

/** List all available template slugs (useful for CMS admin dropdowns). */
export function getAvailableTemplates(): string[] {
  return Object.keys(TEMPLATE_REGISTRY);
}
