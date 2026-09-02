import type { Metadata } from 'next';
import {
  Inter,
  Plus_Jakarta_Sans,
  Playfair_Display,
  Outfit,
  Space_Grotesk,
  Cinzel,
  Geist,
  Geist_Mono,
  Roboto,
  DM_Sans,
  Lora,
} from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { ToastProvider } from '@/context/ToastContext';
import { LoadingProvider } from '@/context/LoadingContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { MenuProvider } from '@/context/MenuContext';
import { ThemeToastContainer } from '@/components/shared/ThemeToastContainer';
import { ThemeLoader } from '@/components/shared/ThemeLoader';
import { MobileBottomNav } from '@/components/shared/MobileBottomNav';
import CommonCartDrawer from '@/components/cart/CommonCartDrawer';
import { getTheme } from '@/lib/api/theme';
import { getMenu } from '@/lib/api/catalog';
import { generateDynamicFontStyles } from '@/lib/fonts';

// Next.js Optimized Web Fonts (Zero CLS, preloaded, self-hosted)
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cinzel',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  variable: '--font-roboto',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
});

const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lora',
});

const geistSans = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
});

// Dynamic metadata from backend SEO config
export async function generateMetadata(): Promise<Metadata> {
  const theme = await getTheme();
  const title = theme.seoSiteTitle || theme.storeName;
  const description = theme.seoMetaDescription || theme.description || `Shop premium products at ${theme.storeName}.`;
  const ogTitle = theme.seoOgTitle || title;
  const ogDescription = theme.seoOgDescription || description;
  const ogImage = theme.seoOgImage || theme.logo || undefined;

  return {
    title: {
      default: title,
      template: `%s | ${theme.storeName}`,
    },
    description,
    icons: theme.favicon ? { icon: theme.favicon } : undefined,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      siteName: theme.storeName,
      images: ogImage ? [{ url: ogImage }] : undefined,
      locale: theme.language || 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : undefined,
    },
    alternates: theme.seoCanonicalUrl
      ? { canonical: theme.seoCanonicalUrl }
      : undefined,
    robots: theme.seoRobotsTxt || 'index, follow',
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side fetching of Theme and Menus in parallel
  const [theme, headerMenu, footerMenu] = await Promise.all([
    getTheme(),
    getMenu('header'),
    getMenu('footer'),
  ]);

  // Generate dynamic @font-face, Google Fonts link, and CSS custom variables based on DB theme config
  const dynamicFontCss = generateDynamicFontStyles(theme);

  // Parse structured data JSON-LD if provided by CMS
  let structuredDataMarkup = null;
  if (theme.seoStructuredDataJson) {
    try {
      JSON.parse(theme.seoStructuredDataJson);
      structuredDataMarkup = theme.seoStructuredDataJson;
    } catch {
      // Invalid JSON, ignore
    }
  }

  const fontVariables = `${inter.variable} ${plusJakarta.variable} ${playfair.variable} ${outfit.variable} ${spaceGrotesk.variable} ${cinzel.variable} ${roboto.variable} ${dmSans.variable} ${lora.variable} ${geistSans.variable} ${geistMono.variable}`;

  return (
    <html lang={theme.language || 'en'} className={`h-full antialiased ${fontVariables}`}>
      <head>
        {/* Dynamic @font-face and CSS variable injection for tenant fonts without app rebuild */}
        <style
          id="sf-dynamic-typography"
          dangerouslySetInnerHTML={{ __html: dynamicFontCss }}
        />
        {structuredDataMarkup && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: structuredDataMarkup }}
          />
        )}
      </head>
      <body
        className="min-h-full flex flex-col pb-16 lg:pb-0"
        style={{ backgroundColor: 'var(--sf-bg)', color: 'var(--sf-text)', fontFamily: 'var(--sf-body-font)' }}
      >
        <ThemeProvider theme={theme}>
          <LoadingProvider>
            <ToastProvider>
              <CartProvider>
                <CommonCartDrawer />
                <WishlistProvider>
                  <MenuProvider headerMenu={headerMenu} footerMenu={footerMenu}>
                    <ThemeLoader />
                    <ThemeToastContainer />
                    {children}
                    <MobileBottomNav />
                  </MenuProvider>
                </WishlistProvider>
              </CartProvider>
            </ToastProvider>
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
