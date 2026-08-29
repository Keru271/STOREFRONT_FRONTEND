// ─── Singular Brand Route Alias — /brand/[slug] ───────────────────────────
// Delegates directly to the canonical /brands/[slug] implementation.

import BrandDetailPage, { generateMetadata as baseGenerateMetadata } from '@/app/brands/[slug]/page';

export const dynamic = 'force-dynamic';
export const generateMetadata = baseGenerateMetadata;
export default BrandDetailPage;
