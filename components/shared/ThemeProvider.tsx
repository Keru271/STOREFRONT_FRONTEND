'use client';

import { useEffect } from 'react';
import type { ThemeConfig } from '@/lib/api/types';
import { ThemeContext } from '@/context/ThemeContext';

const NEXT_FONT_MAP: Record<string, string> = {
  'inter': 'var(--font-inter)',
  'plus jakarta sans': 'var(--font-plus-jakarta)',
  'plus_jakarta_sans': 'var(--font-plus-jakarta)',
  'playfair display': 'var(--font-playfair)',
  'playfair_display': 'var(--font-playfair)',
  'outfit': 'var(--font-outfit)',
  'space grotesk': 'var(--font-space-grotesk)',
  'space_grotesk': 'var(--font-space-grotesk)',
  'cinzel': 'var(--font-cinzel)',
  'geist': 'var(--font-geist-sans)',
  'geist sans': 'var(--font-geist-sans)',
  'geist mono': 'var(--font-geist-mono)',
};

interface ThemeProviderProps {
  theme: ThemeConfig;
  children: React.ReactNode;
}

/**
 * ThemeProvider:
 * 1. Receives the ThemeConfig (fetched server-side in layout.tsx)
 * 2. Injects all color/radius/font/layout values as CSS custom properties on <html>
 * 3. Wraps children in ThemeContext so any component can call useTheme()
 */
export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  useEffect(() => {
    const root = document.documentElement;

    const setVar = (name: string, value: string | null | undefined, fallback?: string) => {
      const resolved = value || fallback;
      if (resolved) root.style.setProperty(name, resolved);
    };

    // Colors
    setVar('--sf-primary',      theme.themePrimaryColor,    '#f59e0b');
    setVar('--sf-secondary',    theme.themeSecondaryColor,  '#23272a');
    setVar('--sf-bg',           theme.themeBackgroundColor, '#fafaf9');
    setVar('--sf-text',         theme.themeTextColor,       '#0f172a');
    setVar('--sf-accent',       theme.themeAccentColor,     '#d97706');

    // Radius mapping
    let radius = theme.themeBorderRadius || '0.75rem';
    if (radius === 'none') radius = '0px';
    else if (radius === 'sm') radius = '0.25rem';
    else if (radius === 'md') radius = '0.5rem';
    else if (radius === 'lg') radius = '0.75rem';
    else if (radius === 'xl') radius = '1rem';
    else if (radius === 'full') radius = '9999px';
    root.style.setProperty('--sf-radius', radius);

    // Font Size
    let fontSize = theme.themeFontSize || '16px';
    if (fontSize === 'sm') fontSize = '14px';
    else if (fontSize === 'md') fontSize = '16px';
    else if (fontSize === 'lg') fontSize = '18px';
    root.style.setProperty('--sf-font-size', fontSize);

    // Typography
    const headingFont = (theme.themeHeadingFont || 'Inter').trim();
    const bodyFont = (theme.themeBodyFont || 'Inter').trim();
    const headingVar = theme.themeHeadingFontUrl
      ? `'StoreHeadingFont', system-ui, -apple-system, sans-serif`
      : NEXT_FONT_MAP[headingFont.toLowerCase()] || `'${headingFont}', system-ui, -apple-system, sans-serif`;
    const bodyVar = theme.themeBodyFontUrl
      ? `'StoreBodyFont', system-ui, -apple-system, sans-serif`
      : NEXT_FONT_MAP[bodyFont.toLowerCase()] || `'${bodyFont}', system-ui, -apple-system, sans-serif`;

    root.style.setProperty('--font-heading', headingVar);
    root.style.setProperty('--font-body', bodyVar);
    root.style.setProperty('--sf-heading-font', headingVar);
    root.style.setProperty('--sf-body-font', bodyVar);

    // Layout Width
    let layoutWidth = '1280px';
    if (theme.themeLayoutWidth === 'wide') layoutWidth = '1440px';
    else if (theme.themeLayoutWidth === 'full') layoutWidth = '100%';
    else if (theme.themeLayoutWidth === 'compact') layoutWidth = '1024px';
    root.style.setProperty('--sf-layout-width', layoutWidth);

    // Button Style
    root.style.setProperty('--sf-button-style', theme.themeButtonStyle || 'solid');

    // Derived color-mixes for hover states
    root.style.setProperty(
      '--sf-primary-hover',
      theme.themePrimaryColor
        ? `color-mix(in srgb, ${theme.themePrimaryColor} 85%, black)`
        : '#d97706'
    );
    root.style.setProperty(
      '--sf-accent-hover',
      theme.themeAccentColor
        ? `color-mix(in srgb, ${theme.themeAccentColor} 85%, black)`
        : '#b45309'
    );
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
}
