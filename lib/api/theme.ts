// ─── Theme API ────────────────────────────────────────────────────────────────
// Fetches the active store/theme configuration from the backend.
// This drives template selection, color injection, and store metadata.

import { apiClient } from './client';
import type { ThemeConfig } from './types';

// Default fallback theme — used when backend is unreachable
export const DEFAULT_THEME: ThemeConfig = {
  storeName: 'Storefront',
  slug: 'storefront',
  currency: 'USD',
  language: 'en-US',
  timezone: 'UTC',
  activeTemplateSlug: 'default',
  themePrimaryColor: '#6366f1',
  themeSecondaryColor: '#8b5cf6',
  themeBackgroundColor: '#ffffff',
  themeTextColor: '#111827',
  themeAccentColor: '#f59e0b',
  themeHeadingFont: 'Inter',
  themeBodyFont: 'Inter',
  themeFontSize: '16px',
  themeBorderRadius: '0.5rem',
  themeButtonStyle: 'rounded',
  headerSticky: true,
  headerShowSearch: true,
  headerShowCurrency: true,
  footerShowSocial: true,
  footerShowNewsletter: true,
  footerCopyright: `© ${new Date().getFullYear()} Storefront. All rights reserved.`,
};

/**
 * Fetches the storefront theme config from the backend.
 * Cached for 5 minutes (300s) on the server.
 * Falls back to DEFAULT_THEME if the request fails.
 */
export async function getTheme(): Promise<ThemeConfig> {
  try {
    return await apiClient.get<ThemeConfig>('api/storefront/theme', {
      next: { revalidate: 300, tags: ['theme'] },
    });
  } catch {
    return DEFAULT_THEME;
  }
}
