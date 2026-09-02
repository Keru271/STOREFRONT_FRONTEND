import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Edge Middleware for Dynamic Multi-Tenant Store Resolution
 *
 * Runs before every incoming request on the shared storefront.
 * Resolves:
 *   1. Custom domain from host header (e.g. "myfashionstore.com")
 *   2. Subdomain slug (e.g. "fashion.platform.com" or "fashion.localhost")
 *   3. Query parameter overrides (?storeId=..., ?storeSlug=..., ?previewTemplate=...)
 *
 * Injects `x-store-host`, `x-store-slug`, `x-store-id`, and `x-preview-template`
 * into downstream request headers for Server Components and the API client.
 */
export function middleware(request: NextRequest) {
  const host =
    request.headers.get('x-forwarded-host') ||
    request.headers.get('host') ||
    '';

  // Clean host (strip port and protocol)
  let cleanHost = host.split(':')[0].toLowerCase().trim();
  if (cleanHost.startsWith('http://')) cleanHost = cleanHost.replace('http://', '');
  if (cleanHost.startsWith('https://')) cleanHost = cleanHost.replace('https://', '');

  const { searchParams } = request.nextUrl;
  const storeIdParam = searchParams.get('storeId');
  const storeSlugParam = searchParams.get('storeSlug');
  const previewTemplateParam = searchParams.get('previewTemplate');

  // Clone the request headers so we can append custom multi-tenant headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-store-host', cleanHost);

  if (storeIdParam) {
    requestHeaders.set('x-store-id', storeIdParam);
  }
  if (storeSlugParam) {
    requestHeaders.set('x-store-slug', storeSlugParam);
  }
  if (previewTemplateParam) {
    requestHeaders.set('x-preview-template', previewTemplateParam);
  }

  // Detect subdomain if present (e.g. "fashion.platform.shop" or "fashion.localhost")
  const parts = cleanHost.split('.');
  if (parts.length >= 2) {
    const subdomain = parts[0];
    if (
      subdomain &&
      subdomain !== 'www' &&
      subdomain !== 'localhost' &&
      subdomain !== '127' &&
      subdomain !== 'api' &&
      subdomain !== 'cms'
    ) {
      if (!requestHeaders.has('x-store-slug')) {
        requestHeaders.set('x-store-slug', subdomain);
      }
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (Next.js API route handlers like /api/revalidate)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
