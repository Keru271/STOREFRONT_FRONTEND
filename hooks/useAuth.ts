'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  loginCustomer,
  registerCustomer,
  logoutCustomer as apiLogoutCustomer,
  getInfo as apiGetInfo,
  editInfo as apiEditInfo,
  addCustomerAddress as apiAddAddress,
  updateCustomerAddress as apiUpdateAddress,
  deleteCustomerAddress as apiDeleteAddress,
  setDefaultCustomerAddress as apiSetDefaultAddress,
} from '@/lib/api/customer';
import type {
  CustomerInfo,
  CustomerAddress,
  CustomerLoginInput,
  CustomerRegisterInput,
  EditCustomerInput,
} from '@/lib/api/types';

export interface UseAuthReturn {
  customer: CustomerInfo | null;
  addresses: CustomerAddress[];
  defaultAddress: CustomerAddress | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: CustomerLoginInput) => Promise<void>;
  register: (data: CustomerRegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  getInfo: () => Promise<CustomerInfo | null>;
  editInfo: (data: EditCustomerInput) => Promise<CustomerInfo>;
  addAddress: (data: CustomerAddress) => Promise<void>;
  updateAddress: (id: string, data: Partial<CustomerAddress>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

/**
 * Manages customer authentication, profile state, and labeled addresses via secure HttpOnly session cookies.
 */
export function useAuth(): UseAuthReturn {
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    // For guest visitors with no stored customer token, skip calling /account/me
    // to prevent unwanted 401 unauthorized errors in console
    if (typeof window !== 'undefined' && !localStorage.getItem('customer_token')) {
      setCustomer(null);
      return null;
    }

    try {
      const profile = await apiGetInfo();
      setCustomer(profile);
      return profile;
    } catch {
      setCustomer(null);
      return null;
    }
  }, []);

  // On mount, check if HttpOnly session or customer_token is valid
  useEffect(() => {
    fetchProfile().finally(() => setIsLoading(false));
  }, [fetchProfile]);

  const login = useCallback(async (data: CustomerLoginInput) => {
    setIsLoading(true);
    try {
      const res = await loginCustomer(data);
      if (res?.accessToken && typeof window !== 'undefined') {
        localStorage.setItem('customer_token', res.accessToken);
      }
      await fetchProfile();
    } finally {
      setIsLoading(false);
    }
  }, [fetchProfile]);

  const register = useCallback(async (data: CustomerRegisterInput) => {
    setIsLoading(true);
    try {
      const res = await registerCustomer(data);
      if (res?.accessToken && typeof window !== 'undefined') {
        localStorage.setItem('customer_token', res.accessToken);
      }
      await fetchProfile();
    } finally {
      setIsLoading(false);
    }
  }, [fetchProfile]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('customer_token');
      }
      await apiLogoutCustomer().catch(() => {});
    } finally {
      setCustomer(null);
      setIsLoading(false);
    }
  }, []);

  const getInfo = useCallback(async (): Promise<CustomerInfo | null> => {
    return fetchProfile();
  }, [fetchProfile]);

  const editInfo = useCallback(async (data: EditCustomerInput): Promise<CustomerInfo> => {
    const res = await apiEditInfo(data);
    const updated = res.customer;
    setCustomer(updated);
    return updated;
  }, []);

  const addAddress = useCallback(async (data: CustomerAddress) => {
    const res = await apiAddAddress(data);
    if (res.addresses) {
      setCustomer((prev) => prev ? {
        ...prev,
        addresses: res.addresses,
        address: res.addresses.find(a => a.isDefault) || res.addresses[0] || null,
      } : null);
    }
  }, []);

  const updateAddress = useCallback(async (id: string, data: Partial<CustomerAddress>) => {
    const res = await apiUpdateAddress(id, data);
    if (res.addresses) {
      setCustomer((prev) => prev ? {
        ...prev,
        addresses: res.addresses,
        address: res.addresses.find(a => a.isDefault) || res.addresses[0] || null,
      } : null);
    }
  }, []);

  const deleteAddress = useCallback(async (id: string) => {
    const res = await apiDeleteAddress(id);
    if (res.addresses) {
      setCustomer((prev) => prev ? {
        ...prev,
        addresses: res.addresses,
        address: res.addresses.find(a => a.isDefault) || res.addresses[0] || null,
      } : null);
    }
  }, []);

  const setDefaultAddress = useCallback(async (id: string) => {
    const res = await apiSetDefaultAddress(id);
    if (res.addresses) {
      setCustomer((prev) => prev ? {
        ...prev,
        addresses: res.addresses,
        address: res.addresses.find(a => a.isDefault) || res.addresses[0] || null,
      } : null);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  const addresses = customer?.addresses || (customer?.address ? [customer.address] : []);
  const defaultAddress = customer?.address || addresses.find(a => a.isDefault) || addresses[0] || null;

  return {
    customer,
    addresses,
    defaultAddress,
    isLoading,
    isAuthenticated: !!customer,
    login,
    register,
    logout,
    getInfo,
    editInfo,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    refreshProfile,
  };
}

