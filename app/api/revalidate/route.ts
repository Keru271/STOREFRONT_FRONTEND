// ─── On-Demand ISR Revalidation Webhook ───────────────────────────────────────
// POST /api/revalidate
//
// Called by the CMS / backend after content changes to invalidate the
// Next.js cache for specific tags (products, collections, theme, etc.).
//
// Usage:
//   curl -X POST https://your-storefront.com/api/revalidate \
//     -H "Content-Type: application/json" \
//     -d '{"secret":"YOUR_REVALIDATE_SECRET","tag":"products"}'
//
// Supported tags:
//   theme, products, categories, collections, brands, menus, pages, orders, sections

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Note: In Next.js 16, revalidateTag requires a second `profile` argument.
// We use revalidatePath as the primary mechanism which is stable and 1-argument.
// For tag-based revalidation we map tags to the pages that use them.

const REVALIDATE_SECRET =
  process.env.REVALIDATE_SECRET || process.env.NEXT_PUBLIC_REVALIDATE_SECRET || '';

const VALID_TAGS = [
  'theme',
  'products',
  'categories',
  'collections',
  'brands',
  'menus',
  'pages',
  'orders',
  'sections',
] as const;

type ValidTag = (typeof VALID_TAGS)[number];

// Map tags → paths that should be revalidated
const TAG_TO_PATHS: Record<ValidTag, string[]> = {
  theme:       ['/', '/products', '/collections'],
  products:    ['/', '/products', '/search'],
  categories:  ['/', '/products'],
  collections: ['/', '/collections'],
  brands:      ['/products'],
  menus:       ['/'],
  pages:       ['/'],
  orders:      ['/account'],
  sections:    ['/'],
};

export async function POST(request: NextRequest) {
  let body: { secret?: string; tag?: string; path?: string; all?: boolean };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }

  // Validate secret
  if (REVALIDATE_SECRET && body.secret !== REVALIDATE_SECRET) {
    return NextResponse.json(
      { message: 'Invalid revalidation secret' },
      { status: 401 }
    );
  }

  // Revalidate ALL paths
  if (body.all) {
    const allPaths = new Set<string>();
    for (const paths of Object.values(TAG_TO_PATHS)) {
      paths.forEach((p) => allPaths.add(p));
    }
    for (const path of allPaths) {
      revalidatePath(path);
    }
    return NextResponse.json({
      revalidated: true,
      paths: [...allPaths],
      message: 'Full cache cleared',
    });
  }

  // Revalidate by path
  if (body.path) {
    revalidatePath(body.path);
    return NextResponse.json({
      revalidated: true,
      path: body.path,
      message: `Path ${body.path} revalidated`,
    });
  }

  // Revalidate by tag (maps to affected paths)
  if (!body.tag) {
    return NextResponse.json(
      {
        message: 'Provide either `tag`, `path`, or `all: true` in the request body',
        validTags: VALID_TAGS,
      },
      { status: 400 }
    );
  }

  if (!VALID_TAGS.includes(body.tag as ValidTag)) {
    return NextResponse.json(
      {
        message: `Unknown tag "${body.tag}"`,
        validTags: VALID_TAGS,
      },
      { status: 400 }
    );
  }

  const paths = TAG_TO_PATHS[body.tag as ValidTag] || [];
  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({
    revalidated: true,
    tag: body.tag,
    paths,
    message: `Tag "${body.tag}" revalidated (${paths.length} path(s))`,
  });
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    validTags: VALID_TAGS,
    hint: 'POST to this endpoint with { secret, tag } to revalidate ISR cache',
  });
}
