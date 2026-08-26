'use client';

// ─── Customer Order Detail — /account/orders/[id] ────────────────────────────
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getCustomerOrder } from '@/lib/api/customer';
import { useAuth } from '@/hooks/useAuth';
import type { Order } from '@/lib/api/types';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Package,
  Truck,
  CreditCard,
  Printer,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
} from 'lucide-react';

function OrderStatusBadge({ status }: { status?: string }) {
  const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    CONFIRMED:   { label: 'Confirmed',   color: '#0284c7', bg: '#e0f2fe' },
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

export default function AccountOrderDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const orderId = params.id;
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace(`/auth/login?redirect=/account/orders/${orderId}`);
      return;
    }
    if (!orderId) return;

    setIsLoading(true);
    getCustomerOrder(orderId)
      .then((data) => {
        if (!data) setError('Order not found.');
        else setOrder(data);
      })
      .catch(() => setError('Failed to load order.'))
      .finally(() => setIsLoading(false));
  }, [authLoading, isAuthenticated, orderId, router]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 max-w-4xl mx-auto space-y-6">
        <div className="h-40 bg-white dark:bg-slate-900 rounded-3xl animate-pulse" />
        <div className="h-64 bg-white dark:bg-slate-900 rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20 px-4 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {error || 'Order Not Found'}
        </h2>
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
      </div>
    );
  }

  let items: any[] = [];
  try {
    items = JSON.parse(order.itemsJson || '[]');
  } catch {
    items = [];
  }

  let address: any = null;
  try {
    address = JSON.parse(order.shippingAddressJson || '{}');
  } catch {
    address = null;
  }

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link
              href="/account/orders"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Order History
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {order.orderNumber || `#${order.id.slice(0, 8).toUpperCase()}`}
              </h1>
              <OrderStatusBadge status={order.fulfillmentStatus || order.paymentStatus} />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Placed on{' '}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString(undefined, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '—'}
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 transition shadow-sm"
          >
            <Printer className="w-4 h-4" /> Print Invoice
          </button>
        </div>

        {/* Shipping & Delivery Tracker Banner */}
        {order.trackingNumber && (
          <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 text-white rounded-xl">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-200">
                  Shipment Tracking Information
                </h4>
                <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                  Carrier: {order.carrier || 'Standard Logistics'} • Tracking # {order.trackingNumber}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Order Items Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-indigo-500" />
              Ordered Items ({items.length})
            </h3>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((item: any, idx: number) => (
              <div key={idx} className="p-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {item.image || item.thumbnail ? (
                      <img
                        src={item.image || item.thumbnail}
                        alt={item.name || item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ShoppingBag className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.name || item.title || 'Product Item'}
                    </h4>
                    {item.variantTitle && (
                      <p className="text-xs text-slate-500">Variant: {item.variantTitle}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-1">Quantity: {item.quantity || 1}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {formatCurrency((item.price || 0) * (item.quantity || 1), order.currency)}
                  </span>
                  {item.quantity > 1 && (
                    <p className="text-xs text-slate-400">
                      {formatCurrency(item.price, order.currency)} each
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Calculation Summary */}
          <div className="p-6 bg-slate-50/70 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotalAmount || order.totalAmount, order.currency)}</span>
            </div>
            {order.shippingAmount !== undefined && order.shippingAmount !== null && (
              <div className="flex justify-between text-xs text-slate-500">
                <span>Shipping</span>
                <span>{order.shippingAmount === 0 ? 'Free' : formatCurrency(order.shippingAmount, order.currency)}</span>
              </div>
            )}
            {order.taxAmount !== undefined && order.taxAmount !== null && (
              <div className="flex justify-between text-xs text-slate-500">
                <span>Tax</span>
                <span>{formatCurrency(order.taxAmount, order.currency)}</span>
              </div>
            )}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between text-base font-extrabold text-slate-900 dark:text-white">
              <span>Total Paid</span>
              <span className="text-indigo-600 dark:text-indigo-400">
                {formatCurrency(order.totalAmount, order.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Customer & Delivery Address Card */}
        {address && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                <MapPin className="w-4 h-4 text-indigo-500" />
                Shipping Address
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {address.name || order.customerName}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {address.street || address.address1 || ''}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {[address.city, address.state, address.zip, address.country].filter(Boolean).join(', ')}
              </p>
              {address.phone && (
                <p className="text-xs text-slate-500 mt-2">Phone: {address.phone}</p>
              )}
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                <CreditCard className="w-4 h-4 text-emerald-500" />
                Payment Method
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {order.paymentStatus === 'PAID' ? 'Online Payment Verified' : order.paymentStatus}
              </p>
              <p className="text-xs text-slate-500">
                Customer Email: {order.customerEmail}
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Transaction Processed
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
