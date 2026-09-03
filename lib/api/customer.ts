// ─── Customer / Auth API ──────────────────────────────────────────────────────
// Customer registration, login, logout, profile (getInfo), profile update (editInfo), and orders.
// Authentication is securely maintained via HttpOnly session cookies.

import { apiClient } from './client';
import type {
  AuthResponse,
  CustomerAddress,
  CustomerInfo,
  CustomerLoginInput,
  CustomerRegisterInput,
  EditCustomerInput,
  Order,
} from './types';

/**
 * Registers a new customer account.
 * Automatically sets the HttpOnly session cookie.
 */
export async function registerCustomer(
  data: CustomerRegisterInput
): Promise<AuthResponse> {
  const res = await apiClient.post<AuthResponse>('api/storefront/account/register', data);
  if (res?.accessToken && typeof window !== 'undefined') {
    localStorage.setItem('customer_token', res.accessToken);
  }
  return res;
}

/**
 * Authenticates a customer with email + password.
 * Automatically sets the HttpOnly session cookie and stores client fallback token.
 */
export async function loginCustomer(
  data: CustomerLoginInput
): Promise<AuthResponse> {
  const res = await apiClient.post<AuthResponse>('api/storefront/account/login', data);
  if (res?.accessToken && typeof window !== 'undefined') {
    localStorage.setItem('customer_token', res.accessToken);
  }
  return res;
}

/**
 * Logs out the authenticated customer by clearing the session.
 */
export async function logoutCustomer(): Promise<{ message: string }> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('customer_token');
  }
  return apiClient.post<{ message: string }>('api/storefront/account/logout', {});
}

/**
 * Initiates forgot password flow by requesting a 6-digit OTP verification code.
 */
export async function forgotPassword(
  email: string
): Promise<{ success: boolean; message: string; otp?: string; expiresIn?: number }> {
  return apiClient.post<{ success: boolean; message: string; otp?: string; expiresIn?: number }>(
    'api/storefront/account/forgot-password',
    { email }
  );
}

/**
 * Verifies a 6-digit OTP code sent to the customer's email.
 */
export async function verifyOtp(
  email: string,
  otp: string
): Promise<{ success: boolean; message: string }> {
  return apiClient.post<{ success: boolean; message: string }>(
    'api/storefront/account/verify-otp',
    { email, otp }
  );
}

/**
 * Resets the customer's password after verifying the OTP code.
 */
export async function resetPassword(data: {
  email: string;
  otp?: string;
  token?: string;
  newPassword: string;
}): Promise<{ success: boolean; message: string }> {
  return apiClient.post<{ success: boolean; message: string }>(
    'api/storefront/account/reset-password',
    data
  );
}

/**
 * Fetches the authenticated customer's full profile and stats (getInfo).
 * Utilizes the HttpOnly cookie automatically.
 */
export async function getInfo(token?: string): Promise<CustomerInfo> {
  return apiClient.get<CustomerInfo>('api/storefront/account/me', { token });
}

/**
 * Alias for getInfo.
 */
export const getCustomerProfile = getInfo;

/**
 * Updates the authenticated customer's profile info (editInfo).
 * Utilizes the HttpOnly cookie automatically.
 */
export async function editInfo(
  data: EditCustomerInput,
  token?: string
): Promise<{ message: string; customer: CustomerInfo }> {
  return apiClient.put<{ message: string; customer: CustomerInfo }>(
    'api/storefront/account/me',
    data,
    { token }
  );
}

/**
 * Alias for editInfo.
 */
export const editCustomerProfile = editInfo;

/**
 * Fetches all saved delivery addresses for the authenticated customer.
 */
export async function getCustomerAddresses(token?: string): Promise<{ addresses: CustomerAddress[]; defaultAddress: CustomerAddress | null }> {
  try {
    return await apiClient.get<{ addresses: CustomerAddress[]; defaultAddress: CustomerAddress | null }>('api/storefront/account/addresses', { token });
  } catch {
    return { addresses: [], defaultAddress: null };
  }
}

/**
 * Adds a new labeled address (Home, Office, Other) for the authenticated customer.
 */
export async function addCustomerAddress(
  data: CustomerAddress,
  token?: string
): Promise<{ message: string; address: CustomerAddress; addresses: CustomerAddress[] }> {
  return apiClient.post<{ message: string; address: CustomerAddress; addresses: CustomerAddress[] }>(
    'api/storefront/account/addresses',
    data,
    { token }
  );
}

/**
 * Updates an existing labeled address.
 */
export async function updateCustomerAddress(
  id: string,
  data: Partial<CustomerAddress>,
  token?: string
): Promise<{ message: string; addresses: CustomerAddress[] }> {
  return apiClient.put<{ message: string; addresses: CustomerAddress[] }>(
    `api/storefront/account/addresses/${encodeURIComponent(id)}`,
    data,
    { token }
  );
}

/**
 * Deletes a saved address.
 */
export async function deleteCustomerAddress(
  id: string,
  token?: string
): Promise<{ message: string; addresses: CustomerAddress[] }> {
  return apiClient.delete<{ message: string; addresses: CustomerAddress[] }>(
    `api/storefront/account/addresses/${encodeURIComponent(id)}`,
    { token }
  );
}

/**
 * Sets an address as the default primary address.
 */
export async function setDefaultCustomerAddress(
  id: string,
  token?: string
): Promise<{ message: string; addresses: CustomerAddress[] }> {
  return apiClient.put<{ message: string; addresses: CustomerAddress[] }>(
    `api/storefront/account/addresses/${encodeURIComponent(id)}/default`,
    {},
    { token }
  );
}

/**
 * Fetches all orders for the authenticated customer.
 * Utilizes the HttpOnly cookie automatically.
 */
export async function getCustomerOrders(token?: string): Promise<Order[]> {
  try {
    return await apiClient.get<Order[]>('api/storefront/account/orders', { token });
  } catch {
    return [];
  }
}

/**
 * Fetches a single order by ID for the authenticated customer.
 * Utilizes the HttpOnly cookie automatically.
 */
export async function getCustomerOrder(
  orderIdOrToken: string,
  orderId?: string
): Promise<Order | null> {
  const targetId = orderId || orderIdOrToken;
  const targetToken = orderId ? orderIdOrToken : undefined;
  try {
    return await apiClient.get<Order>(
      `api/storefront/account/orders/${encodeURIComponent(targetId)}`,
      { token: targetToken }
    );
  } catch {
    return null;
  }
}

