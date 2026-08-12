// ─── Template Registry ────────────────────────────────────────────────────────
// Maps activeTemplateSlug (from backend) to the correct set of page components.
//
// To add a new template:
//   1. Create a folder: templates/<your-slug>/
//   2. Export the 4 page components from it
//   3. Add the entry to TEMPLATE_REGISTRY below
//
// The slug must match exactly what the CMS admin stores in `activeTemplateSlug`.

import type { ThemeConfig, Product, Collection, Category, Brand } from '@/lib/api/types';

// Default template
import DefaultHomePage   from './default/HomePage';
import DefaultPLPPage    from './default/PLPPage';
import DefaultLoginPage  from './default/LoginPage';
import DefaultSignupPage from './default/SignupPage';

// Minimal template
import MinimalHomePage   from './minimal/HomePage';
import MinimalPLPPage    from './minimal/PLPPage';
import MinimalLoginPage  from './minimal/LoginPage';
import MinimalSignupPage from './minimal/SignupPage';

// Luxe template
import LuxeHomePage   from './luxe/HomePage';
import LuxePLPPage    from './luxe/PLPPage';
import LuxeLoginPage  from './luxe/LoginPage';
import LuxeSignupPage from './luxe/SignupPage';

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
  searchParams: Record<string, string | string[] | undefined>;
}

export interface AuthPageProps {
  theme: ThemeConfig;
}

export interface TemplateComponents {
  HomePage:   React.ComponentType<HomePageProps>;
  PLPPage:    React.ComponentType<PLPPageProps>;
  LoginPage:  React.ComponentType<AuthPageProps>;
  SignupPage: React.ComponentType<AuthPageProps>;
}

// ── Registry ──────────────────────────────────────────────────────────────────

const TEMPLATE_REGISTRY: Record<string, TemplateComponents> = {
  default: {
    HomePage:   DefaultHomePage,
    PLPPage:    DefaultPLPPage,
    LoginPage:  DefaultLoginPage,
    SignupPage: DefaultSignupPage,
  },
  minimal: {
    HomePage:   MinimalHomePage,
    PLPPage:    MinimalPLPPage,
    LoginPage:  MinimalLoginPage,
    SignupPage: MinimalSignupPage,
  },
  luxe: {
    HomePage:   LuxeHomePage,
    PLPPage:    LuxePLPPage,
    LoginPage:  LuxeLoginPage,
    SignupPage: LuxeSignupPage,
  },
  // ── Future templates — add here ───────────────────────────────────────────
  // 'fashion':   { ... },
  // 'grocery':   { ... },
  // 'electronics': { ... },
  // ... (up to 30+ templates)
};

/**
 * Resolves the active template components from the slug.
 * Falls back to 'default' if slug is unknown or not provided.
 */
export function resolveTemplate(slug?: string | null): TemplateComponents {
  if (slug && TEMPLATE_REGISTRY[slug]) {
    return TEMPLATE_REGISTRY[slug];
  }
  return TEMPLATE_REGISTRY['default'];
}

/** List all available template slugs (useful for CMS admin dropdowns). */
export function getAvailableTemplates(): string[] {
  return Object.keys(TEMPLATE_REGISTRY);
}
