'use client';

import { useState, useEffect, useCallback } from 'react';
import { loginCustomer, registerCustomer, getCustomerProfile } from '@/lib/api/customer';
import type {
  CustomerProfile,
  CustomerLoginInput,
  CustomerRegisterInput,
} from '@/lib/api/types';

const TOKEN_KEY = 'sf_auth_token';

export interface UseAuthReturn {
  customer: CustomerProfile | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: CustomerLoginInput) => Promise<void>;
  register: (data: CustomerRegisterInput) => Promise<void>;
  logout: () => void;
}

/**
 * Manages JWT-based customer authentication.
 * Token is stored in localStorage under 'sf_auth_token'.
 */
export function useAuth(): UseAuthReturn {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, restore session from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (storedToken) {
      setToken(storedToken);
      getCustomerProfile(storedToken)
        .then(setCustomer)
        .catch(() => {
          // Token expired or invalid — clear it
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (data: CustomerLoginInput) => {
    const response = await loginCustomer(data);
    localStorage.setItem(TOKEN_KEY, response.token);
    setToken(response.token);
    setCustomer(response.customer);
  }, []);

  const register = useCallback(async (data: CustomerRegisterInput) => {
    const response = await registerCustomer(data);
    localStorage.setItem(TOKEN_KEY, response.token);
    setToken(response.token);
    setCustomer(response.customer);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setCustomer(null);
  }, []);

  return {
    customer,
    token,
    isLoading,
    isAuthenticated: !!token && !!customer,
    login,
    register,
    logout,
  };
}
