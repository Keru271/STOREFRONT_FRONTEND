// ─── API Base Client ──────────────────────────────────────────────────────────
// Central fetch wrapper. ALL API calls must go through this client.
// Never import `fetch` directly in components or templates.

import type { ApiErrorResponse } from './types';

const BASE_URL =
  process.env.NEXT_PUBLIC_STOREFRONT_API_URL || 'http://localhost:5001';

// ── Custom API Error ──────────────────────────────────────────────────────────

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }

  isNotFound() {
    return this.statusCode === 404;
  }

  isUnauthorized() {
    return this.statusCode === 401;
  }

  isForbidden() {
    return this.statusCode === 403;
  }
}

// ── Fetch Options ─────────────────────────────────────────────────────────────

export interface ClientFetchOptions extends Omit<RequestInit, 'body'> {
  /** Bearer token for authenticated requests */
  token?: string;
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
  const { token, next, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

  const response = await fetch(`${BASE_URL}/${cleanEndpoint}`, {
    ...fetchOptions,
    headers,
    // Pass Next.js cache config if provided
    ...(next ? { next } : {}),
  });

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
