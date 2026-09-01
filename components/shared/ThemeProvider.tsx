'use client';

import { useEffect } from 'react';
import type { ThemeConfig } from '@/lib/api/types';
import { ThemeContext } from '@/context/ThemeContext';
import { parseFontName, NEXT_FONT_MAP } from '@/lib/fonts';

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
    const { cleanName: headingName, fallback: headingFallback } = parseFontName(theme.themeHeadingFont);
    const { cleanName: bodyName, fallback: bodyFallback } = parseFontName(theme.themeBodyFont);

    const headingKey = headingName.toLowerCase().replace(/_/g, ' ');
    const bodyKey = bodyName.toLowerCase().replace(/_/g, ' ');

    const headingVar = theme.themeHeadingFontUrl
      ? `'StoreHeadingFont', ${headingFallback}`
      : NEXT_FONT_MAP[headingKey]
      ? `${NEXT_FONT_MAP[headingKey]}, ${headingFallback}`
      : `'${headingName}', ${headingFallback}`;

    const bodyVar = theme.themeBodyFontUrl
      ? `'StoreBodyFont', ${bodyFallback}`
      : NEXT_FONT_MAP[bodyKey]
      ? `${NEXT_FONT_MAP[bodyKey]}, ${bodyFallback}`
      : `'${bodyName}', ${bodyFallback}`;

    root.style.setProperty('--font-heading', headingVar, 'important');
    root.style.setProperty('--font-body', bodyVar, 'important');
    root.style.setProperty('--sf-heading-font', headingVar, 'important');
    root.style.setProperty('--sf-body-font', bodyVar, 'important');

    if (theme.themeBackgroundImage) {
      root.style.setProperty('--sf-bg-image', `url('${theme.themeBackgroundImage}')`);
    } else {
      root.style.setProperty('--sf-bg-image', 'none');
    }

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
