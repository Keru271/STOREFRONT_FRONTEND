import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { getTheme } from '@/lib/api/theme';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Dynamic metadata from backend SEO config
export async function generateMetadata(): Promise<Metadata> {
  const theme = await getTheme();
  return {
    title: {
      default: theme.seoSiteTitle || theme.storeName,
      template: `%s | ${theme.storeName}`,
    },
    description: theme.seoMetaDescription || theme.description || '',
    icons: theme.favicon ? { icon: theme.favicon } : undefined,
  };
}

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const theme = await getTheme();

  return (
    <html
      lang={theme.language || 'en'}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
