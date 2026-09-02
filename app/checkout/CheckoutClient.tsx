'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  createStripePaymentIntent,
  verifyStripePayment,
  processDirectCheckout,
  validateCoupon,
} from '@/lib/api';
import { ThemeConfig } from '@/lib/api/types';
import { useCurrency } from '@/hooks/useCurrency';
import { useToast } from '@/hooks/useToast';
import { useLoader } from '@/hooks/useLoader';
import { useAuth } from '@/hooks/useAuth';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  MapPin,
  Building2,
  Clock,
  Calendar,
  Zap,
  CreditCard,
  Tag,
  Info,
  X,
  Check,
  ShieldCheck,
  AlertCircle,
  Truck,
  DollarSign,
  Package,
  Store,
} from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CheckoutClientProps {
  theme: ThemeConfig;
}

export default function CheckoutClient({ theme }: CheckoutClientProps) {
  const router = useRouter();
  const { items, itemCount, totalAmount, clearCart, cartToken, isLoading: isCartLoading } = useCart();
  const { formatPrice, currency: storeCurrency } = useCurrency();
  const toast = useToast();
  const { startLoading, stopLoading } = useLoader();
  const { customer, addresses, addAddress, isAuthenticated } = useAuth();

  // Store branding & configs
  const storeName = theme.storeName || 'Store';
  const isRazorpayEnabled = theme.paymentRazorpayActive ?? true;
  const isStripeEnabled = theme.paymentStripeActive ?? true;
  const isCodEnabled = theme.paymentCodActive ?? true;

  // Delivery vs Pickup Mode ('DELIVERY' | 'PICKUP')
  const [fulfillmentType, setFulfillmentType] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY');

  // Delivery speed options ('STANDARD' | 'PRIORITY' | 'SCHEDULE')
  const [deliverySpeed, setDeliverySpeed] = useState<'STANDARD' | 'PRIORITY' | 'SCHEDULE'>('STANDARD');
  const [scheduledTime, setScheduledTime] = useState<string>('Wed, Aug 7, 11:30 AM – 12:00 PM');

  // Address details
  const [addressData, setAddressData] = useState({
    street: customer?.address?.street || '456 Elm St',
    aptSuite: '',
    buildingName: '',
    buildingType: 'Apartment' as 'House' | 'Apartment' | 'Office' | 'Hotel' | 'Other',
    city: customer?.address?.city || 'Staten Island',
    state: customer?.address?.state || 'NY',
    zip: customer?.address?.zip || '10310',
    country: customer?.address?.country || 'United States',
    label: 'Home',
    instructions: 'Please leave it at the front door, knock on arrival',
  });

  // Dropoff options
  const [dropoffOption, setDropoffOption] = useState<'MEET_AT_DOOR' | 'MEET_OUTSIDE' | 'MEET_IN_LOBBY' | 'LEAVE_AT_DOOR' | 'LEAVE_AT_RECEPTION'>('MEET_AT_DOOR');

  // Customer contact
  const [contactData, setContactData] = useState({
    name: customer?.name || 'Customer',
    email: customer?.email || 'customer@example.com',
    phone: customer?.phone || '+1 555-0199',
  });

  // Payment details
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'RAZORPAY' | 'STRIPE' | 'COD'>('CARD');
  const [cardData, setCardData] = useState({
    cardNumber: '4003 8301 7187 4018',
    expDate: '01/28',
    cvv: '321',
    country: 'United States',
    zip: '94108',
    nickname: 'Personal Card',
  });

  // Coupon / Promotion state
  const [couponCode, setCouponCode] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    title: string;
    savings: number;
  } | null>(null);
  const [couponError, setCouponError] = useState('');

  // UI Interactive Modals
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showDropoffModal, setShowDropoffModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showPromotionsModal, setShowPromotionsModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCardErrorModal, setShowCardErrorModal] = useState(false);
  const [showTaxesModal, setShowTaxesModal] = useState(false);
  const [showDeliveryFeeTooltip, setShowDeliveryFeeTooltip] = useState(false);

  // Accordion state for cart summary
  const [isCartSummaryOpen, setIsCartSummaryOpen] = useState(true);

  // Base pricing
  const standardShipping = fulfillmentType === 'PICKUP' ? 0 : (theme.shippingFlatRate ?? 0.49);
  const priorityExtraFee = deliverySpeed === 'PRIORITY' && fulfillmentType === 'DELIVERY' ? 1.99 : 0;
  const deliveryFee = standardShipping + priorityExtraFee;

  const discountSavings = appliedDiscount ? appliedDiscount.savings : 0;
  const discountedSubtotal = Math.max(0, totalAmount - discountSavings);

  const taxRate = theme.taxRateStandard ?? 8.875;
  const isTaxInclusive = !!theme.taxInclusive;
  const serviceFee = Number((discountedSubtotal * 0.05).toFixed(2));
  const calculatedTax = isTaxInclusive
    ? 0
    : Number(((discountedSubtotal * taxRate) / 100).toFixed(2));

  const taxesAndOtherFees = Number((serviceFee + calculatedTax).toFixed(2));
  const totalOrderAmount = Number((discountedSubtotal + deliveryFee + taxesAndOtherFees).toFixed(2));

  // Auto-fill from customer or address book
  useEffect(() => {
    if (customer) {
      setContactData({
        name: customer.name || 'Customer',
        email: customer.email || 'customer@example.com',
        phone: customer.phone || '',
      });
      if (customer.address) {
        setAddressData((prev) => ({
          ...prev,
          street: customer.address?.street || prev.street,
          city: customer.address?.city || prev.city,
          state: customer.address?.state || prev.state,
          zip: customer.address?.zip || prev.zip,
          country: customer.address?.country || prev.country,
        }));
      }
    }
  }, [customer]);

  // Load URL coupon query parameter if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const qCoupon = urlParams.get('coupon');
      if (qCoupon) {
        handleApplyCouponCode(qCoupon);
      }
    }
  }, [totalAmount]);

  const handleApplyCouponCode = async (code: string) => {
    const clean = code.trim().toUpperCase();
    if (!clean) return;
    setIsValidatingCoupon(true);
    setCouponError('');
    try {
      const res = await validateCoupon({
        code: clean,
        cartSubtotal: totalAmount,
        productIds: items.map((i) => i.productId),
      });

      if (res.valid) {
        setAppliedDiscount({
          code: res.code || clean,
          title: res.title || clean,
          savings: res.savings,
        });
        setCouponCode('');
        setShowPromotionsModal(false);
        toast.success(`Promotion "${res.title || clean}" applied!`);
      } else {
        setCouponError(res.message || 'Invalid promotion code.');
      }
    } catch {
      setCouponError('Unable to apply promo code at this time.');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedDiscount(null);
    setCouponCode('');
    setCouponError('');
  };

  // Order Placement Handler
  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty. Add items to checkout.');
      router.push('/products');
      return;
    }

    // Validate card if card method is selected
    if (paymentMethod === 'CARD') {
      const cleanNum = cardData.cardNumber.replace(/\s+/g, '');
      if (cleanNum.length < 13 || cleanNum.startsWith('0000')) {
        setShowCardErrorModal(true);
        return;
      }
    }

    startLoading('Placing your order...');
    try {
      const shippingAddress = {
        name: contactData.name,
        street: addressData.street + (addressData.aptSuite ? `, Apt ${addressData.aptSuite}` : ''),
        city: addressData.city,
        state: addressData.state,
        zip: addressData.zip,
        country: addressData.country,
        phone: contactData.phone,
      };

      const cartItemsPayload = items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        sku: i.sku,
        image: i.image,
      }));

      // 1. Razorpay
      if (paymentMethod === 'RAZORPAY') {
        const orderRes = await createRazorpayOrder({
          customerName: contactData.name,
          customerEmail: contactData.email,
          customerPhone: contactData.phone,
          shippingAddress,
          items: cartItemsPayload,
          couponCode: appliedDiscount?.code,
          cartToken,
          shippingMethod: deliverySpeed,
          shippingFee: deliveryFee,
        });

        if (typeof window !== 'undefined' && window.Razorpay) {
          const rzp = new window.Razorpay({
            key: orderRes.keyId,
            amount: orderRes.amount,
            currency: orderRes.currency,
            order_id: orderRes.razorpayOrderId,
            name: storeName,
            description: `Order for ${storeName}`,
            handler: async (response: any) => {
              const verifyRes = await verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                customerName: contactData.name,
                customerEmail: contactData.email,
                customerPhone: contactData.phone,
                shippingAddress,
                items: cartItemsPayload,
                couponCode: appliedDiscount?.code,
                cartToken,
                shippingMethod: deliverySpeed,
                shippingFee: deliveryFee,
              });
              await clearCart();
              router.push(`/checkout/success?orderNumber=${verifyRes.order?.orderNumber || orderRes.orderNumber || orderRes.razorpayOrderId}`);
            },
            prefill: {
              name: contactData.name,
              email: contactData.email,
              contact: contactData.phone,
            },
            theme: { color: '#000000' },
          });
          rzp.open();
          return;
        }
      }

      // 2. Stripe
      if (paymentMethod === 'STRIPE') {
        const stripeRes = await createStripePaymentIntent({
          customerName: contactData.name,
          customerEmail: contactData.email,
          customerPhone: contactData.phone,
          shippingAddress,
          items: cartItemsPayload,
          couponCode: appliedDiscount?.code,
          cartToken,
          currency: storeCurrency || 'USD',
        });

        const verified = await verifyStripePayment({
          paymentIntentId: stripeRes.clientSecret,
          customerName: contactData.name,
          customerEmail: contactData.email,
          customerPhone: contactData.phone,
          shippingAddress,
          items: cartItemsPayload,
          couponCode: appliedDiscount?.code,
          cartToken,
        });

        await clearCart();
        router.push(`/checkout/success?orderNumber=${verified.order?.orderNumber || stripeRes.orderNumber || 'STRIPE-' + Date.now()}`);
        return;
      }

      // 3. Direct Card or COD
      const directMethod = paymentMethod === 'COD' ? 'COD' : 'CREDIT_CARD';
      const result = await processDirectCheckout({
        customerName: contactData.name,
        customerEmail: contactData.email,
        customerPhone: contactData.phone,
        shippingAddress,
        items: cartItemsPayload,
        couponCode: appliedDiscount?.code,
        cartToken,
        paymentMethod: directMethod,
        shippingMethod: deliverySpeed,
        shippingFee: deliveryFee,
      });

      await clearCart();
      const orderNum = result.order?.orderNumber || `UB-${Math.floor(100000 + Math.random() * 900000)}`;
      router.push(`/checkout/success?orderNumber=${orderNum}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to complete order. Please try again.');
    } finally {
      stopLoading();
    }
  };

  const getDropoffLabel = () => {
    switch (dropoffOption) {
      case 'MEET_AT_DOOR':
        return 'Meet at my door';
      case 'MEET_OUTSIDE':
        return 'Meet outside';
      case 'MEET_IN_LOBBY':
        return 'Meet in the lobby';
      case 'LEAVE_AT_DOOR':
        return 'Leave at my door';
      case 'LEAVE_AT_RECEPTION':
        return 'Leave at building reception';
      default:
        return 'Meet at my door';
    }
  };

  const getPaymentDisplayLabel = () => {
    switch (paymentMethod) {
      case 'CARD':
        return `Credit or debit card (•••• ${cardData.cardNumber.slice(-4) || '4018'})`;
      case 'RAZORPAY':
        return 'UPI / NetBanking / Cards (Razorpay)';
      case 'STRIPE':
        return 'Stripe Secure Checkout';
      case 'COD':
        return 'Cash on Delivery';
      default:
        return 'Credit or debit card';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-white flex flex-col font-sans">
      {/* ── Uber Eats Minimal Header ────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm font-semibold hover:opacity-75 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to store</span>
          </Link>

          <div className="font-extrabold text-xl sm:text-2xl tracking-tight flex items-center gap-2">
            <span>{storeName}</span>
          </div>

          <div className="w-24 text-right">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>
      </header>

      {/* ── Main 2-Column Split Checkout ──────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ═════════ LEFT COLUMN: Details & Options ═════════ */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Delivery Details / Pickup Details Card */}
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">
                  {fulfillmentType === 'DELIVERY' ? 'Delivery details' : 'Pickup Details'}
                </h2>

                {/* Delivery / Pickup Pill Toggle (Matching Step 2 / Step 16) */}
                <div className="inline-flex p-1 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700">
                  <button
                    onClick={() => setFulfillmentType('DELIVERY')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      fulfillmentType === 'DELIVERY'
                        ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    Delivery
                  </button>
                  <button
                    onClick={() => setFulfillmentType('PICKUP')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      fulfillmentType === 'PICKUP'
                        ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    Pickup
                  </button>
                </div>
              </div>

              {fulfillmentType === 'DELIVERY' ? (
                <div className="space-y-4 divide-y divide-neutral-100 dark:divide-neutral-800">
                  {/* Address Row */}
                  <div className="pt-2 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 mt-0.5 shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-neutral-900 dark:text-white">
                          {addressData.street}
                          {addressData.aptSuite ? `, Apt ${addressData.aptSuite}` : ''}
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                          {addressData.city}, {addressData.state} {addressData.zip}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAddressModal(true)}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Dropoff Instructions Row */}
                  <div className="pt-4 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 mt-0.5 shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-neutral-900 dark:text-white">
                          {getDropoffLabel()}
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
                          {addressData.instructions || 'Add delivery instructions'}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowDropoffModal(true)}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ) : (
                /* Pickup Mode View (Matching Step 16 / Step 20) */
                <div className="space-y-4">
                  {/* Route Illustration Map Card */}
                  <div className="relative w-full h-36 rounded-2xl overflow-hidden bg-emerald-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 150" fill="none">
                      <path
                        d="M 50 110 C 180 120, 240 40, 420 50"
                        stroke="#000000"
                        strokeWidth="4"
                        strokeDasharray="6 6"
                        className="dark:stroke-white"
                      />
                    </svg>
                    <div className="absolute left-10 bottom-6 bg-black text-white p-2 rounded-xl shadow-lg flex items-center gap-1.5 text-xs font-bold">
                      <Store className="w-4 h-4" />
                      <span>{storeName}</span>
                    </div>
                    <div className="absolute right-12 top-6 bg-neutral-900 text-white p-2 rounded-full shadow-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-2">
                    <Store className="w-5 h-5 text-neutral-500 mt-0.5" />
                    <div>
                      <div className="font-bold text-sm text-neutral-900 dark:text-white">
                        {storeName} Pickup Counter
                      </div>
                      <div className="text-xs text-neutral-500 mt-0.5">
                        {addressData.street}, {addressData.city}, {addressData.state}
                      </div>
                      <div className="text-xs text-emerald-600 font-semibold mt-1">
                        Ready in 20-30 minutes • $0 Pickup Fee
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Delivery Options / Pickup Time Card (Matching Step 2 / Step 16) */}
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-4">
              <h2 className="text-xl font-bold tracking-tight">
                {fulfillmentType === 'DELIVERY' ? 'Delivery options' : 'Pickup time'}
              </h2>

              {fulfillmentType === 'DELIVERY' ? (
                <div className="space-y-3">
                  {/* Priority Option */}
                  <div
                    onClick={() => setDeliverySpeed('PRIORITY')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      deliverySpeed === 'PRIORITY'
                        ? 'border-black dark:border-white bg-neutral-50/70 dark:bg-neutral-800/40 shadow-xs'
                        : 'border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 font-bold text-sm">
                          <span>Priority</span>
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-600 text-white font-black">
                            Faster
                          </span>
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                          30-60 min • Delivered directly to you
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-neutral-900 dark:text-white">+$1.99</span>
                  </div>

                  {/* Standard Option (Selected default with thick border) */}
                  <div
                    onClick={() => setDeliverySpeed('STANDARD')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      deliverySpeed === 'STANDARD'
                        ? 'border-black dark:border-white bg-neutral-50/70 dark:bg-neutral-800/40 shadow-xs'
                        : 'border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">Standard</div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                          35-65 min • Standard shipping
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-neutral-500">Included</span>
                  </div>

                  {/* Schedule Option */}
                  <div
                    onClick={() => {
                      setDeliverySpeed('SCHEDULE');
                      setShowScheduleModal(true);
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      deliverySpeed === 'SCHEDULE'
                        ? 'border-black dark:border-white bg-neutral-50/70 dark:bg-neutral-800/40 shadow-xs'
                        : 'border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">Schedule</div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                          {deliverySpeed === 'SCHEDULE' ? scheduledTime : 'Select a time'}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </div>
                </div>
              ) : (
                /* Pickup Time Options */
                <div className="space-y-3">
                  <div
                    onClick={() => setDeliverySpeed('STANDARD')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      deliverySpeed === 'STANDARD'
                        ? 'border-black dark:border-white bg-neutral-50/70 dark:bg-neutral-800/40 shadow-xs'
                        : 'border-neutral-200/80 dark:border-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <Clock className="w-5 h-5 text-neutral-600" />
                      <div>
                        <div className="font-bold text-sm">Right now</div>
                        <div className="text-xs text-neutral-500 mt-0.5">20-30 min</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600">Free</span>
                  </div>

                  <div
                    onClick={() => {
                      setDeliverySpeed('SCHEDULE');
                      setShowScheduleModal(true);
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      deliverySpeed === 'SCHEDULE'
                        ? 'border-black dark:border-white bg-neutral-50/70 dark:bg-neutral-800/40 shadow-xs'
                        : 'border-neutral-200/80 dark:border-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <Calendar className="w-5 h-5 text-neutral-600" />
                      <div>
                        <div className="font-bold text-sm">Schedule</div>
                        <div className="text-xs text-neutral-500 mt-0.5">
                          {deliverySpeed === 'SCHEDULE' ? scheduledTime : 'Select a time'}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </div>
                </div>
              )}
            </div>

            {/* 3. Payment Card (Matching Step 2 / Step 21) */}
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">Payment</h2>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition cursor-pointer"
                >
                  Edit
                </button>
              </div>

              <div
                onClick={() => setShowPaymentModal(true)}
                className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/60 cursor-pointer hover:border-neutral-300 dark:hover:border-neutral-600 transition"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-neutral-900 dark:text-white">
                      {getPaymentDisplayLabel()}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {paymentMethod === 'CARD' ? `Exp ${cardData.expDate} • Safe 256-bit encryption` : 'Instant verification on order'}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </div>
            </div>

            {/* Bottom Full-Width CTA Button (Matching Step 2) */}
            <button
              onClick={handlePlaceOrder}
              className="w-full py-4 px-6 rounded-2xl font-bold text-base bg-black text-white hover:bg-neutral-800 active:scale-[0.99] transition shadow-xl cursor-pointer"
            >
              Continue to payment
            </button>
          </div>

          {/* ═════════ RIGHT COLUMN: Sticky Order Summary ═════════ */}
          <div className="lg:col-span-5 sticky top-24 space-y-5">
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-6">
              {/* Store Avatar & Info Card (Matching Step 2 / Step 8) */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-bold text-lg text-black dark:text-white border border-neutral-200 dark:border-neutral-700">
                    {theme.logo ? (
                      <Image
                        src={theme.logo}
                        alt={storeName}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      storeName.charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base leading-tight">{storeName}</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {addressData.street}, {addressData.city}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </div>

              {/* Primary Duplicate Sticky CTA Button (Matching Step 2 / Step 8) */}
              <button
                onClick={handlePlaceOrder}
                className="w-full py-4 px-6 rounded-2xl font-bold text-base bg-black text-white hover:bg-neutral-800 active:scale-[0.99] transition shadow-lg cursor-pointer"
              >
                Continue to payment
              </button>

              {/* Cart Summary Accordion (Matching Step 8) */}
              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4">
                <button
                  onClick={() => setIsCartSummaryOpen(!isCartSummaryOpen)}
                  className="w-full flex items-center justify-between py-2 font-bold text-sm text-neutral-900 dark:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-neutral-500" />
                    <span>Cart summary ({itemCount} items)</span>
                  </div>
                  {isCartSummaryOpen ? (
                    <ChevronUp className="w-4 h-4 text-neutral-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-500" />
                  )}
                </button>

                {isCartSummaryOpen && (
                  <div className="mt-3 space-y-3 divide-y divide-neutral-100 dark:divide-neutral-800 max-h-60 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div
                        key={`${item.productId}-${item.variantId || 'base'}`}
                        className="pt-3 flex items-center gap-3 text-xs"
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0 relative border border-neutral-200/60 dark:border-neutral-700/60">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm">🛍️</div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-neutral-900 dark:text-white line-clamp-1">
                            {item.name}
                          </div>
                          <div className="text-neutral-400 mt-0.5">
                            {formatPrice(item.price)}
                          </div>
                        </div>

                        <div className="w-6 h-6 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-bold text-neutral-700 dark:text-neutral-300 text-xs shrink-0">
                          {item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Promotion Row (Matching Step 2 / Step 6) */}
              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4">
                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  Promotion
                </div>
                <div
                  onClick={() => setShowPromotionsModal(true)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60 cursor-pointer hover:border-neutral-300 dark:hover:border-neutral-600 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Tag className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {appliedDiscount ? (
                        <span className="text-emerald-600 font-bold uppercase">{appliedDiscount.code} (-{formatPrice(appliedDiscount.savings)})</span>
                      ) : (
                        'Add promo code'
                      )}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </div>
              </div>

              {/* Order Total Breakdown (Matching Step 2 / Step 8) */}
              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4 space-y-3 text-sm">
                <h4 className="text-base font-bold text-neutral-900 dark:text-white">Order total</h4>

                <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{formatPrice(totalAmount)}</span>
                </div>

                {appliedDiscount && (
                  <div className="flex items-center justify-between text-emerald-600 font-semibold">
                    <span>Promotion ({appliedDiscount.code})</span>
                    <span>-{formatPrice(appliedDiscount.savings)}</span>
                  </div>
                )}

                {/* Delivery Fee with Click Popover (Matching Step 3) */}
                <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400 relative">
                  <div className="flex items-center gap-1.5">
                    <span>Delivery Fee</span>
                    <button
                      onClick={() => setShowDeliveryFeeTooltip(!showDeliveryFeeTooltip)}
                      className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {deliveryFee === 0 ? <span className="text-emerald-600">FREE</span> : formatPrice(deliveryFee)}
                  </span>

                  {/* Delivery Fee Popover Modal/Card (Step 3) */}
                  {showDeliveryFeeTooltip && (
                    <div className="absolute bottom-6 left-0 z-30 w-72 p-4 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-2xl animate-fade-in text-xs">
                      <div className="flex items-center justify-between font-bold text-sm text-neutral-900 dark:text-white mb-2">
                        <span>What's a delivery fee?</span>
                        <button
                          onClick={() => setShowDeliveryFeeTooltip(false)}
                          className="text-neutral-400 hover:text-neutral-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-neutral-500 dark:text-neutral-300 leading-relaxed">
                        This fee helps cover delivery costs. The amount varies for each order based on things like your location and courier availability.
                      </p>
                    </div>
                  )}
                </div>

                {/* Taxes & Other Fees with Click Breakdown Modal (Matching Step 4) */}
                <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <span>Taxes & Other Fees</span>
                    <button
                      onClick={() => setShowTaxesModal(true)}
                      className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {formatPrice(taxesAndOtherFees)}
                  </span>
                </div>

                {/* Grand Total */}
                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800 text-lg font-bold">
                  <span className="text-neutral-900 dark:text-white font-extrabold">Total</span>
                  <span className="text-2xl font-black text-black dark:text-white">
                    {formatPrice(totalOrderAmount)}
                  </span>
                </div>
              </div>

              {/* Uber Eats Disclaimers (Matching Step 2 fine print) */}
              <div className="pt-2 text-[11px] text-neutral-400 dark:text-neutral-500 space-y-1.5 leading-relaxed">
                <p>Prices may be lower in store.</p>
                <p>
                  If you're not around when the delivery person arrives, they'll leave your order at the door. By placing your order, you agree to take full responsibility for it once it's delivered.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════════════════════════
          INTERACTIVE MODALS MATCHING UBER EATS REFERO.DESIGN
         ══════════════════════════════════════════════════════════════════════════ */}

      {/* 1. Edit Address Modal (Step 10 & Step 11) */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Edit address</h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Map Pin Banner Graphic */}
            <div className="relative w-full h-32 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center mb-4">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_14px]" />
              <div className="relative flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center shadow-lg">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="mt-1 px-3 py-1 rounded-full bg-white dark:bg-neutral-900 text-xs font-bold shadow-xs border border-neutral-200 dark:border-neutral-700">
                  Adjust pin
                </span>
              </div>
            </div>

            <p className="text-xs font-bold text-neutral-500 mb-4">
              {addressData.street}, {addressData.city}, {addressData.state} {addressData.zip}
            </p>

            <div className="space-y-4 text-xs">
              {/* Building Type Dropdown */}
              <div>
                <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">Building type</label>
                <select
                  value={addressData.buildingType}
                  onChange={(e) => setAddressData({ ...addressData, buildingType: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-semibold outline-hidden"
                >
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Office">Office</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Apt / Suite / Floor */}
              <div>
                <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">Apt / Suite / Floor</label>
                <input
                  type="text"
                  placeholder="e.g. 1208"
                  value={addressData.aptSuite}
                  onChange={(e) => setAddressData({ ...addressData, aptSuite: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-medium outline-hidden"
                />
              </div>

              {/* Business / Building Name */}
              <div>
                <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">Business / Building name</label>
                <input
                  type="text"
                  placeholder="e.g. Central Tower"
                  value={addressData.buildingName}
                  onChange={(e) => setAddressData({ ...addressData, buildingName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-medium outline-hidden"
                />
              </div>

              {/* Instructions for delivery person */}
              <div>
                <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Instructions for delivery person
                </label>
                <textarea
                  rows={2}
                  placeholder="Example: Please knock instead of using the doorbell"
                  value={addressData.instructions}
                  onChange={(e) => setAddressData({ ...addressData, instructions: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-medium outline-hidden"
                />
              </div>

              {/* Address label */}
              <div>
                <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">Address label</label>
                <input
                  type="text"
                  placeholder="Add a label (e.g. Home, Work, School)"
                  value={addressData.label}
                  onChange={(e) => setAddressData({ ...addressData, label: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-medium outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddressModal(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => setShowAddressModal(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-xs bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Dropoff Options Modal (Step 14 & Step 15) */}
      {showDropoffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">Dropoff options</h3>
                <p className="text-xs text-neutral-400 mt-0.5">Deliver to {addressData.street}</p>
              </div>
              <button
                onClick={() => setShowDropoffModal(false)}
                className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Hand it to me Group */}
              <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 space-y-3">
                <div className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                  <span>🛍️</span>
                  <span>Hand it to me</span>
                </div>
                <div className="space-y-2 pl-6 text-xs font-semibold">
                  {[
                    { id: 'MEET_AT_DOOR', label: 'Meet at my door' },
                    { id: 'MEET_OUTSIDE', label: 'Meet outside' },
                    { id: 'MEET_IN_LOBBY', label: 'Meet in the lobby' },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className="flex items-center justify-between cursor-pointer py-1"
                    >
                      <span>{opt.label}</span>
                      <input
                        type="radio"
                        name="dropoff"
                        checked={dropoffOption === opt.id}
                        onChange={() => setDropoffOption(opt.id as any)}
                        className="w-4 h-4 accent-black"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Leave at location Group */}
              <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 space-y-3">
                <div className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                  <span>🚪</span>
                  <span>Leave at location</span>
                </div>
                <div className="space-y-2 pl-6 text-xs font-semibold">
                  {[
                    { id: 'LEAVE_AT_DOOR', label: 'Leave at my door' },
                    { id: 'LEAVE_AT_RECEPTION', label: 'Leave at building reception' },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className="flex items-center justify-between cursor-pointer py-1"
                    >
                      <span>{opt.label}</span>
                      <input
                        type="radio"
                        name="dropoff"
                        checked={dropoffOption === opt.id}
                        onChange={() => setDropoffOption(opt.id as any)}
                        className="w-4 h-4 accent-black"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <label className="font-bold text-xs text-neutral-700 dark:text-neutral-300 block mb-1">
                  Instructions for delivery person
                </label>
                <textarea
                  rows={2}
                  placeholder="Example: Please leave it at the front porch, knock on arrival"
                  value={addressData.instructions}
                  onChange={(e) => setAddressData({ ...addressData, instructions: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs font-medium outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDropoffModal(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => setShowDropoffModal(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-xs bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition cursor-pointer"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Schedule Time Modal (Step 18) */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">
                {fulfillmentType === 'DELIVERY' ? 'Schedule delivery' : 'Schedule pickup'}
              </h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Day Chips (Step 18) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4">
              {['Mon Aug 5', 'Tue Aug 6', 'Wed Aug 7', 'Thu Aug 8', 'Fri Aug 9'].map((day, idx) => (
                <button
                  key={day}
                  onClick={() => setScheduledTime(`${day}, 11:30 AM – 12:00 PM`)}
                  className={`px-4 py-3 rounded-2xl border-2 shrink-0 text-left transition cursor-pointer ${
                    scheduledTime.includes(day)
                      ? 'border-black dark:border-white bg-neutral-50 dark:bg-neutral-800'
                      : 'border-neutral-200 dark:border-neutral-700'
                  }`}
                >
                  <div className="text-xs font-bold text-neutral-900 dark:text-white">
                    {day.split(' ')[0]}
                  </div>
                  <div className="text-[11px] text-neutral-400">{day.split(' ').slice(1).join(' ')}</div>
                </button>
              ))}
            </div>

            {/* Time Slot Radio Options (Step 18) */}
            <div className="space-y-2 text-sm max-h-60 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800">
              {[
                '11:00 AM – 11:30 AM',
                '11:15 AM – 11:45 AM',
                '11:30 AM – 12:00 PM',
                '11:45 AM – 12:15 PM',
                '12:00 PM – 12:30 PM',
                '12:15 PM – 12:45 PM',
                '12:30 PM – 1:00 PM',
              ].map((slot) => {
                const isSelected = scheduledTime.includes(slot);
                return (
                  <label
                    key={slot}
                    className="flex items-center justify-between py-2.5 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 px-2 rounded-xl"
                  >
                    <span className="font-semibold text-neutral-900 dark:text-white">{slot}</span>
                    <input
                      type="radio"
                      name="timeslot"
                      checked={isSelected}
                      onChange={() => {
                        const dayPart = scheduledTime.split(',')[0] || 'Wed Aug 7';
                        setScheduledTime(`${dayPart}, ${slot}`);
                      }}
                      className="w-4 h-4 accent-black"
                    />
                  </label>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="w-full py-3.5 rounded-2xl font-bold text-sm bg-black text-white hover:bg-neutral-800 transition cursor-pointer"
              >
                Confirm Time
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Promotions Modal (Step 6) */}
      {showPromotionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Promotions</h3>
              <button
                onClick={() => setShowPromotionsModal(false)}
                className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Promo Code Input & Apply (Step 6) */}
            <div className="flex gap-2 mb-6">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-bold uppercase text-xs outline-hidden"
                />
              </div>
              <button
                onClick={() => handleApplyCouponCode(couponCode)}
                disabled={isValidatingCoupon || !couponCode.trim()}
                className="px-6 py-3 rounded-2xl font-bold text-xs bg-black text-white dark:bg-white dark:text-black hover:opacity-90 disabled:opacity-40 transition cursor-pointer"
              >
                {isValidatingCoupon ? '...' : 'Apply'}
              </button>
            </div>

            {couponError && <p className="text-xs text-rose-500 mb-4">{couponError}</p>}

            {/* Active / Available Promo Banner (Step 6) */}
            {appliedDiscount ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between mb-6">
                <div>
                  <div className="font-bold text-emerald-700 dark:text-emerald-400 uppercase text-sm">
                    {appliedDiscount.code}
                  </div>
                  <div className="text-xs text-emerald-600 mt-0.5">
                    Saved {formatPrice(appliedDiscount.savings)} on your order
                  </div>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-xs font-bold text-rose-500 hover:text-rose-600 transition"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="text-center py-6 text-neutral-400">
                <div className="w-14 h-14 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-2 text-2xl">
                  🏷️
                </div>
                <p className="text-xs font-medium">You currently don't have any promotions</p>
              </div>
            )}

            {/* Membership Promo Card (Step 6 bottom banner) */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-neutral-800 border border-amber-200/60 dark:border-neutral-700 flex items-center justify-between mb-6">
              <div>
                <div className="font-extrabold text-sm text-neutral-900 dark:text-white">
                  $0 Delivery Fee + up to 10% off
                </div>
                <div className="text-xs text-neutral-500 mt-0.5">With store membership benefits</div>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-900 text-xs font-bold shadow-xs">
                Active
              </span>
            </div>

            <button
              onClick={() => setShowPromotionsModal(false)}
              className="w-full py-3.5 rounded-2xl font-bold text-sm bg-black text-white hover:bg-neutral-800 transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 5. Taxes & Fees Breakdown Modal (Step 4) */}
      {showTaxesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">What's included?</h3>
              <button
                onClick={() => setShowTaxesModal(false)}
                className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-neutral-900 dark:text-white text-sm">
                    Service Fee and Other Fees
                  </div>
                  <div className="text-neutral-500 mt-1 leading-relaxed">
                    These fees vary based on factors like basket size and help cover costs related to order processing and fulfillment.
                  </div>
                </div>
                <span className="font-bold text-sm ml-4">{formatPrice(serviceFee)}</span>
              </div>

              <div className="flex justify-between items-start pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <div>
                  <div className="font-bold text-neutral-900 dark:text-white text-sm">Taxes</div>
                  <div className="text-neutral-500 mt-1">
                    Standard state and local sales tax ({taxRate}%).
                  </div>
                </div>
                <span className="font-bold text-sm ml-4">
                  {isTaxInclusive ? 'Included' : formatPrice(calculatedTax)}
                </span>
              </div>
            </div>

            <div className="mt-8 space-y-2">
              <button
                onClick={() => setShowTaxesModal(false)}
                className="w-full py-3.5 rounded-2xl font-bold text-sm bg-black text-white hover:bg-neutral-800 transition cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Payment Method Modal (Step 21 & Step 22) */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Select Payment Method</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Payment Tabs / Radio Choices */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              {[
                { id: 'CARD', label: 'Card', icon: '💳' },
                ...(isRazorpayEnabled ? [{ id: 'RAZORPAY', label: 'UPI / India', icon: '⚡' }] : []),
                ...(isStripeEnabled ? [{ id: 'STRIPE', label: 'Stripe', icon: '🌍' }] : []),
                ...(isCodEnabled ? [{ id: 'COD', label: 'Cash', icon: '💵' }] : []),
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-3 rounded-2xl border-2 text-center transition cursor-pointer ${
                    paymentMethod === m.id
                      ? 'border-black dark:border-white bg-neutral-50 dark:bg-neutral-800'
                      : 'border-neutral-200 dark:border-neutral-700'
                  }`}
                >
                  <div className="text-xl mb-1">{m.icon}</div>
                  <div className="text-xs font-bold">{m.label}</div>
                </button>
              ))}
            </div>

            {/* Card Form (Matching Step 21) */}
            {paymentMethod === 'CARD' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="4003 8301 7187 4018"
                      value={cardData.cardNumber}
                      onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono font-bold text-sm outline-hidden"
                    />
                    <span className="absolute right-3 top-2.5 px-1.5 py-0.5 rounded-md bg-blue-600 text-white font-black text-[10px]">
                      VISA
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                      Exp. Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardData.expDate}
                      onChange={(e) => setCardData({ ...cardData, expDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono font-bold text-xs outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                      Security Code
                    </label>
                    <input
                      type="password"
                      placeholder="CVV"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono font-bold text-xs outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={cardData.country}
                      onChange={(e) => setCardData({ ...cardData, country: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-medium text-xs outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      placeholder="94108"
                      value={cardData.zip}
                      onChange={(e) => setCardData({ ...cardData, zip: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-medium text-xs outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Nickname (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. joint account or work card"
                    value={cardData.nickname}
                    onChange={(e) => setCardData({ ...cardData, nickname: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-medium text-xs outline-hidden"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'RAZORPAY' && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
                ⚡ Secure UPI, Google Pay, PhonePe, Paytm & NetBanking will launch automatically when you confirm.
              </div>
            )}

            {paymentMethod === 'COD' && (
              <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-600 dark:text-neutral-300">
                💵 Pay with cash or card directly to the courier when your order arrives.
              </div>
            )}

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-xs bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Card Error Submodal (Matching Step 22) */}
      {showCardErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-slide-up text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-500 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-1">Incorrect card number</h3>
            <p className="text-xs text-neutral-500 mb-6">
              Please check your card number and try again.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowCardErrorModal(false);
                  setShowPaymentModal(true);
                }}
                className="w-full py-3 rounded-xl font-bold text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-200 transition cursor-pointer"
              >
                Switch payment method
              </button>
              <button
                onClick={() => {
                  setShowCardErrorModal(false);
                  setShowPaymentModal(true);
                }}
                className="w-full py-3 rounded-xl font-bold text-xs bg-black text-white hover:bg-neutral-800 transition cursor-pointer"
              >
                Edit card number
              </button>
              <button
                onClick={() => setShowCardErrorModal(false)}
                className="w-full py-2 text-xs font-semibold text-neutral-400 hover:text-neutral-600 transition"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
