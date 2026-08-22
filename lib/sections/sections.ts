// ─── Sections API ─────────────────────────────────────────────────────────────
// Fetches the CMS-defined page section layout from the backend.
// Falls back to the DEFAULT_HOME_LAYOUT if the endpoint is unavailable.

import { apiClient } from '@/lib/api/client';
import type { PageLayout } from './types';
import { DEFAULT_HOME_LAYOUT } from './types';

/**
 * Fetches the section layout for a given page slug from the CMS.
 * Cached for 5 minutes — cleared via the /api/revalidate webhook on CMS publish.
 *
 * Backend endpoint (when implemented):
 *   GET /api/storefront/pages/:slug
 *   Response: { page: string; sections: SectionConfig[] }
 *
 * Falls back to the bundled default layout if the endpoint is unavailable.
 */
export async function getPageLayout(slug: string = 'home'): Promise<PageLayout> {
  try {
    const layout = await apiClient.get<PageLayout>(
      `api/storefront/pages/${encodeURIComponent(slug)}`,
      { next: { revalidate: 300, tags: ['sections', `page-${slug}`] } }
    );

    // Validate response shape
    if (layout && Array.isArray(layout.sections) && layout.sections.length > 0) {
      return layout;
    }

    // Fall back if sections array is empty or malformed
    return slug === 'home' ? DEFAULT_HOME_LAYOUT : { page: slug, sections: [] };
  } catch {
    // Backend doesn't have this endpoint yet — use bundled default
    return slug === 'home' ? DEFAULT_HOME_LAYOUT : { page: slug, sections: [] };
  }
}
