// ─── Dynamic Storefront Fonts Generator ────────────────────────────────────────
// Integrates Next.js next/font optimized variables, dynamic @font-face rules,
// and CSS variables on the server side based on merchant DB theme configuration.

import type { ThemeConfig } from './api/types';

export const NEXT_FONT_MAP: Record<string, string> = {
  'inter': 'var(--font-inter)',
  'plus jakarta sans': 'var(--font-plus-jakarta)',
  'plus_jakarta_sans': 'var(--font-plus-jakarta)',
  'playfair display': 'var(--font-playfair)',
  'playfair_display': 'var(--font-playfair)',
  'outfit': 'var(--font-outfit)',
  'space grotesk': 'var(--font-space-grotesk)',
  'space_grotesk': 'var(--font-space-grotesk)',
  'cinzel': 'var(--font-cinzel)',
  'roboto': 'var(--font-roboto)',
  'dm sans': 'var(--font-dm-sans)',
  'dm_sans': 'var(--font-dm-sans)',
  'lora': 'var(--font-lora)',
  'geist': 'var(--font-geist-sans)',
  'geist sans': 'var(--font-geist-sans)',
  'geist mono': 'var(--font-geist-mono)',
};

/**
 * Normalizes font string input (e.g. "Outfit, sans-serif", "Playfair Display, serif", "Outfit")
 * into a clean primary font family name and CSS fallback.
 */
export function parseFontName(rawFont: string | null | undefined): {
  cleanName: string;
  fallback: string;
} {
  if (!rawFont || !rawFont.trim()) {
    return { cleanName: 'Inter', fallback: 'sans-serif' };
  }

  // Handle strings like "Playfair Display, serif" or "'Outfit', sans-serif"
  const parts = rawFont.split(',').map((p) => p.trim().replace(/^['"]+|['"]+$/g, ''));
  const cleanName = parts[0] || 'Inter';

  // Determine fallback (serif, sans-serif, monospace)
  let fallback = parts.slice(1).join(', ');
  if (!fallback) {
    const lower = cleanName.toLowerCase();
    if (lower.includes('playfair') || lower.includes('cinzel') || lower.includes('lora') || lower.includes('serif')) {
      fallback = 'serif';
    } else if (lower.includes('mono') || lower.includes('code')) {
      fallback = 'monospace';
    } else {
      fallback = 'sans-serif';
    }
  }

  return { cleanName, fallback };
}

export function generateDynamicFontStyles(theme: ThemeConfig): string {
  const { cleanName: headingName, fallback: headingFallback } = parseFontName(theme.themeHeadingFont);
  const { cleanName: bodyName, fallback: bodyFallback } = parseFontName(theme.themeBodyFont);

  const headingUrl = theme.themeHeadingFontUrl;
  const bodyUrl = theme.themeBodyFontUrl;

  const fontFaces: string[] = [];
  const googleFontsToLoad = new Set<string>();

  const isWebSafe = (name: string) =>
    ['system-ui', 'sans-serif', 'serif', 'monospace', 'arial', 'helvetica', 'georgia', 'times new roman', 'courier'].includes(name.toLowerCase());

  // 1. Heading font resolution
  let headingVarValue: string;
  const headingKey = headingName.toLowerCase().replace(/_/g, ' ');

  if (headingUrl) {
    headingVarValue = `'StoreHeadingFont', ${headingFallback}`;
    fontFaces.push(`
      @font-face {
        font-family: 'StoreHeadingFont';
        src: url('${headingUrl}') format('woff2');
        font-weight: 100 900;
        font-display: swap;
      }
    `);
  } else if (NEXT_FONT_MAP[headingKey]) {
    headingVarValue = `${NEXT_FONT_MAP[headingKey]}, ${headingFallback}`;
  } else if (isWebSafe(headingName)) {
    headingVarValue = `${headingName}, ${headingFallback}`;
  } else {
    googleFontsToLoad.add(headingName);
    headingVarValue = `'${headingName}', ${headingFallback}`;
  }

  // 2. Body font resolution
  let bodyVarValue: string;
  const bodyKey = bodyName.toLowerCase().replace(/_/g, ' ');

  if (bodyUrl) {
    bodyVarValue = `'StoreBodyFont', ${bodyFallback}`;
    fontFaces.push(`
      @font-face {
        font-family: 'StoreBodyFont';
        src: url('${bodyUrl}') format('woff2');
        font-weight: 100 900;
        font-display: swap;
      }
    `);
  } else if (NEXT_FONT_MAP[bodyKey]) {
    bodyVarValue = `${NEXT_FONT_MAP[bodyKey]}, ${bodyFallback}`;
  } else if (isWebSafe(bodyName)) {
    bodyVarValue = `${bodyName}, ${bodyFallback}`;
  } else {
    googleFontsToLoad.add(bodyName);
    bodyVarValue = `'${bodyName}', ${bodyFallback}`;
  }

  // 3. Google Fonts CDN link fallback for unbundled standard web font names
  let googleImports = '';
  if (googleFontsToLoad.size > 0) {
    const families = Array.from(googleFontsToLoad)
      .map((f) => `family=${encodeURIComponent(f.trim())}:wght@300;400;500;600;700;800;900`)
      .join('&');
    googleImports = `@import url('https://fonts.googleapis.com/css2?${families}&display=swap');`;
  }

  return `
    ${googleImports}
    ${fontFaces.join('\n')}

    :root {
      --font-heading: ${headingVarValue};
      --font-body: ${bodyVarValue};
      --sf-heading-font: ${headingVarValue};
      --sf-body-font: ${bodyVarValue};
      --sf-primary: ${theme.themePrimaryColor || '#6366f1'};
      --sf-secondary: ${theme.themeSecondaryColor || '#8b5cf6'};
      --sf-bg: ${theme.themeBackgroundColor || '#ffffff'};
      --sf-bg-image: ${theme.themeBackgroundImage ? `url('${theme.themeBackgroundImage}')` : 'none'};
      --sf-text: ${theme.themeTextColor || '#111827'};
      --sf-accent: ${theme.themeAccentColor || '#f59e0b'};
      --sf-radius: ${theme.themeBorderRadius || '0.5rem'};
      --sf-font-size: ${theme.themeFontSize || '16px'};
    }

    body, .font-sans, [class*="font-sans"], .font-body {
      font-family: var(--sf-body-font) !important;
    }

    h1, h2, h3, h4, h5, h6, .font-heading, [class*="font-heading"] {
      font-family: var(--sf-heading-font) !important;
    }
  `;
}
