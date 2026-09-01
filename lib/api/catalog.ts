// ─── Catalog API ─────────────────────────────────────────────────────────────
// Categories, collections, brands, menus, and static pages.

import { apiClient } from './client';
import type { Brand, Category, Collection, Menu, CmsPage, BlogPost } from './types';

/**
 * Fetches all product categories.
 * Cached for 5 minutes (300s).
 */
export async function getCategories(): Promise<Category[]> {
  try {
    return await apiClient.get<Category[]>('api/storefront/catalog/categories', {
      next: { revalidate: 300, tags: ['categories'] },
    });
  } catch {
    return [];
  }
}

/**
 * Fetches all product collections.
 * Cached for 5 minutes (300s).
 */
export async function getCollections(): Promise<Collection[]> {
  try {
    return await apiClient.get<Collection[]>('api/storefront/catalog/collections', {
      next: { revalidate: 300, tags: ['collections'] },
    });
  } catch {
    return [];
  }
}

/**
 * Fetches all brands.
 * Cached for 5 minutes (300s).
 */
export async function getBrands(): Promise<Brand[]> {
  try {
    return await apiClient.get<Brand[]>('api/storefront/catalog/brands', {
      next: { revalidate: 300, tags: ['brands'] },
    });
  } catch {
    return [];
  }
}

/**
 * Fetches a single brand by slug or name.
 */
export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  try {
    const brands = await getBrands();
    const normalized = slug.toLowerCase().trim();
    const found = brands.find(
      (b) =>
        b.slug?.toLowerCase() === normalized ||
        b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalized ||
        b.name.toLowerCase() === normalized
    );
    return found || null;
  } catch {
    return null;
  }
}

/**
 * Fetches a single category by slug or name.
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const categories = await getCategories();
    const normalized = slug.toLowerCase().trim();
    const found = categories.find(
      (c) =>
        c.slug?.toLowerCase() === normalized ||
        c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalized ||
        c.name.toLowerCase() === normalized
    );
    return found || null;
  } catch {
    return null;
  }
}

/**
 * Fetches all navigation menus.
 * Uses on-demand revalidation (revalidate: 0) for real-time synchronization with CMS.
 */
export async function getMenus(): Promise<Menu[]> {
  try {
    return await apiClient.get<Menu[]>('api/storefront/catalog/menus', {
      next: { revalidate: 0, tags: ['menus'] },
    });
  } catch {
    return [];
  }
}

/**
 * Fetches a single navigation menu by handle, location, or id.
 * Uses on-demand revalidation (revalidate: 0) for real-time synchronization with CMS.
 */
export async function getMenu(handle: string = 'main-menu'): Promise<Menu | null> {
  try {
    const menu = await apiClient.get<Menu>(
      `api/storefront/catalog/menus/${encodeURIComponent(handle)}`,
      { next: { revalidate: 0, tags: ['menus', `menu-${handle}`] } }
    );
    if (menu && menu.items && menu.items.length > 0) {
      return menu;
    }
  } catch (err) {
    // try fallback
  }

  // Resilient fallback to CMS backend directly
  try {
    const cmsBase = process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:5000/api';
    const storeId = process.env.NEXT_PUBLIC_STORE_ID || '';
    const res = await fetch(`${cmsBase}/menus/${encodeURIComponent(handle)}${storeId ? `?storeId=${encodeURIComponent(storeId)}` : ''}`, {
      headers: storeId ? { 'x-store-id': storeId } : {},
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      const rawItems = data.itemsJson
        ? typeof data.itemsJson === 'string'
          ? JSON.parse(data.itemsJson)
          : data.itemsJson
        : data.items || [];

      return {
        id: data.id || `menu-${handle}`,
        title: data.title || handle,
        handle: data.handle || handle,
        location: data.location || handle.toUpperCase(),
        items: rawItems.map((item: any) => ({
          id: item.id || Math.random().toString(36).substring(2, 9),
          label: item.label || item.title || 'Link',
          title: item.title || item.label || 'Link',
          url: item.url || item.href || '#',
          href: item.href || item.url || '#',
          target: item.target || '_self',
          type: item.type || 'LINK',
          isMegaMenu: Boolean(item.isMegaMenu),
          megaMenuConfig: item.megaMenuConfig || (item.isMegaMenu ? {
            bannerImage: item.bannerImage,
            headline: item.headline,
            buttonLabel: item.buttonLabel,
            buttonUrl: item.buttonUrl,
          } : null),
          children: Array.isArray(item.children)
            ? item.children.map((c: any) => ({
                id: c.id,
                label: c.label || c.title || 'Sublink',
                title: c.title || c.label || 'Sublink',
                url: c.url || c.href || '#',
                href: c.href || c.url || '#',
                target: c.target || '_self',
              }))
            : [],
        })),
        storeId: data.storeId || storeId || null,
      };
    }
  } catch {
    // fallback
  }

  return null;
}

/**
 * Fetches all published static and custom pages.
 */
export async function getPages(): Promise<CmsPage[]> {
  try {
    return await apiClient.get<CmsPage[]>('api/storefront/catalog/pages', {
      next: { revalidate: 0, tags: ['pages'] },
    });
  } catch {
    return [];
  }
}

/**
 * Fetches a single static/custom page by its slug or ID.
 */
export async function getPage(slug: string): Promise<CmsPage | null> {
  try {
    const page = await apiClient.get<CmsPage>(
      `api/storefront/catalog/pages/${encodeURIComponent(slug)}`,
      { next: { revalidate: 0, tags: ['pages', `page-${slug}`] } }
    );
    if (page) return page;
  } catch {
    // API fetch failed or returned 404, fall back to built-in page below
  }

  // Graceful fallback for standard storefront pages
  const normalized = slug.toLowerCase().replace(/^\/+/, '').replace(/^(pages|policies)\/+/, '');
  if (normalized === 'about' || normalized === 'about-us') {
    return {
      id: 'fallback-about',
      title: 'About Our Store',
      slug: normalized,
      content: `Welcome to our store! We are dedicated to providing you with the highest quality products and an exceptional shopping experience.\n\nFounded on the principles of innovation, craftsmanship, and customer trust, our collections are carefully curated and rigorously tested. Whether you are looking for everyday essentials or premium statement pieces, we strive to exceed your expectations.\n\nOur team is committed to sustainability, prompt dispatch, and personalized customer care. Thank you for being a valued part of our community!`,
      pageType: 'ABOUT',
      status: 'PUBLISHED',
      metaTitle: 'About Us',
      metaDescription: 'Discover our brand story, mission, and commitment to excellence.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } else if (normalized === 'contact' || normalized === 'contact-us') {
    return {
      id: 'fallback-contact',
      title: 'Contact Us',
      slug: normalized,
      content: `Have a question, feedback, or need assistance with your order? Our customer concierge is here to help.\n\n📧 **Customer Support:** support@omnistore.com\n📱 **Phone / WhatsApp:** +1 (800) 555-0199\n\n🕒 **Support Hours:** Monday to Friday, 9:00 AM – 6:00 PM. We typically reply within 2–4 business hours.`,
      pageType: 'CONTACT',
      status: 'PUBLISHED',
      metaTitle: 'Contact Us',
      metaDescription: 'Get in touch with our customer care concierge.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } else if (normalized === 'privacy' || normalized === 'privacy-policy') {
    return {
      id: 'fallback-privacy',
      title: 'Privacy Policy',
      slug: normalized,
      content: `We value your privacy. We collect only necessary details to process your orders securely (with AES-256 encryption). We never sell your personal information to third parties.`,
      pageType: 'POLICY',
      status: 'PUBLISHED',
      metaTitle: 'Privacy Policy',
      metaDescription: 'Our commitment to data privacy and security.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } else if (normalized === 'terms' || normalized === 'terms-of-service') {
    return {
      id: 'fallback-terms',
      title: 'Terms of Service',
      slug: normalized,
      content: `By purchasing from our store, you agree to our terms of service, payment processing policies, and shipping terms. All products are backed by our satisfaction guarantee.`,
      pageType: 'POLICY',
      status: 'PUBLISHED',
      metaTitle: 'Terms of Service',
      metaDescription: 'General terms and conditions of purchase.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  return null;
}

/**
 * Fetches a single collection by slug, including its metadata.
 * Cached for 5 minutes (300s).
 */
export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  try {
    return await apiClient.get<Collection>(
      `api/storefront/catalog/collections/${encodeURIComponent(slug)}`,
      { next: { revalidate: 300, tags: ['collections', `collection-${slug}`] } }
    );
  } catch {
    return null;
  }
}

/**
 * Fetches all published blog posts for the storefront.
 */
export async function getBlogPosts(params?: { category?: string; tag?: string; search?: string }): Promise<BlogPost[]> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.tag) searchParams.set('tag', params.tag);
    if (params?.search) searchParams.set('search', params.search);

    const query = searchParams.toString();
    const endpoint = `api/storefront/catalog/blogs${query ? `?${query}` : ''}`;

    return await apiClient.get<BlogPost[]>(endpoint, {
      next: { revalidate: 60, tags: ['blogs'] },
    });
  } catch {
    return [];
  }
}

/**
 * Fetches a single published blog post by its URL slug.
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    return await apiClient.get<BlogPost>(
      `api/storefront/catalog/blogs/${encodeURIComponent(slug)}`,
      { next: { revalidate: 60, tags: ['blogs', `blog-${slug}`] } }
    );
  } catch {
    return null;
  }
}

