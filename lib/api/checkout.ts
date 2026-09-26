import { apiClient } from './client';
import {
  CheckoutCartItemPayload,
  CheckoutAddress,
  CheckoutSummaryResponse,
  AvailablePaymentMethodsResponse,
  RazorpayOrderResponse,
  PaypalOrderResponse,
  OrderPlacedResponse,
  ValidateCouponResponse,
  GiftCardBalanceResponse,
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
    payload,
  );
  return response;
}

/**
 * Check gift card validity and live balance
 */
export async function checkGiftCardBalance(code: string): Promise<GiftCardBalanceResponse> {
  const response = await apiClient.post<GiftCardBalanceResponse>(
    'api/storefront/gift-cards/check-balance',
    { code }
  );
  return response;
}

/**
 * Fetch available payment gateways and regional recommendation (India: Razorpay, Int: PayPal)
 */
export async function getAvailablePaymentMethods(
  country: string = 'India',
  currency: string = 'INR',
): Promise<AvailablePaymentMethodsResponse> {
  const response = await apiClient.get<AvailablePaymentMethodsResponse>(
    `api/storefront/checkout/payment-methods?country=${encodeURIComponent(country)}&currency=${encodeURIComponent(currency)}`,
  );
  return response;
}

/**
 * Calculate cart taxes, regional shipping rates, coupon discounts, and gift cards
 */
export async function getCheckoutSummary(payload: {
  items: CheckoutCartItemPayload[];
  couponCode?: string;
  giftCardCode?: string;
  country?: string;
  state?: string;
}): Promise<CheckoutSummaryResponse> {
  const response = await apiClient.post<CheckoutSummaryResponse>(
    'api/storefront/checkout/summary',
    payload,
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
  giftCardCode?: string;
  cartToken?: string;
  shippingMethod?: string;
  shippingFee?: number;
}): Promise<RazorpayOrderResponse> {
  const response = await apiClient.post<RazorpayOrderResponse>(
    'api/storefront/checkout/razorpay/create-order',
    payload,
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
  giftCardCode?: string;
  cartToken?: string;
  shippingMethod?: string;
  shippingFee?: number;
}): Promise<OrderPlacedResponse> {
  const response = await apiClient.post<OrderPlacedResponse>(
    'api/storefront/checkout/razorpay/verify',
    payload,
  );
  return response;
}

/**
 * 💙 PayPal: Create PayPal order for global & cross-border checkout
 */
export async function createPaypalOrder(payload: {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: CheckoutAddress;
  items: CheckoutCartItemPayload[];
  couponCode?: string;
  giftCardCode?: string;
  cartToken?: string;
  currency?: string;
  shippingMethod?: string;
  shippingFee?: number;
}): Promise<PaypalOrderResponse> {
  const response = await apiClient.post<PaypalOrderResponse>(
    'api/storefront/checkout/paypal/create-order',
    payload,
  );
  return response;
}

/**
 * 💙 PayPal: Capture PayPal payment and finalize order
 */
export async function capturePaypalOrder(payload: {
  paypalOrderId: string;
  orderNumber?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: CheckoutAddress;
  items: CheckoutCartItemPayload[];
  couponCode?: string;
  giftCardCode?: string;
  cartToken?: string;
  currency?: string;
  shippingMethod?: string;
  shippingFee?: number;
}): Promise<OrderPlacedResponse> {
  const response = await apiClient.post<OrderPlacedResponse>(
    'api/storefront/checkout/paypal/capture-order',
    payload,
  );
  return response;
}

/**
 * 💵 COD / Direct / Gift Card Checkout
 */
export async function processDirectCheckout(payload: {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: CheckoutAddress;
  items: CheckoutCartItemPayload[];
  couponCode?: string;
  giftCardCode?: string;
  cartToken?: string;
  paymentMethod: 'COD' | 'CREDIT_CARD' | 'RAZORPAY' | 'GIFT_CARD';
  shippingMethod?: string;
  shippingFee?: number;
}): Promise<OrderPlacedResponse> {
  const response = await apiClient.post<OrderPlacedResponse>(
    'api/storefront/checkout/payment',
    payload,
  );
  return response;
}

export interface OrderConfirmationDetails {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  totalAmount: number;
  subtotalAmount: number;
  taxAmount: number;
  shippingAmount: number;
  currency: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  shippingAddress?: {
    name?: string;
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    phone?: string;
  } | null;
  items?: Array<{
    productId?: string;
    variantId?: string;
    name: string;
    price: number;
    quantity: number;
    sku?: string;
    image?: string;
  }>;
  notes?: Array<{ text: string; author?: string; createdAt?: string }>;
  carrier?: string;
  trackingNumber?: string;
  createdAt: string;
  payment?: {
    gateway: string;
    method: string;
    paymentId?: string;
    orderId?: string;
    status?: string;
  };
}

/**
 * 📋 Order Confirmation: Fetch full verified order details by order reference
 */
export async function getOrderConfirmation(
  orderNumber: string,
): Promise<{ success: boolean; order: OrderConfirmationDetails }> {
  return apiClient.get<{ success: boolean; order: OrderConfirmationDetails }>(
    `api/storefront/checkout/order-confirmation/${encodeURIComponent(orderNumber)}`,
  );
}


