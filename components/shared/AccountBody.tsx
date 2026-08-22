'use client';

// ─── Shared Account Commerce Component ─────────────────────────────────────────
// Full customer dashboard integrated with CMS store settings, order management,
// multiple labeled addresses (Home, Office, Other), dynamic currency, and profile sync.

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ThemeConfig, Order, OrderItem, CustomerAddress } from '@/lib/api/types';
import { useAuth } from '@/hooks/useAuth';
import { getCustomerOrders } from '@/lib/api/customer';

// ── Inline Accessible SVGs ───────────────────────────────────────────────────
function UserIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function ShoppingBagIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}

function MapPinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function HomeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function BuildingIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

function ShieldCheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function PackageIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

function TruckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  );
}

function PrinterIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
  );
}

function ChevronRightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function XIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function PlusIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function Edit2Icon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function Trash2Icon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function CreditCardIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}

function MailIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function PhoneIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function HelpCircleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function RefreshCwIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

function LogOutIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

function CheckCircle2Icon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function AlertCircleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export interface AccountBodyProps {
  theme: ThemeConfig;
}

export function AccountBody({ theme }: AccountBodyProps) {
  const router = useRouter();
  const {
    customer,
    addresses,
    defaultAddress,
    isAuthenticated,
    isLoading,
    editInfo,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    logout,
    refreshProfile,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'support'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Address Modal States
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<{
    label: 'HOME' | 'OFFICE' | 'OTHER';
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    isDefault: boolean;
  }>({
    label: 'HOME',
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
    isDefault: false,
  });

  // Edit profile form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [acceptsMarketing, setAcceptsMarketing] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Synchronize store identification into localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && theme) {
      if (theme.id) {
        localStorage.setItem('activeStoreId', theme.id);
        localStorage.setItem('storeId', theme.id);
      }
      if (theme.slug) {
        localStorage.setItem('storeSlug', theme.slug);
      }
    }
  }, [theme]);

  // Currency helper
  const currencySymbol = useMemo(() => {
    const c = (theme.currency || 'USD').toUpperCase();
    if (c === 'INR') return '₹';
    if (c === 'EUR') return '€';
    if (c === 'GBP') return '£';
    if (c === 'JPY') return '¥';
    if (c === 'CAD') return 'CA$';
    if (c === 'AUD') return 'A$';
    if (c === 'SGD') return 'S$';
    if (c === 'AED') return 'AED ';
    return '$';
  }, [theme.currency]);

  const formatPrice = (amount: number, orderCurrency?: string) => {
    const curr = (orderCurrency || theme.currency || 'USD').toUpperCase();
    let sym = currencySymbol;
    if (orderCurrency) {
      if (curr === 'INR') sym = '₹';
      else if (curr === 'EUR') sym = '€';
      else if (curr === 'GBP') sym = '£';
      else if (curr === 'JPY') sym = '¥';
      else if (curr === 'CAD') sym = 'CA$';
      else if (curr === 'AUD') sym = 'A$';
      else if (curr === 'SGD') sym = 'S$';
      else if (curr === 'AED') sym = 'AED ';
      else sym = '$';
    }
    return `${sym}${Number(amount || 0).toFixed(2)}`;
  };

  // Populate form with customer info (getInfo)
  useEffect(() => {
    if (customer) {
      setName(customer.name || '');
      setPhone(customer.phone || '');
      setAcceptsMarketing(customer.acceptsMarketing ?? true);
    }
  }, [customer]);

  // Fetch orders when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setLoadingOrders(true);
      getCustomerOrders()
        .then((data) => setOrders(data))
        .catch(() => {})
        .finally(() => setLoadingOrders(false));
    }
  }, [isAuthenticated]);

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(null);
    setSaveError(null);

    try {
      await editInfo({
        name,
        phone,
        acceptsMarketing,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });

      setSaveSuccess('Profile info updated successfully! Changes are synchronized with your store account.');
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err: any) {
      setSaveError(err?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenAddAddressModal = () => {
    setEditingAddressId(null);
    setAddressForm({
      label: 'HOME',
      name: customer?.name || '',
      phone: customer?.phone || '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'India',
      isDefault: addresses.length === 0,
    });
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddressModal = (addr: CustomerAddress) => {
    setEditingAddressId(addr.id || null);
    setAddressForm({
      label: (addr.label as any) || 'HOME',
      name: addr.name || customer?.name || '',
      phone: addr.phone || customer?.phone || '',
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      zip: addr.zip || '',
      country: addr.country || 'India',
      isDefault: Boolean(addr.isDefault),
    });
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingAddressId) {
        await updateAddress(editingAddressId, addressForm);
        setSaveSuccess(`Address (${addressForm.label}) updated successfully!`);
      } else {
        await addAddress(addressForm);
        setSaveSuccess(`New ${addressForm.label} address added successfully!`);
      }
      setIsAddressModalOpen(false);
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err: any) {
      setSaveError(err?.message || 'Failed to save address.');
      setTimeout(() => setSaveError(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAddress = async (id: string, label?: string) => {
    if (!window.confirm(`Are you sure you want to delete this ${label || 'saved'} address?`)) return;
    try {
      await deleteAddress(id);
      setSaveSuccess('Address deleted.');
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (err: any) {
      setSaveError(err?.message || 'Failed to delete address.');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);
      setSaveSuccess('Default primary shipping address updated!');
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (err: any) {
      setSaveError(err?.message || 'Failed to set default address.');
    }
  };

  // Helper to parse order items safely
  const parseOrderItems = (order: Order): OrderItem[] => {
    if (order.items && order.items.length > 0) return order.items;
    if (order.itemsJson) {
      try {
        const parsed = JSON.parse(order.itemsJson);
        if (Array.isArray(parsed)) {
          return parsed.map((it: any) => ({
            id: it.id || it.productId,
            productId: it.productId || it.id || 'prod-1',
            productName: it.productName || it.name || 'Ordered Item',
            name: it.name || it.productName || 'Ordered Item',
            quantity: Number(it.quantity || 1),
            price: Number(it.price ?? it.unitPrice ?? 0),
            unitPrice: Number(it.unitPrice ?? it.price ?? 0),
            subtotal: Number(it.subtotal ?? (Number(it.price ?? it.unitPrice ?? 0) * Number(it.quantity || 1))),
            sku: it.sku || undefined,
            image: it.image || it.imageUrl || undefined,
          }));
        }
      } catch {}
    }
    return [{
      id: 'item-1',
      productId: 'prod-1',
      productName: 'Ordered Item',
      quantity: 1,
      price: Number(order.totalAmount || order.total || 0),
    }];
  };

  // Helper to parse shipping address safely
  const parseShippingAddress = (order: Order): any => {
    if (order.shippingAddressJson) {
      try {
        return JSON.parse(order.shippingAddressJson);
      } catch {}
    }
    return null;
  };

  // Calculate customer tier badge
  const customerTier = useMemo(() => {
    const totalSpent = Number(customer?.totalSpent || 0);
    const totalOrders = Number(customer?.totalOrders || orders.length);

    if (totalSpent > 1000 || totalOrders >= 10) return { name: 'Platinum VIP', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.12)' };
    if (totalSpent > 500 || totalOrders >= 5) return { name: 'Gold Member', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' };
    if (totalSpent > 150 || totalOrders >= 2) return { name: 'Silver Member', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' };
    return { name: 'Member', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' };
  }, [customer, orders]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-28">
        <div
          className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent"
          style={{ borderColor: 'var(--sf-primary, #6366f1)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="max-w-md mx-auto px-4 py-20 text-center flex-1">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner"
          style={{ backgroundColor: 'color-mix(in srgb, var(--sf-text) 8%, var(--sf-bg))' }}
        >
          🔒
        </div>
        <h1 className="text-2xl font-black mb-2" style={{ color: 'var(--sf-text)' }}>
          Sign in to your account
        </h1>
        <p className="text-sm mb-8" style={{ color: 'color-mix(in srgb, var(--sf-text) 60%, transparent)' }}>
          Log in to track your {theme.storeName || 'Store'} orders, manage multiple saved addresses (Home, Office, Other), and view member savings.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/login"
            className="px-6 py-3 rounded-2xl font-extrabold text-sm text-white shadow-md hover:opacity-90 transition"
            style={{ backgroundColor: 'var(--sf-primary, #6366f1)' }}
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="px-6 py-3 rounded-2xl font-extrabold text-sm border transition hover:bg-slate-50 dark:hover:bg-slate-900"
            style={{
              borderColor: 'color-mix(in srgb, var(--sf-text) 20%, transparent)',
              color: 'var(--sf-text)',
            }}
          >
            Create Account
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow">
      {/* HEADER / WELCOME BANNER */}
      <div
        className="p-6 sm:p-8 rounded-3xl border shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden"
        style={{
          backgroundColor: 'var(--sf-bg)',
          borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)',
        }}
      >
        <div className="flex items-center gap-4 sm:gap-5">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-md shrink-0"
            style={{ backgroundColor: 'var(--sf-primary, #6366f1)' }}
          >
            {(customer?.name || customer?.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: 'var(--sf-text)' }}>
                {customer?.name || 'Valued Customer'}
              </h1>
              <span
                className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1"
                style={{ backgroundColor: customerTier.bg, color: customerTier.color }}
              >
                <ShieldCheckIcon className="w-3.5 h-3.5" />
                <span>{customerTier.name}</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm mt-1" style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}>
              {customer?.email} {customer?.phone ? `• ${customer.phone}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => refreshProfile()}
            className="p-2.5 rounded-xl border text-xs font-bold transition hover:opacity-80"
            style={{
              borderColor: 'color-mix(in srgb, var(--sf-text) 15%, transparent)',
              color: 'var(--sf-text)',
            }}
            title="Refresh Account Data"
          >
            <RefreshCwIcon className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="px-4 py-2.5 text-xs font-extrabold text-rose-600 rounded-xl transition hover:opacity-80 flex items-center gap-1.5"
            style={{ backgroundColor: 'color-mix(in srgb, #e11d48 10%, var(--sf-bg))' }}
          >
            <LogOutIcon className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* GLOBAL TOAST BANNER */}
      {saveSuccess && (
        <div className="mb-6 p-4 text-emerald-700 text-xs font-bold rounded-2xl border border-emerald-200 bg-emerald-50 flex items-center gap-2">
          <CheckCircle2Icon className="w-4 h-4 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}
      {saveError && (
        <div className="mb-6 p-4 text-rose-700 text-xs font-bold rounded-2xl border border-rose-200 bg-rose-50 flex items-center gap-2">
          <AlertCircleIcon className="w-4 h-4 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* QUICK METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div
          className="p-6 rounded-3xl border shadow-sm"
          style={{
            backgroundColor: 'var(--sf-bg)',
            borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)',
          }}
        >
          <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>
            <ShoppingBagIcon className="w-4 h-4 text-indigo-500" />
            <span>Total Orders</span>
          </span>
          <p className="text-3xl font-black mt-2" style={{ color: 'var(--sf-primary, #6366f1)' }}>
            {customer?.totalOrders ?? orders.length}
          </p>
        </div>

        <div
          className="p-6 rounded-3xl border shadow-sm"
          style={{
            backgroundColor: 'var(--sf-bg)',
            borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)',
          }}
        >
          <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>
            <CreditCardIcon className="w-4 h-4 text-emerald-500" />
            <span>Total Lifetime Spent</span>
          </span>
          <p className="text-3xl font-black mt-2 text-emerald-600 font-mono">
            {formatPrice(customer?.totalSpent || orders.reduce((acc, o) => acc + (Number(o.totalAmount || o.total || 0)), 0))}
          </p>
        </div>

        <div
          className="p-6 rounded-3xl border shadow-sm"
          style={{
            backgroundColor: 'var(--sf-bg)',
            borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)',
          }}
        >
          <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>
            <MapPinIcon className="w-4 h-4 text-amber-500" />
            <span>Saved Addresses</span>
          </span>
          <p className="text-3xl font-black mt-2 text-amber-600">
            {addresses.length}
          </p>
          <span className="text-[11px] block mt-0.5" style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}>
            {defaultAddress ? `Default: ${defaultAddress.label || 'HOME'} (${defaultAddress.city || 'Saved'})` : 'No default set'}
          </span>
        </div>
      </div>

      {/* DASHBOARD TABS */}
      <div
        className="flex gap-2 sm:gap-4 border-b mb-8 overflow-x-auto pb-1 scrollbar-none"
        style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className="pb-3 px-2 text-xs sm:text-sm font-extrabold tracking-wide transition border-b-2 flex items-center gap-2 shrink-0"
          style={{
            borderColor: activeTab === 'orders' ? 'var(--sf-primary, #6366f1)' : 'transparent',
            color: activeTab === 'orders' ? 'var(--sf-primary, #6366f1)' : 'color-mix(in srgb, var(--sf-text) 50%, transparent)',
          }}
        >
          <ShoppingBagIcon className="w-4 h-4" />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('addresses')}
          className="pb-3 px-2 text-xs sm:text-sm font-extrabold tracking-wide transition border-b-2 flex items-center gap-2 shrink-0"
          style={{
            borderColor: activeTab === 'addresses' ? 'var(--sf-primary, #6366f1)' : 'transparent',
            color: activeTab === 'addresses' ? 'var(--sf-primary, #6366f1)' : 'color-mix(in srgb, var(--sf-text) 50%, transparent)',
          }}
        >
          <MapPinIcon className="w-4 h-4" />
          <span>Addresses ({addresses.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className="pb-3 px-2 text-xs sm:text-sm font-extrabold tracking-wide transition border-b-2 flex items-center gap-2 shrink-0"
          style={{
            borderColor: activeTab === 'profile' ? 'var(--sf-primary, #6366f1)' : 'transparent',
            color: activeTab === 'profile' ? 'var(--sf-primary, #6366f1)' : 'color-mix(in srgb, var(--sf-text) 50%, transparent)',
          }}
        >
          <UserIcon className="w-4 h-4" />
          <span>Profile Settings</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('support')}
          className="pb-3 px-2 text-xs sm:text-sm font-extrabold tracking-wide transition border-b-2 flex items-center gap-2 shrink-0"
          style={{
            borderColor: activeTab === 'support' ? 'var(--sf-primary, #6366f1)' : 'transparent',
            color: activeTab === 'support' ? 'var(--sf-primary, #6366f1)' : 'color-mix(in srgb, var(--sf-text) 50%, transparent)',
          }}
        >
          <HelpCircleIcon className="w-4 h-4" />
          <span>Store Help & Policies</span>
        </button>
      </div>

      {/* TAB 1: ORDERS LIST */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {loadingOrders ? (
            <div className="py-16 text-center text-sm" style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}>
              Loading order history...
            </div>
          ) : orders.length === 0 ? (
            <div
              className="text-center py-20 rounded-3xl border p-8"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--sf-text) 3%, var(--sf-bg))',
                borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)',
              }}
            >
              <ShoppingBagIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <h3 className="text-base font-black mb-1" style={{ color: 'var(--sf-text)' }}>No orders yet</h3>
              <p className="text-xs mb-6 max-w-sm mx-auto" style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}>
                You haven't placed any orders yet. Discover our catalog and place your first order with fast checkout.
              </p>
              <Link
                href="/products"
                className="px-6 py-3 rounded-2xl font-extrabold text-xs text-white shadow-md transition inline-block hover:opacity-90"
                style={{ backgroundColor: 'var(--sf-primary, #6366f1)' }}
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            orders.map((order) => {
              const items = parseOrderItems(order);
              const statusUpper = (order.fulfillmentStatus || order.status || 'CONFIRMED').toUpperCase();
              const paymentUpper = (order.paymentStatus || 'PAID').toUpperCase();

              return (
                <div
                  key={order.id}
                  className="p-6 rounded-3xl border shadow-sm transition hover:shadow-md"
                  style={{
                    backgroundColor: 'var(--sf-bg)',
                    borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)',
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b gap-4" style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 8%, transparent)' }}>
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-mono font-black text-sm" style={{ color: 'var(--sf-text)' }}>
                          #{order.orderNumber || order.id.slice(0, 8)}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            statusUpper === 'DELIVERED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : statusUpper === 'SHIPPED'
                              ? 'bg-purple-100 text-purple-800'
                              : statusUpper === 'PROCESSING'
                              ? 'bg-indigo-100 text-indigo-800'
                              : statusUpper === 'CANCELLED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {statusUpper}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            paymentUpper === 'PAID'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {paymentUpper}
                        </span>
                      </div>
                      <p className="text-xs mt-1" style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>
                        Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'Recent'}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 self-start sm:self-auto">
                      <div className="text-left sm:text-right">
                        <span className="text-base font-black font-mono block" style={{ color: 'var(--sf-text)' }}>
                          {formatPrice(order.totalAmount || order.total || 0, order.currency)}
                        </span>
                        <span className="text-[10px]" style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>
                          {items.length} {items.length === 1 ? 'Item' : 'Items'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="px-4 py-2 rounded-xl text-xs font-extrabold transition border flex items-center gap-1.5 hover:opacity-90"
                        style={{
                          backgroundColor: 'color-mix(in srgb, var(--sf-primary, #6366f1) 8%, var(--sf-bg))',
                          borderColor: 'color-mix(in srgb, var(--sf-primary, #6366f1) 30%, transparent)',
                          color: 'var(--sf-primary, #6366f1)',
                        }}
                      >
                        <span>View Details</span>
                        <ChevronRightIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Quick Item Thumbnails preview */}
                  <div className="pt-4 flex items-center gap-3 overflow-x-auto">
                    {items.slice(0, 4).map((it, idx) => (
                      <div key={idx} className="flex items-center gap-2 shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border overflow-hidden shrink-0 flex items-center justify-center text-xs font-bold text-slate-400">
                          {it.image ? (
                            <img src={it.image} alt={it.productName || it.name} className="w-full h-full object-cover" />
                          ) : (
                            <PackageIcon className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div className="text-xs max-w-[140px] truncate">
                          <span className="font-bold block truncate" style={{ color: 'var(--sf-text)' }}>
                            {it.productName || it.name}
                          </span>
                          <span className="text-[10px]" style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>
                            Qty: {it.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                    {items.length > 4 && (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500">
                        +{items.length - 4} more
                      </span>
                    )}

                    {order.trackingNumber && (
                      <div className="ml-auto text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold border border-purple-200">
                        <TruckIcon className="w-3.5 h-3.5 shrink-0" />
                        <span>Tracking: {order.trackingNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: MULTIPLE SAVED ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black" style={{ color: 'var(--sf-text)' }}>
                Saved Delivery Addresses
              </h2>
              <p className="text-xs mt-1" style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}>
                Add and manage multiple delivery locations (Home, Office, Others) for seamless 1-click checkout.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddAddressModal}
              className="px-5 py-2.5 rounded-2xl font-extrabold text-xs text-white shadow-md transition flex items-center gap-2 self-start sm:self-auto hover:opacity-90"
              style={{ backgroundColor: 'var(--sf-primary, #6366f1)' }}
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.length === 0 ? (
              <div
                className="col-span-full text-center py-16 rounded-3xl border border-dashed p-8"
                style={{
                  borderColor: 'color-mix(in srgb, var(--sf-text) 20%, transparent)',
                  backgroundColor: 'color-mix(in srgb, var(--sf-text) 2%, var(--sf-bg))',
                }}
              >
                <MapPinIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--sf-text)' }}>
                  No saved addresses found
                </h3>
                <p className="text-xs mb-4" style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}>
                  Save your home, office, or secondary delivery addresses for faster order checkout.
                </p>
                <button
                  type="button"
                  onClick={handleOpenAddAddressModal}
                  className="px-5 py-2.5 rounded-xl font-extrabold text-xs text-white shadow-sm"
                  style={{ backgroundColor: 'var(--sf-primary, #6366f1)' }}
                >
                  Add Your First Address
                </button>
              </div>
            ) : (
              addresses.map((addr, idx) => {
                const label = (addr.label || 'HOME').toUpperCase();
                const isHome = label === 'HOME';
                const isOffice = label === 'OFFICE';

                return (
                  <div
                    key={addr.id || idx}
                    className="p-6 rounded-3xl border shadow-sm relative flex flex-col justify-between gap-4 transition hover:shadow-md"
                    style={{
                      backgroundColor: 'var(--sf-bg)',
                      borderColor: addr.isDefault
                        ? 'var(--sf-primary, #6366f1)'
                        : 'color-mix(in srgb, var(--sf-text) 12%, transparent)',
                    }}
                  >
                    <div className="space-y-3">
                      {/* Badge bar */}
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                            isHome
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                              : isOffice
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300'
                              : 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300'
                          }`}
                        >
                          {isHome ? <HomeIcon className="w-3 h-3" /> : isOffice ? <BuildingIcon className="w-3 h-3" /> : <MapPinIcon className="w-3 h-3" />}
                          <span>{label}</span>
                        </span>

                        {addr.isDefault && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200">
                            Default Address
                          </span>
                        )}
                      </div>

                      {/* Recipient & Full Address */}
                      <div>
                        <h4 className="font-extrabold text-sm" style={{ color: 'var(--sf-text)' }}>
                          {addr.name || customer?.name || 'Recipient'}
                        </h4>
                        <p className="text-xs leading-relaxed mt-1" style={{ color: 'color-mix(in srgb, var(--sf-text) 70%, transparent)' }}>
                          {addr.street}<br />
                          {addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.zip}<br />
                          {addr.country}
                        </p>
                        {addr.phone && (
                          <p className="text-xs font-mono mt-2" style={{ color: 'color-mix(in srgb, var(--sf-text) 60%, transparent)' }}>
                            Phone: {addr.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions footer */}
                    <div className="pt-3 border-t flex items-center justify-between gap-2" style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 8%, transparent)' }}>
                      <div>
                        {!addr.isDefault && addr.id && (
                          <button
                            type="button"
                            onClick={() => handleSetDefault(addr.id!)}
                            className="text-[11px] font-bold text-indigo-600 hover:underline"
                          >
                            Set as Default
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditAddressModal(addr)}
                          className="p-2 rounded-xl border text-xs font-bold transition hover:bg-slate-50 dark:hover:bg-slate-800"
                          style={{
                            borderColor: 'color-mix(in srgb, var(--sf-text) 15%, transparent)',
                            color: 'var(--sf-text)',
                          }}
                          title="Edit Address"
                        >
                          <Edit2Icon className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => addr.id && handleDeleteAddress(addr.id, addr.label)}
                          className="p-2 rounded-xl border border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Address"
                        >
                          <Trash2Icon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: PROFILE SETTINGS */}
      {activeTab === 'profile' && (
        <div
          className="max-w-2xl p-6 sm:p-8 rounded-3xl border shadow-sm"
          style={{
            backgroundColor: 'var(--sf-bg)',
            borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)',
          }}
        >
          <div className="mb-6">
            <h2 className="text-xl font-black" style={{ color: 'var(--sf-text)' }}>
              Edit Account Information
            </h2>
            <p className="text-xs mt-1" style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}>
              Keep your contact and communication preferences up to date.
            </p>
          </div>

          <form onSubmit={handleEditProfile} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider mb-2" style={{ color: 'var(--sf-text)' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="sf-input w-full p-3 text-sm rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider mb-2" style={{ color: 'var(--sf-text)' }}>
                  Email Address (Read-only)
                </label>
                <input
                  type="email"
                  value={customer?.email || ''}
                  disabled
                  className="sf-input w-full p-3 text-sm rounded-xl opacity-60 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider mb-2" style={{ color: 'var(--sf-text)' }}>
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="sf-input w-full p-3 text-sm rounded-xl"
              />
            </div>

            {/* Newsletter Preferences */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="marketing"
                checked={acceptsMarketing}
                onChange={(e) => setAcceptsMarketing(e.target.checked)}
                className="w-4 h-4 rounded"
                style={{ accentColor: 'var(--sf-primary, #6366f1)' }}
              />
              <label htmlFor="marketing" className="text-xs cursor-pointer font-medium" style={{ color: 'color-mix(in srgb, var(--sf-text) 70%, transparent)' }}>
                Receive order updates, VIP sales promotions, and new product announcements.
              </label>
            </div>

            {/* Password Change */}
            <div className="pt-4 border-t" style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}>
              <h3 className="text-sm font-black mb-3" style={{ color: 'var(--sf-text)' }}>
                Security & Password Update (Optional)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-1" style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="sf-input w-full p-3 text-sm rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1" style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}>
                    New Password (min 6 chars)
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="sf-input w-full p-3 text-sm rounded-xl"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3.5 px-6 rounded-2xl font-extrabold text-sm text-white shadow-lg transition flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: 'var(--sf-primary, #6366f1)' }}
            >
              {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: STORE HELP & POLICIES */}
      {activeTab === 'support' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="p-6 rounded-3xl border shadow-sm space-y-4"
            style={{
              backgroundColor: 'var(--sf-bg)',
              borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)',
            }}
          >
            <h3 className="text-base font-black flex items-center gap-2" style={{ color: 'var(--sf-text)' }}>
              <MailIcon className="w-4 h-4 text-indigo-500" />
              <span>Contact Store Support</span>
            </h3>
            <p className="text-xs" style={{ color: 'color-mix(in srgb, var(--sf-text) 60%, transparent)' }}>
              Need assistance with an order, return request, or delivery address inquiry? Reach out directly to our merchant team:
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border flex items-center gap-3">
                <MailIcon className="w-4 h-4 text-slate-400" />
                <span className="font-bold">{theme.contactEmail || 'support@omnistore.com'}</span>
              </div>
              {theme.contactPhone && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border flex items-center gap-3">
                  <PhoneIcon className="w-4 h-4 text-slate-400" />
                  <span className="font-bold">{theme.contactPhone}</span>
                </div>
              )}
            </div>
          </div>

          <div
            className="p-6 rounded-3xl border shadow-sm space-y-4"
            style={{
              backgroundColor: 'var(--sf-bg)',
              borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)',
            }}
          >
            <h3 className="text-base font-black flex items-center gap-2" style={{ color: 'var(--sf-text)' }}>
              <ShieldCheckIcon className="w-4 h-4 text-emerald-500" />
              <span>Shipping & Delivery Guarantees</span>
            </h3>
            <ul className="text-xs space-y-2 list-disc pl-4" style={{ color: 'color-mix(in srgb, var(--sf-text) 70%, transparent)' }}>
              <li>Multiple address saving with quick 1-click checkout destination selection.</li>
              <li>Real-time tracking updates via SMS and email.</li>
              <li>Free standard delivery on orders meeting the qualifying threshold.</li>
              <li>Hassle-free 30-day merchant returns on eligible unopened merchandise.</li>
            </ul>
          </div>
        </div>
      )}

      {/* ADD / EDIT ADDRESS MODAL */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div
            className="rounded-3xl border w-full max-w-lg shadow-2xl overflow-hidden my-8"
            style={{
              backgroundColor: 'var(--sf-bg)',
              borderColor: 'color-mix(in srgb, var(--sf-text) 15%, transparent)',
            }}
          >
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-black text-lg">
                {editingAddressId ? 'Edit Delivery Address' : 'Add New Address'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="p-6 space-y-4">
              {/* Address Label Selector: HOME | OFFICE | OTHER */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider mb-2" style={{ color: 'var(--sf-text)' }}>
                  Address Type / Label
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'HOME', label: 'Home', icon: HomeIcon },
                    { id: 'OFFICE', label: 'Office', icon: BuildingIcon },
                    { id: 'OTHER', label: 'Other', icon: MapPinIcon },
                  ].map((tab) => {
                    const isSelected = addressForm.label === tab.id;
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setAddressForm({ ...addressForm, label: tab.id as any })}
                        className={`py-2.5 px-3 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition border ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recipient details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs mb-1 font-semibold" style={{ color: 'var(--sf-text)' }}>
                    Contact Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Recipient name"
                    value={addressForm.name}
                    onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                    className="sf-input w-full p-2.5 text-xs rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1 font-semibold" style={{ color: 'var(--sf-text)' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    className="sf-input w-full p-2.5 text-xs rounded-xl"
                  />
                </div>
              </div>

              {/* Street */}
              <div>
                <label className="block text-xs mb-1 font-semibold" style={{ color: 'var(--sf-text)' }}>
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  placeholder="Flat / Building / Street address"
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  className="sf-input w-full p-2.5 text-xs rounded-xl"
                />
              </div>

              {/* City, State, PIN */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs mb-1 font-semibold" style={{ color: 'var(--sf-text)' }}>
                    City
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Bengaluru"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="sf-input w-full p-2.5 text-xs rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1 font-semibold" style={{ color: 'var(--sf-text)' }}>
                    State
                  </label>
                  <input
                    type="text"
                    placeholder="Karnataka"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="sf-input w-full p-2.5 text-xs rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1 font-semibold" style={{ color: 'var(--sf-text)' }}>
                    PIN / ZIP
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="560038"
                    value={addressForm.zip}
                    onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
                    className="sf-input w-full p-2.5 text-xs rounded-xl"
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs mb-1 font-semibold" style={{ color: 'var(--sf-text)' }}>
                  Country
                </label>
                <input
                  type="text"
                  required
                  placeholder="India"
                  value={addressForm.country}
                  onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                  className="sf-input w-full p-2.5 text-xs rounded-xl"
                />
              </div>

              {/* Make Default Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="makeDefault"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: 'var(--sf-primary, #6366f1)' }}
                />
                <label htmlFor="makeDefault" className="text-xs font-semibold cursor-pointer" style={{ color: 'var(--sf-text)' }}>
                  Set as default primary delivery address
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl font-extrabold text-xs text-white shadow-md"
                  style={{ backgroundColor: 'var(--sf-primary, #6366f1)' }}
                >
                  {isSaving ? 'Saving...' : editingAddressId ? 'Save Changes' : 'Add Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ORDER DETAILS MODAL / DRAWER */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div
            className="rounded-3xl border w-full max-w-3xl shadow-2xl overflow-hidden my-8"
            style={{
              backgroundColor: 'var(--sf-bg)',
              borderColor: 'color-mix(in srgb, var(--sf-text) 15%, transparent)',
            }}
          >
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-lg">Order #{selectedOrder.orderNumber || selectedOrder.id.slice(0, 8)}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300">
                    {selectedOrder.fulfillmentStatus || selectedOrder.status || 'CONFIRMED'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Placed on {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString(undefined, { dateStyle: 'full' }) : 'Recent'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsInvoiceOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold flex items-center gap-1.5 transition"
                >
                  <PrinterIcon className="w-3.5 h-3.5" />
                  <span>Invoice</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Carrier tracking box */}
              {selectedOrder.trackingNumber && (
                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <TruckIcon className="w-5 h-5 text-purple-600 shrink-0" />
                    <div>
                      <span className="text-xs font-black text-purple-900 dark:text-purple-200 block">
                        Shipped via {selectedOrder.carrier || 'Express Courier'}
                      </span>
                      <span className="text-[11px] font-mono text-purple-700 dark:text-purple-300">
                        Tracking #: {selectedOrder.trackingNumber}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Items Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}>
                  Ordered Items ({parseOrderItems(selectedOrder).length})
                </h4>
                <div className="divide-y border rounded-2xl overflow-hidden" style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}>
                  {parseOrderItems(selectedOrder).map((item, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border overflow-hidden shrink-0 flex items-center justify-center">
                          {item.image ? (
                            <img src={item.image} alt={item.productName || item.name} className="w-full h-full object-cover" />
                          ) : (
                            <PackageIcon className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <span className="font-extrabold text-xs block" style={{ color: 'var(--sf-text)' }}>
                            {item.productName || item.name}
                          </span>
                          {item.sku && (
                            <span className="text-[10px] font-mono block opacity-50">
                              SKU: {item.sku}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-extrabold block" style={{ color: 'var(--sf-text)' }}>
                          {formatPrice(item.price || item.unitPrice || 0, selectedOrder.currency)} x {item.quantity}
                        </span>
                        <span className="text-xs font-black font-mono text-indigo-600 block">
                          {formatPrice(item.subtotal || (Number(item.price || item.unitPrice || 0) * item.quantity), selectedOrder.currency)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address & Pricing Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border text-xs space-y-1" style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}>
                  <span className="font-black uppercase tracking-wider block mb-1" style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}>
                    Shipping Address
                  </span>
                  {(() => {
                    const addr = parseShippingAddress(selectedOrder);
                    if (addr) {
                      return (
                        <>
                          <p className="font-bold" style={{ color: 'var(--sf-text)' }}>{addr.street}</p>
                          <p style={{ color: 'color-mix(in srgb, var(--sf-text) 70%, transparent)' }}>{addr.city}, {addr.state} {addr.zip}</p>
                          <p style={{ color: 'color-mix(in srgb, var(--sf-text) 70%, transparent)' }}>{addr.country}</p>
                        </>
                      );
                    }
                    return <p className="text-slate-400">Standard Delivery Address</p>;
                  })()}
                </div>

                <div className="p-4 rounded-2xl border text-xs space-y-2" style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}>
                  <span className="font-black uppercase tracking-wider block mb-1" style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}>
                    Payment Summary
                  </span>
                  <div className="flex justify-between">
                    <span style={{ color: 'color-mix(in srgb, var(--sf-text) 60%, transparent)' }}>Subtotal:</span>
                    <span className="font-bold font-mono" style={{ color: 'var(--sf-text)' }}>
                      {formatPrice(selectedOrder.subtotalAmount || (Number(selectedOrder.totalAmount || selectedOrder.total || 0) * 0.9), selectedOrder.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'color-mix(in srgb, var(--sf-text) 60%, transparent)' }}>Tax:</span>
                    <span className="font-bold font-mono" style={{ color: 'var(--sf-text)' }}>
                      {formatPrice(selectedOrder.taxAmount || 0, selectedOrder.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'color-mix(in srgb, var(--sf-text) 60%, transparent)' }}>Shipping:</span>
                    <span className="font-bold font-mono" style={{ color: 'var(--sf-text)' }}>
                      {formatPrice(selectedOrder.shippingAmount || 0, selectedOrder.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between font-black text-sm pt-2 border-t" style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}>
                    <span>Grand Total:</span>
                    <span className="text-indigo-600 font-mono">
                      {formatPrice(selectedOrder.totalAmount || selectedOrder.total || 0, selectedOrder.currency)} {selectedOrder.currency || theme.currency}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE RECEIPT MODAL */}
      {isInvoiceOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-8 p-8 space-y-6 text-slate-900">
            <div className="flex items-center justify-between border-b pb-4">
              <span className="text-xs font-black uppercase text-indigo-600 tracking-wider">
                Official Order Receipt — {theme.storeName}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <PrinterIcon className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsInvoiceOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">RECEIPT</h1>
                  <span className="text-xs font-mono font-bold text-indigo-600">
                    Order #{selectedOrder.orderNumber || selectedOrder.id.slice(0, 8)}
                  </span>
                </div>
                <div className="text-right text-xs">
                  <span className="font-extrabold text-slate-900 block">{theme.storeName}</span>
                  <span className="text-slate-500 block">Date: {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString() : 'Recent'}</span>
                </div>
              </div>

              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b font-extrabold uppercase text-[10px] text-slate-500">
                    <th className="py-2">Item Description</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Price</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-800">
                  {parseOrderItems(selectedOrder).map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-3 font-bold">{it.productName || it.name}</td>
                      <td className="py-3 text-center">{it.quantity}</td>
                      <td className="py-3 text-right">{formatPrice(it.price || it.unitPrice || 0, selectedOrder.currency)}</td>
                      <td className="py-3 text-right font-bold">{formatPrice(it.subtotal || (Number(it.price || it.unitPrice || 0) * it.quantity), selectedOrder.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end pt-4 border-t">
                <div className="w-60 space-y-1.5 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-bold">{formatPrice(selectedOrder.subtotalAmount || (Number(selectedOrder.totalAmount || selectedOrder.total || 0) * 0.9), selectedOrder.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span className="font-bold">{formatPrice(selectedOrder.taxAmount || 0, selectedOrder.currency)}</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-slate-900 pt-2 border-t">
                    <span>Grand Total:</span>
                    <span className="text-indigo-600 font-mono">
                      {formatPrice(selectedOrder.totalAmount || selectedOrder.total || 0, selectedOrder.currency)} {selectedOrder.currency || theme.currency}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
