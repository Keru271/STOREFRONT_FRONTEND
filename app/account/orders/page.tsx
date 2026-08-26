'use client';

// ─── Customer Orders History — /account/orders ───────────────────────────────
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCustomerOrders } from '@/lib/api/customer';
import { useAuth } from '@/hooks/useAuth';
import type { Order } from '@/lib/api/types';
import {
  ShoppingBag,
  ArrowRight,
  Package,
  Calendar,
  ExternalLink,
  Truck,
  ArrowLeft,
  Search,
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

export default function AccountOrdersPage() {
  const router = useRouter();
  const { customer, isAuthenticated, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace('/auth/login?redirect=/account/orders');
      return;
    }

    setIsLoading(true);
    getCustomerOrders()
      .then((data) => setOrders(data || []))
      .catch(() => setOrders([]))
      .finally(() => setIsLoading(false));
  }, [authLoading, isAuthenticated, router]);

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'ALL') return true;
    return (o.fulfillmentStatus || o.paymentStatus || '').toUpperCase() === filterStatus;
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 max-w-5xl mx-auto space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-28 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <Link
              href="/account"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Account
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Order History
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Track active shipments, view past receipts, and manage order items.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Orders ({orders.length})</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
            <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No orders found</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              You haven&apos;t placed any orders yet. Discover our catalog and place your first order.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl text-xs font-bold shadow-md transition"
            >
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              let itemsCount = 0;
              try {
                const parsed = JSON.parse(order.itemsJson || '[]');
                itemsCount = Array.isArray(parsed) ? parsed.length : 1;
              } catch {
                itemsCount = 1;
              }

              return (
                <div
                  key={order.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                        {order.orderNumber || `#${order.id.slice(0, 8).toUpperCase()}`}
                      </span>
                      <OrderStatusBadge status={order.fulfillmentStatus || order.paymentStatus} />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : '—'}
                      </span>
                      <span>•</span>
                      <span>{itemsCount} {itemsCount === 1 ? 'item' : 'items'}</span>
                      {order.trackingNumber && (
                        <>
                          <span>•</span>
                          <span className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1 font-semibold">
                            <Truck className="w-3.5 h-3.5" /> Tracking: {order.trackingNumber}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
                    <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                      {formatCurrency(order.totalAmount, order.currency)}
                    </span>
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5"
                    >
                      View Order <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
