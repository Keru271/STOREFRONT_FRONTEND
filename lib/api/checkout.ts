import { apiClient } from './client';
import {
  CheckoutCartItemPayload,
  CheckoutAddress,
  CheckoutSummaryResponse,
  AvailablePaymentMethodsResponse,
  RazorpayOrderResponse,
  StripeIntentResponse,
  OrderPlacedResponse,
  ValidateCouponResponse,
} from './types';

/**
 * Validate a discount coupon code against cart subtotal
 */
export async function validateCoupon(payload: {
  code?: string;
  cartSubtotal: number;
  productIds?: string[];
  customerGroup?: string;
}): Promise<ValidateCouponResponse> {
  const response = await apiClient.post<ValidateCouponResponse>(
    'api/storefront/discounts/validate',
    payload
  );
  return response;
}

/**
 * Fetch available payment gateways and regional recommendation (India: Razorpay, Int: Stripe)
 */
export async function getAvailablePaymentMethods(
  country: string = 'India',
  currency: string = 'INR'
): Promise<AvailablePaymentMethodsResponse> {
  const response = await apiClient.get<AvailablePaymentMethodsResponse>(
    `api/storefront/checkout/payment-methods?country=${encodeURIComponent(country)}&currency=${encodeURIComponent(currency)}`
  );
  return response;
}

/**
 * Calculate cart taxes, regional shipping rates, and coupon discounts
 */
export async function getCheckoutSummary(payload: {
  items: CheckoutCartItemPayload[];
  couponCode?: string;
  country?: string;
  state?: string;
}): Promise<CheckoutSummaryResponse> {
  const response = await apiClient.post<CheckoutSummaryResponse>(
    'api/storefront/checkout/summary',
    payload
  );
  return response;
}

/**
 * 🇮🇳 Razorpay: Initialize Razorpay Order with order amount in subunit (paisa)
 */
export async function createRazorpayOrder(payload: {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: CheckoutAddress;
  items: CheckoutCartItemPayload[];
  couponCode?: string;
}): Promise<RazorpayOrderResponse> {
  const response = await apiClient.post<RazorpayOrderResponse>(
    'api/storefront/checkout/razorpay/create-order',
    payload
  );
  return response;
}

/**
 * 🇮🇳 Razorpay: Verify HMAC SHA256 payment signature and finalize order
 */
export async function verifyRazorpayPayment(payload: {
  orderNumber?: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: CheckoutAddress;
  items: CheckoutCartItemPayload[];
  couponCode?: string;
}): Promise<OrderPlacedResponse> {
  const response = await apiClient.post<OrderPlacedResponse>(
    'api/storefront/checkout/razorpay/verify',
    payload
  );
  return response;
}

/**
 * 🌍 Stripe: Create Payment Intent for international cards & Apple Pay
 */
export async function createStripePaymentIntent(payload: {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: CheckoutAddress;
  items: CheckoutCartItemPayload[];
  couponCode?: string;
  currency?: string;
}): Promise<StripeIntentResponse> {
  const response = await apiClient.post<StripeIntentResponse>(
    'api/storefront/checkout/stripe/create-intent',
    payload
  );
  return response;
}

/**
 * 🌍 Stripe: Finalize international order upon card confirmation
 */
export async function verifyStripePayment(payload: {
  orderNumber?: string;
  paymentIntentId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: CheckoutAddress;
  items: CheckoutCartItemPayload[];
  couponCode?: string;
}): Promise<OrderPlacedResponse> {
  const response = await apiClient.post<OrderPlacedResponse>(
    'api/storefront/checkout/stripe/verify',
    payload
  );
  return response;
}

/**
 * 💵 COD / Direct Checkout
 */
export async function processDirectCheckout(payload: {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: CheckoutAddress;
  items: CheckoutCartItemPayload[];
  couponCode?: string;
  paymentMethod: 'COD' | 'CREDIT_CARD' | 'RAZORPAY' | 'STRIPE';
}): Promise<OrderPlacedResponse> {
  const response = await apiClient.post<OrderPlacedResponse>(
    'api/storefront/checkout/payment',
    payload
  );
  return response;
}
