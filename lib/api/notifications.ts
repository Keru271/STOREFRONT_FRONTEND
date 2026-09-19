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
}

const rawCmsUrl = (process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');
const CMS_API_URL = rawCmsUrl.endsWith('/api') ? rawCmsUrl : `${rawCmsUrl}/api`;

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
 * Submit a Back-in-Stock / Notify Me request for a product or variant
 */
export async function submitProductNotification(
  data: ProductNotificationInput
): Promise<ProductNotificationResponse> {
  const storeId = data.storeId || getStoreId();

  const res = await fetch(`${CMS_API_URL}/product-notifications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(storeId ? { 'x-store-id': storeId } : {}),
    },
    body: JSON.stringify({
      ...data,
      storeId: storeId || undefined,
    }),
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
