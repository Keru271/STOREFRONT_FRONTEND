// ─── Customer / Auth API ──────────────────────────────────────────────────────
// Customer registration, login, profile, and order management.
// All authenticated calls require a valid JWT token.

import { apiClient } from './client';
import type {
  AuthResponse,
  CustomerLoginInput,
  CustomerProfile,
  CustomerRegisterInput,
  Order,
} from './types';

/**
 * Registers a new customer account.
 * Returns the auth token and profile on success.
 */
export async function registerCustomer(
  data: CustomerRegisterInput
): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>('api/storefront/account/register', data);
}

/**
 * Authenticates a customer with email + password.
 * Returns the auth token and profile on success.
 */
export async function loginCustomer(
  data: CustomerLoginInput
): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>('api/storefront/account/login', data);
}

/**
 * Fetches the authenticated customer's profile.
 * Requires a valid JWT token.
 */
export async function getCustomerProfile(token: string): Promise<CustomerProfile> {
  return apiClient.get<CustomerProfile>('api/storefront/account/me', { token });
}

/**
 * Fetches all orders for the authenticated customer.
 * Requires a valid JWT token.
 */
export async function getCustomerOrders(token: string): Promise<Order[]> {
  try {
    return await apiClient.get<Order[]>('api/storefront/account/orders', { token });
  } catch {
    return [];
  }
}

/**
 * Fetches a single order by ID for the authenticated customer.
 * Requires a valid JWT token.
 */
export async function getCustomerOrder(
  token: string,
  orderId: string
): Promise<Order | null> {
  try {
    return await apiClient.get<Order>(
      `api/storefront/account/orders/${encodeURIComponent(orderId)}`,
      { token }
    );
  } catch {
    return null;
  }
}
