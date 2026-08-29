// ─── Singular Category Route Alias — /category/[slug] ───────────────────────
// Delegates directly to the canonical /categories/[slug] implementation.

import CategoryDetailPage, { generateMetadata as baseGenerateMetadata } from '@/app/categories/[slug]/page';

export const dynamic = 'force-dynamic';
export const generateMetadata = baseGenerateMetadata;
export default CategoryDetailPage;
