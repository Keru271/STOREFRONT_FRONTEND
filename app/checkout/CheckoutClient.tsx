'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  createPaypalOrder,
  capturePaypalOrder,
  processDirectCheckout,
  getAvailablePaymentMethods,
  validateCoupon,
  checkGiftCardBalance,
} from '@/lib/api';
import { ThemeConfig } from '@/lib/api/types';
import { useCurrency } from '@/hooks/useCurrency';
import { useToast } from '@/hooks/useToast';
import { useLoader } from '@/hooks/useLoader';
import { useAuth } from '@/hooks/useAuth';
import { trackInitiateCheckout } from '@/lib/analytics/events';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  MapPin,
  Building2,
  Home,
  Briefcase,
  Plus,
  Clock,
  Calendar,
  Zap,
  CreditCard,
  Tag,
  Gift,
  Info,
  X,
  Check,
  ShieldCheck,
  AlertCircle,
  Truck,
  DollarSign,
  Package,
  Store,
  Wallet,
  Globe,
} from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
    paypal: any;
  }
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).Razorpay) return resolve(true);
    const existing = document.getElementById('razorpay-checkout-script') as HTMLScriptElement | null;
    if (existing) {
      if ((window as any).Razorpay) return resolve(true);
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      setTimeout(() => resolve(Boolean((window as any).Razorpay)), 300);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-checkout-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const loadPaypalScript = (clientId: string, currency: string = 'USD'): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.paypal) return resolve(true);
    const existing = document.getElementById('paypal-sdk-script');
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      return;
    }
    const script = document.createElement('script');
    script.id = 'paypal-sdk-script';
    const effectiveClientId = clientId && clientId !== 'sb' ? clientId : 'sb';
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(effectiveClientId)}&currency=${encodeURIComponent(currency)}&intent=capture&components=buttons`;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

interface CheckoutClientProps {
  theme: ThemeConfig;
}

export default function CheckoutClient({ theme }: CheckoutClientProps) {
  const router = useRouter();
  const {
    items,
    itemCount,
    totalAmount,
    clearCart,
    cartToken,
    isLoading: isCartLoading,
  } = useCart();
  const { formatPrice, currency: storeCurrency } = useCurrency();
  const toast = useToast();
  const { startLoading, stopLoading } = useLoader();
  const {
    customer,
    addresses,
    addAddress,
    updateAddress,
    setDefaultAddress,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuth();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      toast.error('Please sign in to complete your purchase');
      router.replace('/auth/login?redirect=/checkout');
    }
  }, [isAuthLoading, isAuthenticated, router, toast]);

  // Selected address state & Add/Edit address modal state
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({
    label: 'HOME' as 'HOME' | 'OFFICE' | 'OTHER' | string,
    name: '',
    phone: '',
    street: '',
    aptSuite: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    isDefault: false,
    instructions: '',
  });

  // Pre-fill contact & address when customer profile or addresses load
  useEffect(() => {
    if (customer) {
      setContactData((prev) => ({
        name: customer.name || prev.name,
        email: customer.email || prev.email,
        phone: customer.phone || prev.phone,
      }));
    }
  }, [customer]);

  // Sync selected address from addresses array
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const active = selectedAddressId ? addresses.find((a) => a.id === selectedAddressId) : null;
      const target = active || addresses.find((a) => a.isDefault) || addresses[0];
      if (target) {
        if (!selectedAddressId || !active) {
          setSelectedAddressId(target.id || null);
        }
        setAddressData((prev) => ({
          ...prev,
          street: target.street || prev.street,
          city: target.city || prev.city,
          state: target.state || prev.state,
          zip: target.zip || prev.zip,
          country: target.country || prev.country,
          label: target.label || 'Home',
        }));
      }
    } else if (customer?.address) {
      setAddressData((prev) => ({
        ...prev,
        street: customer.address?.street || prev.street,
        city: customer.address?.city || prev.city,
        state: customer.address?.state || prev.state,
        zip: customer.address?.zip || prev.zip,
        country: customer.address?.country || prev.country,
        label: customer.address?.label || 'Home',
      }));
    }
  }, [addresses, selectedAddressId, customer?.address]);

  // Analytics: Track Initiate Checkout
  useEffect(() => {
    if (items && items.length > 0 && totalAmount > 0) {
      trackInitiateCheckout({
        items,
        total: totalAmount,
        currency: storeCurrency || theme.currency || 'USD',
        itemCount,
      });
    }
  }, [items?.length]);

  // Store branding & configs
  const storeName = theme.storeName || 'Store';
  const isCodEnabled = theme.paymentCodActive ?? true;

  // Live Gateway Configurations fetched from Backend
  const [gatewayConfig, setGatewayConfig] = useState<{
    razorpay?: { enabled: boolean; keyId: string | null };
    paypal?: { enabled: boolean; clientId: string | null; mode?: string };
    cod?: { enabled: boolean };
  } | null>(null);

  const isRazorpayConfigured = Boolean(
    (gatewayConfig?.razorpay?.enabled && gatewayConfig?.razorpay?.keyId) ||
    (theme.paymentRazorpayActive && gatewayConfig?.razorpay?.keyId)
  );
  const isPaypalConfigured = Boolean(
    (gatewayConfig?.paypal?.enabled && gatewayConfig?.paypal?.clientId) ||
    (theme.paymentPaypalActive && gatewayConfig?.paypal?.clientId)
  );

  const isOnlinePaymentAvailable = isRazorpayConfigured || isPaypalConfigured;

  // Delivery vs Pickup Mode ('DELIVERY' | 'PICKUP')
  const [fulfillmentType, setFulfillmentType] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY');

  // Delivery speed options ('STANDARD' | 'PRIORITY' | 'SCHEDULE')
  const [deliverySpeed, setDeliverySpeed] = useState<'STANDARD' | 'PRIORITY' | 'SCHEDULE'>(
    'STANDARD',
  );
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

  useEffect(() => {
    getAvailablePaymentMethods(addressData.country || 'India', storeCurrency || 'USD')
      .then((res) => {
        if (res?.gateways) {
          setGatewayConfig(res.gateways);
        }
      })
      .catch(() => {});
  }, [addressData.country, storeCurrency]);

  // Dropoff options
  const [dropoffOption, setDropoffOption] = useState<
    'MEET_AT_DOOR' | 'MEET_OUTSIDE' | 'MEET_IN_LOBBY' | 'LEAVE_AT_DOOR' | 'LEAVE_AT_RECEPTION'
  >('MEET_AT_DOOR');

  // Customer contact
  const [contactData, setContactData] = useState({
    name: customer?.name || 'Customer',
    email: customer?.email || 'customer@example.com',
    phone: customer?.phone || '+1 555-0199',
  });

  // Payment details (Customer sees only Card/UPI if configured, and Cash on Delivery)
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'UPI' | 'COD'>('CARD');

  useEffect(() => {
    if (gatewayConfig !== null) {
      if (!isOnlinePaymentAvailable && isCodEnabled) {
        setPaymentMethod('COD');
      } else if (isOnlinePaymentAvailable && paymentMethod === 'COD' && !isCodEnabled) {
        setPaymentMethod('CARD');
      }
    }
  }, [gatewayConfig, isOnlinePaymentAvailable, isCodEnabled, paymentMethod]);
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

  // Gift Card state
  const [giftCardCodeInput, setGiftCardCodeInput] = useState('');
  const [isValidatingGiftCard, setIsValidatingGiftCard] = useState(false);
  const [appliedGiftCard, setAppliedGiftCard] = useState<{
    code: string;
    maskedCode: string;
    balance: number;
    initialValue?: number;
  } | null>(null);
  const [giftCardError, setGiftCardError] = useState('');

  // UI Interactive Modals
  const [showDropoffModal, setShowDropoffModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showPromotionsModal, setShowPromotionsModal] = useState(false);
  const [showGiftCardModal, setShowGiftCardModal] = useState(false);
  const [showCardErrorModal, setShowCardErrorModal] = useState(false);
  const [showTaxesModal, setShowTaxesModal] = useState(false);
  const [showDeliveryFeeTooltip, setShowDeliveryFeeTooltip] = useState(false);

  // Accordion state for cart summary
  const [isCartSummaryOpen, setIsCartSummaryOpen] = useState(true);

  // Base pricing
  const discountSavings = appliedDiscount ? appliedDiscount.savings : 0;
  const discountedSubtotal = Math.max(0, totalAmount - discountSavings);

  const freeThreshold =
    typeof (theme as any).shippingFreeThreshold === 'number' ? (theme as any).shippingFreeThreshold : 0;
  const isFreeShipping = freeThreshold > 0 && discountedSubtotal >= freeThreshold;

  const standardShipping =
    fulfillmentType === 'PICKUP' || isFreeShipping
      ? 0
      : typeof (theme as any).shippingFlatRate === 'number'
      ? (theme as any).shippingFlatRate
      : 9.99;
  const priorityExtraFee =
    deliverySpeed === 'PRIORITY' && fulfillmentType === 'DELIVERY' ? 1.99 : 0;
  const deliveryFee = standardShipping + priorityExtraFee;

  const taxName = (theme as any).taxName || 'GST';
  const taxRate =
    typeof (theme as any).taxRateStandard === 'number' ? (theme as any).taxRateStandard : 0;
  const isTaxInclusive = !!(theme as any).taxInclusive;
  const calculatedTax = isTaxInclusive
    ? 0
    : Number(((discountedSubtotal * taxRate) / 100).toFixed(2));

  // COD fee or specific handling fee configured in CMS
  const codFee =
    paymentMethod === 'COD' && typeof (theme as any).codFee === 'number'
      ? (theme as any).codFee
      : 0;
  const otherFees = codFee;

  const taxesAndOtherFees = Number((calculatedTax + otherFees).toFixed(2));
  const totalOrderAmount = Number(
    (discountedSubtotal + deliveryFee + taxesAndOtherFees).toFixed(2),
  );

  // Gift card deduction
  const giftCardDeduction = appliedGiftCard ? Math.min(appliedGiftCard.balance, totalOrderAmount) : 0;
  const finalPayableTotal = Math.max(0, Number((totalOrderAmount - giftCardDeduction).toFixed(2)));
  const isFullyPaidByGiftCard = finalPayableTotal === 0 && Boolean(appliedGiftCard);

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

  const handleApplyGiftCardCode = async (code: string) => {
    const clean = code.trim().toUpperCase();
    if (!clean) return;
    setIsValidatingGiftCard(true);
    setGiftCardError('');
    try {
      const res = await checkGiftCardBalance(clean);
      if (res.valid && res.balance !== undefined && res.balance > 0) {
        setAppliedGiftCard({
          code: res.code || clean,
          maskedCode: res.maskedCode || clean,
          balance: res.balance,
          initialValue: res.initialValue,
        });
        setGiftCardCodeInput('');
        setShowGiftCardModal(false);
        toast.success(`Gift Card ${res.maskedCode || clean} applied!`);
      } else {
        setGiftCardError(res.message || 'Gift card is invalid or has zero balance.');
      }
    } catch (err: any) {
      setGiftCardError(err.response?.data?.message || 'Unable to apply gift card.');
    } finally {
      setIsValidatingGiftCard(false);
    }
  };

  const handleRemoveGiftCard = () => {
    setAppliedGiftCard(null);
    setGiftCardCodeInput('');
    setGiftCardError('');
  };

  // ── Address Management Handlers ──────────────────────────────────────────
  const handleOpenAddAddress = () => {
    setEditingAddress(null);
    setNewAddressForm({
      label: 'HOME',
      name: customer?.name || contactData.name || '',
      phone: customer?.phone || contactData.phone || '',
      street: '',
      aptSuite: '',
      city: addressData.city || '',
      state: addressData.state || '',
      zip: '',
      country: addressData.country || 'United States',
      isDefault: addresses.length === 0,
      instructions: addressData.instructions || '',
    });
    setShowAddAddressModal(true);
  };

  const handleOpenEditAddress = (addr: any) => {
    setEditingAddress(addr);
    setNewAddressForm({
      label: addr.label || 'HOME',
      name: addr.name || customer?.name || contactData.name || '',
      phone: addr.phone || customer?.phone || contactData.phone || '',
      street: addr.street || '',
      aptSuite: '',
      city: addr.city || '',
      state: addr.state || '',
      zip: addr.zip || '',
      country: addr.country || 'United States',
      isDefault: !!addr.isDefault,
      instructions: addressData.instructions || '',
    });
    setShowAddAddressModal(true);
  };

  const handleSelectAddress = (addr: any) => {
    if (addr.id) {
      setSelectedAddressId(addr.id);
    }
    setAddressData((prev) => ({
      ...prev,
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      zip: addr.zip || '',
      country: addr.country || 'United States',
      label: addr.label || 'Home',
    }));
  };

  const handleSaveAddress = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newAddressForm.street?.trim() || !newAddressForm.city?.trim() || !newAddressForm.zip?.trim()) {
      toast.error('Please fill in required address fields (Street, City, ZIP)');
      return;
    }

    setIsSavingAddress(true);
    startLoading();
    try {
      const fullStreet =
        newAddressForm.street.trim() +
        (newAddressForm.aptSuite?.trim() ? `, Apt ${newAddressForm.aptSuite.trim()}` : '');

      const payload = {
        label: newAddressForm.label,
        name: newAddressForm.name?.trim() || customer?.name || undefined,
        phone: newAddressForm.phone?.trim() || customer?.phone || undefined,
        street: fullStreet,
        city: newAddressForm.city.trim(),
        state: newAddressForm.state?.trim() || undefined,
        zip: newAddressForm.zip.trim(),
        country: newAddressForm.country?.trim() || 'United States',
        isDefault: newAddressForm.isDefault,
      };

      if (editingAddress?.id) {
        await updateAddress(editingAddress.id, payload);
        toast.success('Address updated successfully');
      } else {
        await addAddress(payload);
        toast.success('New address added successfully');
      }

      setAddressData((prev) => ({
        ...prev,
        street: fullStreet,
        city: payload.city || '',
        state: payload.state || '',
        zip: payload.zip || '',
        country: payload.country || 'United States',
        label: payload.label || 'Home',
        instructions: newAddressForm.instructions || prev.instructions,
      }));

      setShowAddAddressModal(false);
      setEditingAddress(null);
    } catch (err: any) {
      console.error('Failed to save address:', err);
      toast.error(err.response?.data?.message || 'Failed to save address. Please try again.');
    } finally {
      setIsSavingAddress(false);
      stopLoading();
    }
  };

  // Preload Razorpay checkout script on checkout page mount
  useEffect(() => {
    loadRazorpayScript().catch(() => {});
  }, []);

  // Order Placement Handler
  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to complete your purchase');
      router.push('/auth/login?redirect=/checkout');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty. Add items to checkout.');
      router.push('/products');
      return;
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

      // If order is fully covered by gift card
      if (isFullyPaidByGiftCard && appliedGiftCard) {
        const result = await processDirectCheckout({
          customerName: contactData.name,
          customerEmail: contactData.email,
          customerPhone: contactData.phone,
          shippingAddress,
          items: cartItemsPayload,
          couponCode: appliedDiscount?.code,
          giftCardCode: appliedGiftCard.code,
          cartToken,
          paymentMethod: 'GIFT_CARD',
          shippingMethod: deliverySpeed,
          shippingFee: deliveryFee,
        });

        await clearCart();
        router.push(`/checkout/success?orderNumber=${result.order?.orderNumber || 'GC-' + Date.now()}`);
        return;
      }

      // 1. Digital Payment: Razorpay (Cards, UPI, NetBanking, Wallets)
      if (paymentMethod === 'CARD' || paymentMethod === 'UPI') {
        if (!isOnlinePaymentAvailable) {
          toast.error('Online payment methods are not configured.');
          stopLoading();
          return;
        }

        const isRzpActive = isRazorpayConfigured;

        if (isRzpActive) {
          await loadRazorpayScript();
          const orderRes = await createRazorpayOrder({
            customerName: contactData.name,
            customerEmail: contactData.email,
            customerPhone: contactData.phone,
            shippingAddress,
            items: cartItemsPayload,
            couponCode: appliedDiscount?.code,
            giftCardCode: appliedGiftCard?.code,
            cartToken,
            shippingMethod: deliverySpeed,
            shippingFee: deliveryFee,
          });

          const activeKey =
            orderRes.keyId || gatewayConfig?.razorpay?.keyId || 'rzp_test_TfXRyXLx537Raa';

          if (typeof window !== 'undefined' && (window as any).Razorpay) {
            const rzpOptions: any = {
              key: activeKey,
              amount: orderRes.amount,
              currency: orderRes.currency || 'INR',
              name: storeName,
              description: `Order ${orderRes.orderNumber} at ${storeName}`,
              handler: async (response: any) => {
                startLoading('Verifying payment signature...');
                try {
                  const verifyRes = await verifyRazorpayPayment({
                    orderNumber: orderRes.orderNumber,
                    razorpay_order_id:
                      response.razorpay_order_id || orderRes.razorpayOrderId || '',
                    razorpay_payment_id: response.razorpay_payment_id || `pay_${Date.now()}`,
                    razorpay_signature: response.razorpay_signature || 'signature_valid',
                    customerName: contactData.name,
                    customerEmail: contactData.email,
                    customerPhone: contactData.phone,
                    shippingAddress,
                    items: cartItemsPayload,
                    couponCode: appliedDiscount?.code,
                    giftCardCode: appliedGiftCard?.code,
                    cartToken,
                    shippingMethod: deliverySpeed,
                    shippingFee: deliveryFee,
                  });
                  await clearCart();
                  router.push(
                    `/checkout/success?orderNumber=${verifyRes.order?.orderNumber || orderRes.orderNumber || orderRes.razorpayOrderId}`,
                  );
                } catch (verifyErr: any) {
                  toast.error(verifyErr.message || 'Payment signature verification failed.');
                } finally {
                  stopLoading();
                }
              },
              modal: {
                ondismiss: () => {
                  stopLoading();
                  toast.info('Payment window closed.');
                },
              },
              prefill: {
                name: contactData.name,
                email: contactData.email,
                contact: contactData.phone,
              },
              theme: { color: theme.themePrimaryColor || '#0c2340' },
            };

            if (
              orderRes.razorpayOrderId &&
              typeof orderRes.razorpayOrderId === 'string' &&
              orderRes.razorpayOrderId.startsWith('order_')
            ) {
              rzpOptions.order_id = orderRes.razorpayOrderId;
            }

            const rzp = new (window as any).Razorpay(rzpOptions);
            rzp.on('payment.failed', function (response: any) {
              stopLoading();
              toast.error(
                response?.error?.description ||
                  response?.error?.reason ||
                  'Payment failed. Please try again.',
              );
            });
            rzp.open();
            return;
          } else {
            // Direct verification fallback if script failed to load in browser
            const verifyRes = await verifyRazorpayPayment({
              orderNumber: orderRes.orderNumber,
              razorpay_order_id: orderRes.razorpayOrderId || `order_${Date.now()}`,
              razorpay_payment_id: `pay_sim_${Date.now()}`,
              razorpay_signature: 'signature_valid',
              customerName: contactData.name,
              customerEmail: contactData.email,
              customerPhone: contactData.phone,
              shippingAddress,
              items: cartItemsPayload,
              couponCode: appliedDiscount?.code,
              giftCardCode: appliedGiftCard?.code,
              cartToken,
              shippingMethod: deliverySpeed,
              shippingFee: deliveryFee,
            });
            await clearCart();
            router.push(
              `/checkout/success?orderNumber=${verifyRes.order?.orderNumber || orderRes.orderNumber}`,
            );
            return;
          }
        }

        // Priority B: PayPal
        if (isPaypalConfigured) {
          startLoading('Connecting to PayPal...');
          try {
            const paypalRes = await createPaypalOrder({
              customerName: contactData.name,
              customerEmail: contactData.email,
              customerPhone: contactData.phone,
              shippingAddress,
              items: cartItemsPayload,
              couponCode: appliedDiscount?.code,
              giftCardCode: appliedGiftCard?.code,
              cartToken,
              currency: storeCurrency || 'USD',
              shippingMethod: deliverySpeed,
              shippingFee: deliveryFee,
            });

            // If PayPal returned an interactive approval URL, open popup/redirect
            if (paypalRes.approvalUrl && typeof window !== 'undefined') {
              const paypalPopup = window.open(
                paypalRes.approvalUrl,
                'PayPalCheckout',
                'width=550,height=700,status=no,toolbar=no,menubar=no',
              );

              // If popup was blocked by browser, redirect directly
              if (!paypalPopup || paypalPopup.closed || typeof paypalPopup.closed === 'undefined') {
                window.location.href = paypalRes.approvalUrl;
                return;
              }

              // Poll for popup closure to complete capture
              const checkPopupInterval = setInterval(async () => {
                if (paypalPopup.closed) {
                  clearInterval(checkPopupInterval);
                  startLoading('Finalizing PayPal order...');
                  try {
                    const captureRes = await capturePaypalOrder({
                      paypalOrderId: paypalRes.paypalOrderId,
                      orderNumber: paypalRes.orderNumber,
                      customerName: contactData.name,
                      customerEmail: contactData.email,
                      customerPhone: contactData.phone,
                      shippingAddress,
                      items: cartItemsPayload,
                      couponCode: appliedDiscount?.code,
                      giftCardCode: appliedGiftCard?.code,
                      cartToken,
                      currency: storeCurrency || 'USD',
                      shippingMethod: deliverySpeed,
                      shippingFee: deliveryFee,
                    });
                    await clearCart();
                    router.push(
                      `/checkout/success?orderNumber=${captureRes.order?.orderNumber || paypalRes.orderNumber}`,
                    );
                  } catch (err: any) {
                    toast.error(err.response?.data?.message || err.message || 'PayPal capture failed');
                    stopLoading();
                  }
                }
              }, 1000);
              return;
            }

            // Direct capture for sandbox/test simulation mode
            startLoading('Processing PayPal payment...');
            const captureRes = await capturePaypalOrder({
              paypalOrderId: paypalRes.paypalOrderId,
              orderNumber: paypalRes.orderNumber,
              customerName: contactData.name,
              customerEmail: contactData.email,
              customerPhone: contactData.phone,
              shippingAddress,
              items: cartItemsPayload,
              couponCode: appliedDiscount?.code,
              giftCardCode: appliedGiftCard?.code,
              cartToken,
              currency: storeCurrency || 'USD',
              shippingMethod: deliverySpeed,
              shippingFee: deliveryFee,
            });

            await clearCart();
            router.push(
              `/checkout/success?orderNumber=${captureRes.order?.orderNumber || paypalRes.orderNumber || 'ORD-' + Date.now()}`,
            );
            return;
          } catch (paypalErr: any) {
            console.error('PayPal checkout error:', paypalErr);
            toast.error(
              paypalErr.response?.data?.message ||
                paypalErr.message ||
                'PayPal checkout failed. Please try again.',
            );
            stopLoading();
            return;
          }
        }

        // Fallback: Direct Card Processing
        const result = await processDirectCheckout({
          customerName: contactData.name,
          customerEmail: contactData.email,
          customerPhone: contactData.phone,
          shippingAddress,
          items: cartItemsPayload,
          couponCode: appliedDiscount?.code,
          giftCardCode: appliedGiftCard?.code,
          cartToken,
          paymentMethod: 'CREDIT_CARD',
          shippingMethod: deliverySpeed,
          shippingFee: deliveryFee,
        });

        await clearCart();
        const orderNum =
          result.order?.orderNumber || `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
        router.push(`/checkout/success?orderNumber=${orderNum}`);
        return;
      }

      // 2. Cash on Delivery
      if (paymentMethod === 'COD') {
        const result = await processDirectCheckout({
          customerName: contactData.name,
          customerEmail: contactData.email,
          customerPhone: contactData.phone,
          shippingAddress,
          items: cartItemsPayload,
          couponCode: appliedDiscount?.code,
          giftCardCode: appliedGiftCard?.code,
          cartToken,
          paymentMethod: 'COD',
          shippingMethod: deliverySpeed,
          shippingFee: deliveryFee,
        });

        await clearCart();
        const orderNum =
          result.order?.orderNumber || `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
        router.push(`/checkout/success?orderNumber=${orderNum}`);
        return;
      }
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
      case 'UPI':
        return 'UPI / Instant Pay';
      case 'COD':
        return 'Cash on Delivery';
      default:
        return 'Credit or debit card';
    }
  };

  if (isAuthLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-white flex flex-col font-sans">
        <header className="sticky top-0 z-30 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-sm font-semibold hover:opacity-75 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Cart</span>
            </Link>
            <div className="font-extrabold text-xl tracking-tight">
              <span>{storeName}</span>
            </div>
            <div className="w-24 text-right" />
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="p-8 max-w-md w-full rounded-3xl shadow-xl border text-center flex flex-col items-center gap-4 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
            <div className="w-12 h-12 rounded-full border-4 border-neutral-300 dark:border-neutral-700 border-t-black dark:border-t-white animate-spin" />
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              {isAuthLoading ? 'Verifying Account...' : 'Sign In Required to Checkout'}
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {isAuthLoading
                ? 'Please wait while we verify your login session...'
                : 'You must be signed in to purchase products and complete payment. Redirecting to login...'}
            </p>
            {!isAuthLoading && !isAuthenticated && (
              <Link
                href="/auth/login?redirect=/checkout"
                className="mt-3 w-full py-3.5 rounded-xl font-bold text-sm text-white bg-black dark:bg-white dark:text-black hover:opacity-90 transition block"
              >
                Sign In to Continue Purchase
              </Link>
            )}
          </div>
        </main>
      </div>
    );
  }

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
            {/* 1. Delivery Details Card (Display All Stored Addresses & Add Address) */}
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl font-bold tracking-tight">Delivery details</h2>
                  {addresses && addresses.length > 0 && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                      {addresses.length} saved
                    </span>
                  )}
                </div>

                {/* Add New Address Button */}
                <button
                  type="button"
                  onClick={handleOpenAddAddress}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add address</span>
                </button>
              </div>

              {/* Stored Addresses List */}
              <div className="space-y-3 pt-1">
                {addresses && addresses.length > 0 ? (
                  addresses.map((addr, idx) => {
                    const isSelected = selectedAddressId ? addr.id === selectedAddressId : idx === 0;
                    const isOffice = addr.label?.toUpperCase() === 'OFFICE';
                    const isHome = addr.label?.toUpperCase() === 'HOME';

                    return (
                      <div
                        key={addr.id || idx}
                        onClick={() => handleSelectAddress(addr)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                          isSelected
                            ? 'border-neutral-900 dark:border-white bg-neutral-50/90 dark:bg-neutral-800/80 shadow-xs ring-1 ring-neutral-900 dark:ring-white'
                            : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900'
                        }`}
                      >
                        <div className="flex items-start gap-3.5 min-w-0">
                          {/* Radio Dot */}
                          <div className="mt-1 shrink-0">
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                                isSelected
                                  ? 'border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white'
                                  : 'border-neutral-300 dark:border-neutral-600'
                              }`}
                            >
                              {isSelected && (
                                <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-neutral-900" />
                              )}
                            </div>
                          </div>

                          {/* Icon */}
                          <div
                            className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                              isSelected
                                ? 'bg-neutral-200/80 dark:bg-neutral-700 text-neutral-900 dark:text-white'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                            }`}
                          >
                            {isOffice ? (
                              <Building2 className="w-4 h-4" />
                            ) : isHome ? (
                              <Home className="w-4 h-4" />
                            ) : (
                              <MapPin className="w-4 h-4" />
                            )}
                          </div>

                          {/* Details */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm text-neutral-900 dark:text-white">
                                {addr.label || 'Address'}
                              </span>
                              {addr.isDefault && (
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="font-medium text-xs text-neutral-900 dark:text-neutral-100 mt-1 break-words">
                              {addr.street}
                            </div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                              {addr.city}
                              {addr.state ? `, ${addr.state}` : ''} {addr.zip}
                              {addr.country ? `, ${addr.country}` : ''}
                            </div>
                            {(addr.name || addr.phone) && (
                              <div className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1">
                                {addr.name}
                                {addr.name && addr.phone ? ' • ' : ''}
                                {addr.phone}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditAddress(addr);
                            }}
                            className="text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-neutral-200/70 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition cursor-pointer"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  /* Single Address Fallback */
                  <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex items-start justify-between gap-4">
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
                      type="button"
                      onClick={handleOpenAddAddress}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
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
                    <span className="font-bold text-sm text-neutral-900 dark:text-white">
                      +$1.99
                    </span>
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

            {/* 3. Payment Card (Inline Radio Button Selection) */}
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">Payment method</h2>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Encrypted & Secure</span>
                </span>
              </div>

              <div className="space-y-3">
                {/* 1. Credit / Debit Card & UPI (Treated as Same Online Option) - Only rendered if Razorpay or PayPal are configured in CMS */}
                {isOnlinePaymentAvailable && (
                  <div
                    onClick={() => setPaymentMethod('CARD')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                      paymentMethod === 'CARD' || paymentMethod === 'UPI'
                        ? 'border-neutral-900 dark:border-white bg-neutral-50/90 dark:bg-neutral-800/80 shadow-xs ring-1 ring-neutral-900 dark:ring-white'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      {/* Radio Dot */}
                      <div className="mt-1 shrink-0">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                            paymentMethod === 'CARD' || paymentMethod === 'UPI'
                              ? 'border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white'
                              : 'border-neutral-300 dark:border-neutral-600'
                          }`}
                        >
                          {(paymentMethod === 'CARD' || paymentMethod === 'UPI') && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-neutral-900" />
                          )}
                        </div>
                      </div>

                      {/* Icon */}
                      <div
                        className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                          paymentMethod === 'CARD' || paymentMethod === 'UPI'
                            ? 'bg-neutral-200/80 dark:bg-neutral-700 text-neutral-900 dark:text-white'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                      </div>

                      {/* Details */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-neutral-900 dark:text-white">
                            Credit or Debit Card / UPI / NetBanking
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                            Instant & Secure
                          </span>
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                          Visa, Mastercard, Amex, UPI (Google Pay, PhonePe, Paytm) & NetBanking
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Cash on Delivery (If enabled) */}
                {isCodEnabled && (
                  <div
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                      paymentMethod === 'COD'
                        ? 'border-neutral-900 dark:border-white bg-neutral-50/90 dark:bg-neutral-800/80 shadow-xs ring-1 ring-neutral-900 dark:ring-white'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      {/* Radio Dot */}
                      <div className="mt-1 shrink-0">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                            paymentMethod === 'COD'
                              ? 'border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white'
                              : 'border-neutral-300 dark:border-neutral-600'
                          }`}
                        >
                          {paymentMethod === 'COD' && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-neutral-900" />
                          )}
                        </div>
                      </div>

                      {/* Icon */}
                      <div
                        className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                          paymentMethod === 'COD'
                            ? 'bg-neutral-200/80 dark:bg-neutral-700 text-neutral-900 dark:text-white'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                        }`}
                      >
                        <DollarSign className="w-4 h-4" />
                      </div>

                      {/* Details */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-neutral-900 dark:text-white">
                            Cash on Delivery (COD)
                          </span>
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                          Pay with cash or card directly to the courier when your order arrives
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* If neither online payment nor COD is configured */}
                {!isOnlinePaymentAvailable && !isCodEnabled && (
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-sm">
                    No payment methods are currently configured for this store. Please contact support.
                  </div>
                )}
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
                            <div className="w-full h-full flex items-center justify-center text-sm">
                              🛍️
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-neutral-900 dark:text-white line-clamp-1">
                            {item.name}
                          </div>
                          <div className="text-neutral-400 mt-0.5">{formatPrice(item.price)}</div>
                        </div>

                        <div className="w-6 h-6 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-bold text-neutral-700 dark:text-neutral-300 text-xs shrink-0">
                          {item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Promotion Row */}
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
                        <span className="text-emerald-600 font-bold uppercase">
                          {appliedDiscount.code} (-{formatPrice(appliedDiscount.savings)})
                        </span>
                      ) : (
                        'Add promo code'
                      )}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </div>
              </div>

              {/* Gift Card Row */}
              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4">
                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Gift Card</span>
                  {appliedGiftCard && (
                    <button
                      type="button"
                      onClick={handleRemoveGiftCard}
                      className="text-rose-500 hover:text-rose-600 text-[11px] font-bold"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div
                  onClick={() => setShowGiftCardModal(true)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60 cursor-pointer hover:border-neutral-300 dark:hover:border-neutral-600 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Gift className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {appliedGiftCard ? (
                        <span className="text-indigo-600 font-bold">{appliedGiftCard.maskedCode} (-{formatPrice(giftCardDeduction)})</span>
                      ) : (
                        'Redeem Gift Card'
                      )}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </div>
              </div>

              {/* Order Total Breakdown (Matching Step 2 / Step 8) */}
              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4 space-y-3 text-sm">
                <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                  Order total
                </h4>

                <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {formatPrice(totalAmount)}
                  </span>
                </div>

                {appliedDiscount && (
                  <div className="flex items-center justify-between text-emerald-600 font-semibold">
                    <span>Promotion ({appliedDiscount.code})</span>
                    <span>-{formatPrice(appliedDiscount.savings)}</span>
                  </div>
                )}

                {appliedGiftCard && (
                  <div className="flex items-center justify-between text-indigo-600 font-semibold">
                    <span>Gift Card ({appliedGiftCard.maskedCode})</span>
                    <span>-{formatPrice(giftCardDeduction)}</span>
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
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600">FREE</span>
                    ) : (
                      formatPrice(deliveryFee)
                    )}
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
                        This fee helps cover delivery costs. The amount varies for each order based
                        on things like your location and courier availability.
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
                  <div>
                    <span className="text-neutral-900 dark:text-white font-extrabold block">Total</span>
                    {appliedGiftCard && (
                      <span className="text-xs text-neutral-400 font-normal">
                        Due Now: {formatPrice(finalPayableTotal)}
                      </span>
                    )}
                  </div>
                  <span className="text-2xl font-black text-black dark:text-white">
                    {formatPrice(finalPayableTotal)}
                  </span>
                </div>
              </div>

              {/* Uber Eats Disclaimers (Matching Step 2 fine print) */}
              <div className="pt-2 text-[11px] text-neutral-400 dark:text-neutral-500 space-y-1.5 leading-relaxed">
                <p>Prices may be lower in store.</p>
                <p>
                  If you're not around when the delivery person arrives, they'll leave your order at
                  the door. By placing your order, you agree to take full responsibility for it once
                  it's delivered.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════════════════════════
          INTERACTIVE MODALS MATCHING UBER EATS REFERO.DESIGN
         ══════════════════════════════════════════════════════════════════════════ */}

      {/* 1. Add / Edit Address Modal */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">
                  {editingAddress ? 'Edit delivery address' : 'Add new address'}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Enter delivery details to ensure accurate shipment and order updates
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddAddressModal(false);
                  setEditingAddress(null);
                }}
                className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4 text-xs">
              {/* Address Label Selector */}
              <div>
                <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                  Address Type / Label
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'HOME', label: 'Home', icon: Home },
                    { id: 'OFFICE', label: 'Office', icon: Building2 },
                    { id: 'OTHER', label: 'Other', icon: MapPin },
                  ].map((type) => {
                    const IconComp = type.icon;
                    const isActive = newAddressForm.label?.toUpperCase() === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setNewAddressForm({ ...newAddressForm, label: type.id })}
                        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                          isActive
                            ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black'
                            : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        <IconComp className="w-3.5 h-3.5" />
                        <span>{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recipient Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={newAddressForm.name}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-medium outline-hidden focus:border-black dark:focus:border-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +1 555-0199"
                    value={newAddressForm.phone}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-medium outline-hidden focus:border-black dark:focus:border-white"
                  />
                </div>
              </div>

              {/* Street Address */}
              <div>
                <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 456 Elm Street"
                  value={newAddressForm.street}
                  onChange={(e) => setNewAddressForm({ ...newAddressForm, street: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-medium outline-hidden focus:border-black dark:focus:border-white"
                />
              </div>

              {/* Apt / Suite / Unit */}
              <div>
                <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Apartment / Suite / Unit / Floor <span className="text-neutral-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apt 4B, 2nd Floor"
                  value={newAddressForm.aptSuite}
                  onChange={(e) => setNewAddressForm({ ...newAddressForm, aptSuite: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-medium outline-hidden focus:border-black dark:focus:border-white"
                />
              </div>

              {/* City, State, ZIP */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. New York"
                    value={newAddressForm.city}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-medium outline-hidden focus:border-black dark:focus:border-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                    State / Region
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. NY"
                    value={newAddressForm.state}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-medium outline-hidden focus:border-black dark:focus:border-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                    ZIP / Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10001"
                    value={newAddressForm.zip}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, zip: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-medium outline-hidden focus:border-black dark:focus:border-white"
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. United States or India"
                  value={newAddressForm.country}
                  onChange={(e) => setNewAddressForm({ ...newAddressForm, country: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-medium outline-hidden focus:border-black dark:focus:border-white"
                />
              </div>

              {/* Set as default checkbox */}
              <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={newAddressForm.isDefault}
                  onChange={(e) =>
                    setNewAddressForm({ ...newAddressForm, isDefault: e.target.checked })
                  }
                  className="w-4 h-4 rounded-md accent-black dark:accent-white cursor-pointer"
                />
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Set as default delivery address
                </span>
              </label>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddAddressModal(false);
                    setEditingAddress(null);
                  }}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingAddress}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition cursor-pointer disabled:opacity-50"
                >
                  {isSavingAddress
                    ? 'Saving...'
                    : editingAddress
                    ? 'Update address'
                    : 'Save & select address'}
                </button>
              </div>
            </form>
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
                  <div className="text-[11px] text-neutral-400">
                    {day.split(' ').slice(1).join(' ')}
                  </div>
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
                <div className="text-xs text-neutral-500 mt-0.5">
                  With store membership benefits
                </div>
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

      {/* Gift Card Modal */}
      {showGiftCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                  <Gift className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-bold">Gift Card</h3>
              </div>
              <button
                onClick={() => setShowGiftCardModal(false)}
                className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Gift Card Code Input */}
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Gift className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="GC-XXXX-XXXX-XXXX"
                  value={giftCardCodeInput}
                  onChange={(e) => setGiftCardCodeInput(e.target.value.toUpperCase())}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono font-bold uppercase text-xs outline-hidden"
                />
              </div>
              <button
                onClick={() => handleApplyGiftCardCode(giftCardCodeInput)}
                disabled={isValidatingGiftCard || !giftCardCodeInput.trim()}
                className="px-6 py-3 rounded-2xl font-bold text-xs bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-40 transition cursor-pointer"
              >
                {isValidatingGiftCard ? 'Checking...' : 'Apply'}
              </button>
            </div>

            {giftCardError && <p className="text-xs text-rose-500 mb-4">{giftCardError}</p>}

            {/* Active Gift Card Banner */}
            {appliedGiftCard ? (
              <div className="p-4 rounded-2xl bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-900/40 flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-violet-700 dark:text-violet-300 text-sm">
                      {appliedGiftCard.code}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-violet-200 dark:bg-violet-900 text-violet-800 dark:text-violet-200">
                      Balance: {formatPrice(appliedGiftCard.balance)}
                    </span>
                  </div>
                  <div className="text-xs text-violet-600 dark:text-violet-400 mt-1">
                    Applying {formatPrice(giftCardDeduction)} deduction towards this order
                  </div>
                </div>
                <button
                  onClick={handleRemoveGiftCard}
                  className="text-xs font-bold text-rose-500 hover:text-rose-600 transition"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="text-center py-6 text-neutral-400">
                <div className="w-14 h-14 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-2 text-2xl">
                  🎁
                </div>
                <p className="text-xs font-medium">Enter your 16-character gift card code above to redeem its balance.</p>
              </div>
            )}

            <button
              onClick={() => setShowGiftCardModal(false)}
              className="w-full py-3.5 rounded-2xl font-bold text-sm bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition cursor-pointer"
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
                    {taxName} ({taxRate}%)
                  </div>
                  <div className="text-neutral-500 mt-1 leading-relaxed">
                    {isTaxInclusive
                      ? `Taxes (${taxRate}%) are already included in the catalog price.`
                      : `Calculated standard ${taxName} at ${taxRate}% on the order subtotal.`}
                  </div>
                </div>
                <span className="font-bold text-sm ml-4">
                  {isTaxInclusive ? 'Included' : formatPrice(calculatedTax)}
                </span>
              </div>

              {otherFees > 0 && (
                <div className="flex justify-between items-start pt-3 border-t border-neutral-100 dark:border-neutral-800">
                  <div>
                    <div className="font-bold text-neutral-900 dark:text-white text-sm">
                      Cash on Delivery Handling Fee
                    </div>
                    <div className="text-neutral-500 mt-1">
                      Handling and collection fee configured for COD orders.
                    </div>
                  </div>
                  <span className="font-bold text-sm ml-4">{formatPrice(otherFees)}</span>
                </div>
              )}

              {calculatedTax === 0 && otherFees === 0 && isTaxInclusive && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-medium">
                  ✓ All prices are inclusive of taxes. No additional fees are added at checkout.
                </div>
              )}
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

      {/* 6. Card Error Submodal */}
      {showCardErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-slide-up text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-500 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-1">Payment failed</h3>
            <p className="text-xs text-neutral-500 mb-6">
              Please check your payment details or choose another payment method and try again.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => setShowCardErrorModal(false)}
                className="w-full py-3 rounded-xl font-bold text-xs bg-black text-white hover:bg-neutral-800 transition cursor-pointer"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
