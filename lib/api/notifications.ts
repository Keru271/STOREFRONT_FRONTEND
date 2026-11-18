import { apiClient } from './client';

export interface ProductNotificationInput {
  productId: string;
  productName: string;
  productSku?: string | null;
  productImage?: string | null;
  productPrice?: number | null;
  variantId?: string | null;
  variantName?: string | null;
  customerEmail: string;
  customerName?: string | null;
  customerPhone?: string | null;
  storeId?: string | null;
}

export interface ProductNotificationResponse {
  id: string;
  productId: string;
  productName: string;
  variantName?: string | null;
  customerEmail: string;
  status: string;
  message?: string;
  storeId?: string | null;
}

function getStoreId(): string {
  if (typeof window === 'undefined') return process.env.NEXT_PUBLIC_STORE_ID || '';
  try {
    return (
      localStorage.getItem('activeStoreId') ||
      localStorage.getItem('storeId') ||
      localStorage.getItem('current_store_id') ||
      process.env.NEXT_PUBLIC_STORE_ID ||
      ''
    );
  } catch {
    return process.env.NEXT_PUBLIC_STORE_ID || '';
  }
}

/**
 * Resolve an authoritative API base URL for notifications,
 * preventing accidental fallback to localhost when running on deployed domains.
 */
function resolveBackendBaseUrl(): string {
  const envSf = (process.env.NEXT_PUBLIC_STOREFRONT_API_URL || '').trim().replace(/\/+$/, '');
  const envCms = (process.env.NEXT_PUBLIC_CMS_API_URL || '').trim().replace(/\/+$/, '');

  if (typeof window !== 'undefined') {
    const isLocalhost =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    // In production / live domains (e.g. *.netlify.app):
    if (!isLocalhost) {
      if (envSf && !envSf.includes('localhost')) return envSf;
      if (envCms && !envCms.includes('localhost')) return envCms;
      // Use relative path to hit Next.js same-origin API route to avoid CORS / mixed-content
      return '';
    }
  }

  // Local development fallback
  return envSf || envCms || 'http://localhost:5001';
}

/**
 * Submit a Back-in-Stock / Notify Me request for a product or variant
 */
export async function submitProductNotification(
  data: ProductNotificationInput
): Promise<ProductNotificationResponse> {
  const storeId = data.storeId || getStoreId();
  const payload = {
    ...data,
    storeId: storeId || undefined,
  };

  // 1. Primary path: Use the standard apiClient configured with the storefront backend
  try {
    return await apiClient.post<ProductNotificationResponse>(
      'api/storefront/product-notifications',
      payload
    );
  } catch (err: any) {
    // If endpoint is mapped without 'storefront', try api/product-notifications
    if (err?.statusCode === 404 || err?.isNotFound?.()) {
      try {
        return await apiClient.post<ProductNotificationResponse>(
          'api/product-notifications',
          payload
        );
      } catch (subErr: any) {
        if (!subErr?.statusCode || subErr?.statusCode >= 500) {
          // Continue to Next.js API fallback below
        } else {
          throw subErr;
        }
      }
    } else if (err?.statusCode && err?.statusCode < 500) {
      // Validation error or client error returned by backend
      throw err;
    }
  }

  // 2. Resilient fallback: Try internal Next.js API route or resolved backend URL
  const baseUrl = resolveBackendBaseUrl();
  const endpoint = baseUrl
    ? `${baseUrl}/api/product-notifications`
    : '/api/product-notifications';

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(storeId ? { 'x-store-id': storeId } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errorMsg = 'Failed to submit notify-me request';
    try {
      const errJson = await res.json();
      errorMsg = errJson.message || errorMsg;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return res.json();
}
