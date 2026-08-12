'use client';

import { useEffect } from 'react';
import type { ThemeConfig } from '@/lib/api/types';
import { ThemeContext } from '@/context/ThemeContext';

interface ThemeProviderProps {
  theme: ThemeConfig;
  children: React.ReactNode;
}

/**
 * ThemeProvider:
 * 1. Receives the ThemeConfig (fetched server-side in layout.tsx)
 * 2. Injects all color/radius/font values as CSS custom properties on <html>
 * 3. Wraps children in ThemeContext so any component can call useTheme()
 *
 * Color mapping (backend field → CSS var):
 *   themePrimaryColor    → --sf-primary
 *   themeSecondaryColor  → --sf-secondary
 *   themeBackgroundColor → --sf-bg
 *   themeTextColor       → --sf-text
 *   themeAccentColor     → --sf-accent
 *   themeBorderRadius    → --sf-radius
 *   themeHeadingFont     → --sf-heading-font
 *   themeBodyFont        → --sf-body-font
 *   themeFontSize        → --sf-font-size
 */
export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  useEffect(() => {
    const root = document.documentElement;

    const setVar = (name: string, value: string | null | undefined, fallback?: string) => {
      const resolved = value || fallback;
      if (resolved) root.style.setProperty(name, resolved);
    };

    setVar('--sf-primary',      theme.themePrimaryColor,    '#6366f1');
    setVar('--sf-secondary',    theme.themeSecondaryColor,  '#8b5cf6');
    setVar('--sf-bg',           theme.themeBackgroundColor, '#ffffff');
    setVar('--sf-text',         theme.themeTextColor,       '#111827');
    setVar('--sf-accent',       theme.themeAccentColor,     '#f59e0b');
    setVar('--sf-radius',       theme.themeBorderRadius,    '0.5rem');
    setVar('--sf-font-size',    theme.themeFontSize,        '16px');
    setVar('--sf-heading-font', theme.themeHeadingFont,     'Inter, system-ui, sans-serif');
    setVar('--sf-body-font',    theme.themeBodyFont,        'Inter, system-ui, sans-serif');

    // Derived: a slightly-darkened primary for hover states (via color-mix if supported)
    root.style.setProperty(
      '--sf-primary-hover',
      theme.themePrimaryColor
        ? `color-mix(in srgb, ${theme.themePrimaryColor} 85%, black)`
        : '#4f46e5'
    );
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
}
