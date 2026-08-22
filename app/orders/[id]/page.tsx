'use client';

// ─── Order Detail — /orders/[id] ──────────────────────────────────────────────
// CSR client page. Fetches a single order for the authenticated customer.
// Redirects to /auth/login if not authenticated.

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getCustomerOrder } from '@/lib/api/customer';
import { useAuth } from '@/hooks/useAuth';
import type { Order } from '@/lib/api/types';

function OrderStatusBadge({ status }: { status?: string }) {
  const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    PENDING:     { label: 'Pending',     color: '#92400e', bg: '#fef3c7' },
    PROCESSING:  { label: 'Processing',  color: '#1e40af', bg: '#dbeafe' },
    SHIPPED:     { label: 'Shipped',     color: '#065f46', bg: '#d1fae5' },
    DELIVERED:   { label: 'Delivered',   color: '#14532d', bg: '#bbf7d0' },
    CANCELLED:   { label: 'Cancelled',   color: '#991b1b', bg: '#fee2e2' },
    REFUNDED:    { label: 'Refunded',    color: '#6b21a8', bg: '#f3e8ff' },
  };
  const key = (status || '').toUpperCase();
  const s = statusMap[key] || { label: status || 'Unknown', color: '#374151', bg: '#f3f4f6' };

  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}

function formatCurrency(amount?: number, currency?: string) {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency || 'INR',
  }).format(amount);
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function OrderDetailPage() {
  const router    = useRouter();
  const params    = useParams<{ id: string }>();
  const orderId   = params.id;

  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [order,     setOrder]     = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace(`/auth/login?redirect=/orders/${orderId}`);
      return;
    }
    if (!orderId) return;

    setIsLoading(true);
    getCustomerOrder(orderId)
      .then((data) => {
        if (!data) setError('Order not found.');
        else setOrder(data);
      })
      .catch(() => setError('Failed to load order. Please try again.'))
      .finally(() => setIsLoading(false));
  }, [authLoading, isAuthenticated, orderId, router]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (authLoading || isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--sf-bg)' }}
      >
        <div className="space-y-4 w-full max-w-2xl px-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !order) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6 px-4"
        style={{ backgroundColor: 'var(--sf-bg)' }}
      >
        <div className="text-5xl">📦</div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--sf-text)' }}>
          {error || 'Order not found'}
        </h1>
        <Link
          href="/account"
          className="px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:scale-105"
          style={{ backgroundColor: 'var(--sf-primary)' }}
        >
          Back to Account
        </Link>
      </div>
    );
  }

  const orderItems = (() => {
    if (Array.isArray(order.items) && order.items.length) return order.items;
    try {
      return order.itemsJson ? JSON.parse(order.itemsJson) : [];
    } catch { return []; }
  })();

  const shippingAddress = (() => {
    try {
      return order.shippingAddressJson ? JSON.parse(order.shippingAddressJson) : null;
    } catch { return null; }
  })();

  const grandTotal = order.totalAmount ?? order.total;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--sf-bg)' }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── Back nav ─────────────────────────────────────────────────────── */}
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-colors hover:underline"
          style={{ color: 'var(--sf-primary)' }}
        >
          ← Back to Account
        </Link>

        {/* ── Order header ─────────────────────────────────────────────────── */}
        <div
          className="rounded-2xl p-6 mb-6 border"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--sf-text) 3%, var(--sf-bg))',
            borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)',
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-1"
                style={{ color: 'color-mix(in srgb, var(--sf-text) 45%, transparent)' }}
              >
                Order
              </p>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--sf-text)' }}>
                #{order.orderNumber || order.id}
              </h1>
              <p
                className="text-sm mt-1"
                style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}
              >
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <OrderStatusBadge status={order.status} />
              {order.paymentStatus && (
                <OrderStatusBadge status={order.paymentStatus} />
              )}
              {order.fulfillmentStatus && (
                <OrderStatusBadge status={order.fulfillmentStatus} />
              )}
            </div>
          </div>
        </div>

        {/* ── Order items ──────────────────────────────────────────────────── */}
        {orderItems.length > 0 && (
          <div
            className="rounded-2xl border overflow-hidden mb-6"
            style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}
          >
            <div
              className="px-6 py-4 border-b"
              style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}
            >
              <h2 className="font-semibold" style={{ color: 'var(--sf-text)' }}>
                Items ({orderItems.length})
              </h2>
            </div>
            <div className="divide-y" style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 8%, transparent)' }}>
              {orderItems.map((item: { id: string; productName?: string; name?: string; quantity: number; price: number; image?: string }, idx: number) => (
                <div key={item.id || idx} className="flex items-center gap-4 px-6 py-4">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.productName || item.name || 'Product'}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />
                  ) : (
                    <div
                      className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl"
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--sf-primary) 10%, var(--sf-bg))',
                      }}
                    >
                      📦
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate" style={{ color: 'var(--sf-text)' }}>
                      {item.productName || item.name || 'Product'}
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}
                    >
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold flex-shrink-0" style={{ color: 'var(--sf-text)' }}>
                    {formatCurrency(item.price * item.quantity, order.currency)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Summary + Shipping ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Shipping address */}
          {shippingAddress && (
            <div
              className="rounded-2xl border p-6"
              style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-3"
                style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}>
                Shipping Address
              </h3>
              <address className="not-italic text-sm space-y-0.5" style={{ color: 'var(--sf-text)' }}>
                {shippingAddress.street && <p>{shippingAddress.street}</p>}
                {(shippingAddress.city || shippingAddress.state) && (
                  <p>{[shippingAddress.city, shippingAddress.state].filter(Boolean).join(', ')}</p>
                )}
                {shippingAddress.zip && <p>{shippingAddress.zip}</p>}
                {shippingAddress.country && <p>{shippingAddress.country}</p>}
              </address>
            </div>
          )}

          {/* Order total */}
          <div
            className="rounded-2xl border p-6"
            style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 10%, transparent)' }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3"
              style={{ color: 'color-mix(in srgb, var(--sf-text) 50%, transparent)' }}>
              Order Total
            </h3>
            <p className="text-3xl font-bold" style={{ color: 'var(--sf-text)' }}>
              {formatCurrency(grandTotal, order.currency)}
            </p>
            {order.currency && (
              <p className="text-xs mt-1"
                style={{ color: 'color-mix(in srgb, var(--sf-text) 40%, transparent)' }}>
                {order.currency}
              </p>
            )}
          </div>
        </div>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/products"
            className="px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:scale-105"
            style={{ backgroundColor: 'var(--sf-primary)' }}
          >
            Continue Shopping
          </Link>
          <Link
            href="/account"
            className="px-6 py-3 rounded-xl font-semibold text-sm border transition-all hover:scale-105"
            style={{
              color: 'var(--sf-primary)',
              borderColor: 'var(--sf-primary)',
            }}
          >
            All Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
