'use client';

import { createContext, useContext } from 'react';
import type { ThemeConfig } from '@/lib/api/types';

// ─── Theme Context ────────────────────────────────────────────────────────────

export interface ThemeContextValue {
  theme: ThemeConfig;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Access the current store theme config from any client component.
 * Must be used inside ThemeProvider.
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme() must be called inside a <ThemeProvider>');
  }
  return context;
}
