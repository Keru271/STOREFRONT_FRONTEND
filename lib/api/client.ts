// ─── API Base Client ──────────────────────────────────────────────────────────
// Central fetch wrapper. ALL API calls must go through this client.
// Never import `fetch` directly in components or templates.
//
// Architecture:
//   - Server Components  → use apiClient directly; storeId from env vars only
//   - Client Components  → use apiClient directly; storeId may also read localStorage
//   - The `token` option carries a per-request JWT for authenticated endpoints

import type { ApiErrorResponse } from './types';

const BASE_URL =
  process.env.NEXT_PUBLIC_STOREFRONT_API_URL || 'http://localhost:5001';

// Store identification — set via environment variables.
// In server components these are the only source of truth.
// In client components, localStorage can override (see getClientStoreId).
const ENV_STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || '';
const ENV_STORE_SLUG = process.env.NEXT_PUBLIC_STORE_SLUG || '';

// ── Custom API Error ──────────────────────────────────────────────────────────

console.log({ ENV_STORE_ID, ENV_STORE_SLUG })

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }

  isNotFound() { return this.statusCode === 404; }
  isUnauthorized() { return this.statusCode === 401; }
  isForbidden() { return this.statusCode === 403; }
}

// ── Store ID resolution ───────────────────────────────────────────────────────
// Reads localStorage only in browser contexts; never on the server.
// This prevents "localStorage is not defined" SSR crashes.

function getClientStoreId(): string {
  if (typeof window === 'undefined') return ENV_STORE_ID;
  try {
    return (
      localStorage.getItem('activeStoreId') ||
      localStorage.getItem('storeId') ||
      localStorage.getItem('current_store_id') ||
      ENV_STORE_ID
    );
  } catch {
    return ENV_STORE_ID;
  }
}

function getClientStoreSlug(): string {
  if (typeof window === 'undefined') return ENV_STORE_SLUG;
  try {
    return localStorage.getItem('storeSlug') || ENV_STORE_SLUG;
  } catch {
    return ENV_STORE_SLUG;
  }
}

// ── Fetch Options ─────────────────────────────────────────────────────────────

export interface ClientFetchOptions extends Omit<RequestInit, 'body'> {
  /** Bearer token for authenticated requests */
  token?: string;
  /** Explicit store ID header override (skips localStorage lookup) */
  storeId?: string;
  /** Explicit store slug header override */
  storeSlug?: string;
  /** Next.js cache / revalidation options */
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

// ── Core Fetch ────────────────────────────────────────────────────────────────

async function apiFetch<T>(
  endpoint: string,
  options: ClientFetchOptions & { body?: string } = {}
): Promise<T> {
  const { token, storeId, storeSlug, next, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    ...(fetchOptions.headers as Record<string, string>),
  };

  // Only set Content-Type for requests that have a body
  if (fetchOptions.body !== undefined || (fetchOptions.method && ['POST', 'PUT', 'PATCH'].includes(fetchOptions.method.toUpperCase()))) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Resolve store identity — caller override → localStorage (client only) → env
  const resolvedStoreId = storeId || getClientStoreId() || 'default-store-id';
  const resolvedStoreSlug = storeSlug || getClientStoreSlug();

  console.log({ resolvedStoreId, resolvedStoreSlug })

  // Multi-tenant store identification headers
  headers['x-store-id'] = resolvedStoreId;
  headers['store-id'] = resolvedStoreId;
  headers['x-tenant-id'] = resolvedStoreId;

  if (resolvedStoreSlug) {
    headers['x-store-slug'] = resolvedStoreSlug;
  }

  // Remove leading slash if present
  let cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

  // Append storeId query param if not already present
  if (resolvedStoreId && resolvedStoreId !== 'default-store-id' && !cleanEndpoint.includes('storeId=')) {
    const separator = cleanEndpoint.includes('?') ? '&' : '?';
    cleanEndpoint = `${cleanEndpoint}${separator}storeId=${encodeURIComponent(resolvedStoreId)}`;
  }

  const response = await fetch(`${BASE_URL}/${cleanEndpoint}`, {
    credentials: fetchOptions.credentials || 'include',
    ...fetchOptions,
    headers,
    ...(next ? { next } : {}),
  });

  console.log({ response })

  if (!response.ok) {
    const errorData: ApiErrorResponse = await response
      .json()
      .catch(() => ({ message: `Request failed with status ${response.status}` }));

    throw new ApiError(
      errorData.message || `HTTP ${response.status}`,
      response.status
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

// ── HTTP Method Helpers ───────────────────────────────────────────────────────

export const apiClient = {
  get<T>(endpoint: string, options?: ClientFetchOptions): Promise<T> {
    return apiFetch<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(
    endpoint: string,
    body: unknown,
    options?: ClientFetchOptions
  ): Promise<T> {
    return apiFetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  put<T>(
    endpoint: string,
    body: unknown,
    options?: ClientFetchOptions
  ): Promise<T> {
    return apiFetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  patch<T>(
    endpoint: string,
    body: unknown,
    options?: ClientFetchOptions
  ): Promise<T> {
    return apiFetch<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  delete<T>(endpoint: string, options?: ClientFetchOptions): Promise<T> {
    return apiFetch<T>(endpoint, { ...options, method: 'DELETE' });
  },
};
