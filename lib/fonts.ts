// ─── Dynamic Storefront Fonts Generator ────────────────────────────────────────
// Integrates Next.js next/font optimized variables, dynamic @font-face rules,
// and CSS variables on the server side based on merchant DB theme configuration.

import type { ThemeConfig } from './api/types';

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

export function generateDynamicFontStyles(theme: ThemeConfig): string {
  const headingFont = (theme.themeHeadingFont || 'Inter').trim();
  const bodyFont = (theme.themeBodyFont || 'Inter').trim();
  const headingUrl = theme.themeHeadingFontUrl;
  const bodyUrl = theme.themeBodyFontUrl;

  const fontFaces: string[] = [];
  const googleFontsToLoad = new Set<string>();

  const isWebSafe = (name: string) =>
    ['system-ui', 'sans-serif', 'serif', 'monospace', 'arial', 'helvetica', 'georgia', 'times new roman', 'courier'].includes(name.toLowerCase());

  // 1. Heading font resolution
  let headingFamilyName = headingFont;
  let headingVarValue = NEXT_FONT_MAP[headingFont.toLowerCase()];

  if (headingUrl) {
    headingFamilyName = 'StoreHeadingFont';
    headingVarValue = `'StoreHeadingFont'`;
    fontFaces.push(`
      @font-face {
        font-family: 'StoreHeadingFont';
        src: url('${headingUrl}') format('woff2');
        font-weight: 100 900;
        font-display: swap;
      }
    `);
  } else if (!headingVarValue && !isWebSafe(headingFont)) {
    googleFontsToLoad.add(headingFont);
    headingVarValue = `'${headingFamilyName}'`;
  } else if (!headingVarValue) {
    headingVarValue = `'${headingFamilyName}'`;
  }

  // 2. Body font resolution
  let bodyFamilyName = bodyFont;
  let bodyVarValue = NEXT_FONT_MAP[bodyFont.toLowerCase()];

  if (bodyUrl) {
    bodyFamilyName = 'StoreBodyFont';
    bodyVarValue = `'StoreBodyFont'`;
    fontFaces.push(`
      @font-face {
        font-family: 'StoreBodyFont';
        src: url('${bodyUrl}') format('woff2');
        font-weight: 100 900;
        font-display: swap;
      }
    `);
  } else if (!bodyVarValue && !isWebSafe(bodyFont)) {
    googleFontsToLoad.add(bodyFont);
    bodyVarValue = `'${bodyFamilyName}'`;
  } else if (!bodyVarValue) {
    bodyVarValue = `'${bodyFamilyName}'`;
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
      --font-heading: ${headingVarValue}, system-ui, -apple-system, sans-serif;
      --font-body: ${bodyVarValue}, system-ui, -apple-system, sans-serif;
      --sf-heading-font: var(--font-heading);
      --sf-body-font: var(--font-body);
      --sf-primary: ${theme.themePrimaryColor || '#6366f1'};
      --sf-secondary: ${theme.themeSecondaryColor || '#8b5cf6'};
      --sf-bg: ${theme.themeBackgroundColor || '#ffffff'};
      --sf-text: ${theme.themeTextColor || '#111827'};
      --sf-accent: ${theme.themeAccentColor || '#f59e0b'};
      --sf-radius: ${theme.themeBorderRadius || '0.5rem'};
      --sf-font-size: ${theme.themeFontSize || '16px'};
    }

    body {
      font-family: var(--font-body);
    }

    h1, h2, h3, h4, h5, h6, .font-heading {
      font-family: var(--font-heading);
    }
  `;
}
