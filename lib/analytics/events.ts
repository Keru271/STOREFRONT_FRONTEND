// ─── Storefront Analytics & Pixel Event Dispatcher ───────────────────────────
// Dispatches standard e-commerce events across:
// - Meta (fbq)
// - Google Analytics 4 (gtag)
// - TikTok (ttq)
// - Pinterest (pintrk)
// - CleverTap (clevertap.event.push)
// - Adobe Analytics / Launch (adobeDataLayer & _satellite)

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    gtag?: (...args: any[]) => void;
    ttq?: {
      track?: (event: string, params?: Record<string, any>) => void;
      page?: () => void;
      [key: string]: any;
    };
    pintrk?: (...args: any[]) => void;
    clevertap?: {
      event?: {
        push: (eventName: string, props?: Record<string, any>) => void;
      };
      onUserLogin?: {
        push: (props: Record<string, any>) => void;
      };
      profile?: {
        push: (props: Record<string, any>) => void;
      };
      init?: (accountId: string, region?: string) => void;
      [key: string]: any;
    };
    adobeDataLayer?: any[];
    _satellite?: {
      track?: (identifier: string, detail?: any) => void;
      [key: string]: any;
    };
    dataLayer?: any[];
  }
}

/**
 * Dispatches PageView event across active tracking pixels & analytics engines
 */
export function trackPageView(url?: string) {
  if (typeof window === 'undefined') return;

  const currentPath = url || window.location.pathname;

  // Meta Pixel
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'PageView');
  }

  // Google Analytics 4
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: currentPath,
      page_location: window.location.href,
      page_title: document.title,
    });
  }

  // TikTok Pixel
  if (window.ttq && typeof window.ttq.page === 'function') {
    window.ttq.page();
  }

  // Pinterest Tag
  if (typeof window.pintrk === 'function') {
    window.pintrk('track', 'pagevisit');
  }

  // CleverTap
  if (window.clevertap?.event?.push) {
    window.clevertap.event.push('Page Viewed', {
      'Page Path': currentPath,
      'Page Title': document.title,
    });
  }

  // Adobe Analytics / Launch
  if (window.adobeDataLayer) {
    window.adobeDataLayer.push({
      event: 'page-view',
      page: { url: currentPath, title: document.title },
    });
  }
  if (window._satellite?.track) {
    window._satellite.track('page-view', { url: currentPath });
  }
}

/**
 * Dispatches ViewContent / view_item / Product Viewed event when a customer views a PDP
 */
export function trackViewContent(product: {
  id: string;
  name: string;
  price: number;
  currency?: string;
  category?: string;
}) {
  if (typeof window === 'undefined' || !product) return;
  const currency = product.currency || 'USD';

  // Meta Pixel
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'ViewContent', {
      content_name: product.name,
      content_ids: [product.id],
      content_type: 'product',
      value: product.price,
      currency,
    });
  }

  // GA4
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'view_item', {
      currency,
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          item_category: product.category,
        },
      ],
    });
  }

  // TikTok Pixel
  if (window.ttq && typeof window.ttq.track === 'function') {
    window.ttq.track('ViewContent', {
      content_id: product.id,
      content_name: product.name,
      content_type: 'product',
      value: product.price,
      currency,
    });
  }

  // Pinterest Tag
  if (typeof window.pintrk === 'function') {
    window.pintrk('track', 'PageVisit', {
      line_items: [
        {
          product_name: product.name,
          product_id: product.id,
          product_price: product.price,
          product_category: product.category,
        },
      ],
    });
  }

  // CleverTap
  if (window.clevertap?.event?.push) {
    window.clevertap.event.push('Product Viewed', {
      'Product Id': product.id,
      'Product Name': product.name,
      'Price': product.price,
      'Currency': currency,
      'Category': product.category || 'General',
    });
  }

  // Adobe Analytics
  if (window.adobeDataLayer) {
    window.adobeDataLayer.push({
      event: 'product-view',
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        currency,
        category: product.category,
      },
    });
  }
  if (window._satellite?.track) {
    window._satellite.track('product-view', product);
  }
}

/**
 * Dispatches AddToCart / Added to Cart event
 */
export function trackAddToCart(item: {
  id: string;
  name: string;
  price: number;
  quantity: number;
  currency?: string;
  category?: string;
}) {
  if (typeof window === 'undefined' || !item) return;
  const currency = item.currency || 'USD';
  const totalValue = Number((item.price * (item.quantity || 1)).toFixed(2));

  // Meta Pixel
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'AddToCart', {
      content_name: item.name,
      content_ids: [item.id],
      content_type: 'product',
      value: totalValue,
      currency,
    });
  }

  // GA4
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'add_to_cart', {
      currency,
      value: totalValue,
      items: [
        {
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
          item_category: item.category,
        },
      ],
    });
  }

  // TikTok Pixel
  if (window.ttq && typeof window.ttq.track === 'function') {
    window.ttq.track('AddToCart', {
      content_id: item.id,
      content_name: item.name,
      content_type: 'product',
      quantity: item.quantity,
      value: totalValue,
      currency,
    });
  }

  // Pinterest Tag
  if (typeof window.pintrk === 'function') {
    window.pintrk('track', 'AddToCart', {
      value: totalValue,
      order_quantity: item.quantity,
      currency,
      line_items: [
        {
          product_name: item.name,
          product_id: item.id,
          product_price: item.price,
          product_quantity: item.quantity,
        },
      ],
    });
  }

  // CleverTap
  if (window.clevertap?.event?.push) {
    window.clevertap.event.push('Added to Cart', {
      'Product Id': item.id,
      'Product Name': item.name,
      'Price': item.price,
      'Quantity': item.quantity,
      'Amount': totalValue,
      'Currency': currency,
    });
  }

  // Adobe Analytics
  if (window.adobeDataLayer) {
    window.adobeDataLayer.push({
      event: 'add-to-cart',
      product: {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: totalValue,
        currency,
      },
    });
  }
  if (window._satellite?.track) {
    window._satellite.track('add-to-cart', item);
  }
}

/**
 * Dispatches InitiateCheckout / Checkout Started event
 */
export function trackInitiateCheckout(cart: {
  items: any[];
  total: number;
  currency?: string;
  itemCount?: number;
}) {
  if (typeof window === 'undefined' || !cart) return;
  const currency = cart.currency || 'USD';
  const contentIds = (cart.items || []).map((i) => i.productId || i.id || '');

  // Meta Pixel
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'InitiateCheckout', {
      num_items: cart.itemCount || cart.items.length,
      value: cart.total,
      currency,
      content_ids: contentIds,
    });
  }

  // GA4
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'begin_checkout', {
      currency,
      value: cart.total,
      items: (cart.items || []).map((i) => ({
        item_id: i.productId || i.id,
        item_name: i.product?.name || i.title || i.name || 'Product',
        price: i.price,
        quantity: i.quantity || 1,
      })),
    });
  }

  // TikTok Pixel
  if (window.ttq && typeof window.ttq.track === 'function') {
    window.ttq.track('InitiateCheckout', {
      value: cart.total,
      currency,
      contents: (cart.items || []).map((i) => ({
        content_id: i.productId || i.id,
        content_name: i.product?.name || i.title || i.name,
        quantity: i.quantity || 1,
        price: i.price,
      })),
    });
  }

  // CleverTap
  if (window.clevertap?.event?.push) {
    window.clevertap.event.push('Checkout Started', {
      'Total Amount': cart.total,
      'Items Count': cart.itemCount || cart.items.length,
      'Currency': currency,
    });
  }

  // Adobe Analytics
  if (window.adobeDataLayer) {
    window.adobeDataLayer.push({
      event: 'checkout-started',
      cart: {
        total: cart.total,
        itemCount: cart.itemCount || cart.items.length,
        currency,
      },
    });
  }
  if (window._satellite?.track) {
    window._satellite.track('checkout-started', cart);
  }
}

/**
 * Dispatches Purchase / Charged event upon completed order confirmation
 */
export function trackPurchase(order: {
  id: string;
  total: number;
  currency?: string;
  items?: any[];
  tax?: number;
  shipping?: number;
}) {
  if (typeof window === 'undefined' || !order) return;
  const currency = order.currency || 'USD';
  const contentIds = (order.items || []).map((i) => i.productId || i.id || '');

  // Meta Pixel
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Purchase', {
      value: order.total,
      currency,
      content_ids: contentIds,
      content_type: 'product',
    });
  }

  // GA4
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'purchase', {
      transaction_id: order.id,
      value: order.total,
      currency,
      tax: order.tax || 0,
      shipping: order.shipping || 0,
      items: (order.items || []).map((i) => ({
        item_id: i.productId || i.id,
        item_name: i.product?.name || i.title || i.name || 'Product',
        price: i.price,
        quantity: i.quantity || 1,
      })),
    });
  }

  // TikTok Pixel
  if (window.ttq && typeof window.ttq.track === 'function') {
    window.ttq.track('PlaceAnOrder', {
      value: order.total,
      currency,
      contents: (order.items || []).map((i) => ({
        content_id: i.productId || i.id,
        content_name: i.product?.name || i.title || i.name,
        quantity: i.quantity || 1,
        price: i.price,
      })),
    });
  }

  // Pinterest Tag
  if (typeof window.pintrk === 'function') {
    window.pintrk('track', 'Checkout', {
      value: order.total,
      order_quantity: (order.items || []).reduce((acc: number, item: any) => acc + (item.quantity || 1), 0) || 1,
      currency,
    });
  }

  // CleverTap
  if (window.clevertap?.event?.push) {
    window.clevertap.event.push('Charged', {
      'Amount': order.total,
      'Payment Id': order.id,
      'Currency': currency,
      'Items': (order.items || []).map((i) => ({
        'Name': i.product?.name || i.name || i.title,
        'Price': i.price,
        'Quantity': i.quantity || 1,
      })),
    });
  }

  // Adobe Analytics
  if (window.adobeDataLayer) {
    window.adobeDataLayer.push({
      event: 'order-completed',
      order: {
        id: order.id,
        total: order.total,
        tax: order.tax || 0,
        shipping: order.shipping || 0,
        currency,
      },
    });
  }
  if (window._satellite?.track) {
    window._satellite.track('order-completed', order);
  }
}
