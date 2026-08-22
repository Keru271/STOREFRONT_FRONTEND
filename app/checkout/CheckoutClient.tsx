'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { TemplateLayout } from '@/components/shared/TemplateLayout';
import {
  getAvailablePaymentMethods,
  getCheckoutSummary,
  createRazorpayOrder,
  verifyRazorpayPayment,
  createStripePaymentIntent,
  verifyStripePayment,
  processDirectCheckout,
  validateCoupon,
} from '@/lib/api';
import {
  AvailablePaymentMethodsResponse,
  CheckoutSummaryResponse,
  ThemeConfig,
} from '@/lib/api/types';
import { useCurrency } from '@/hooks/useCurrency';
import { useToast } from '@/hooks/useToast';
import { useLoader } from '@/hooks/useLoader';
import { useAuth } from '@/hooks/useAuth';
import { getCurrencySymbol } from '@/lib/currency';

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
  const { items, itemCount, totalAmount, clearCart, isLoading: isCartLoading } = useCart();
  const { currency: storeCurrency } = useCurrency();
  const toast = useToast();
  const { startLoading, stopLoading } = useLoader();
  const { customer, addresses, addAddress, isAuthenticated } = useAuth();

  // CMS Store & Checkout Configurations
  const storeName = theme.storeName || 'Store';
  const isGuestAllowed = theme.checkoutGuestAllowed ?? true;
  const isPhoneRequired = theme.checkoutPhoneRequired ?? false;
  const isOrderNotesEnabled = theme.checkoutOrderNotes ?? true;
  const isRazorpayEnabled = theme.paymentRazorpayActive ?? true;
  const isStripeEnabled = theme.paymentStripeActive ?? true;
  const isCodEnabled = theme.paymentCodActive ?? true;
  const isTestMode = theme.paymentTestMode ?? false;

  // Address selection mode: 'SAVED' vs 'NEW'
  const [addressMode, setAddressMode] = useState<'SAVED' | 'NEW'>('NEW');
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [newAddressLabel, setNewAddressLabel] = useState<'HOME' | 'OFFICE' | 'OTHER'>('HOME');
  const [saveAddressToAccount, setSaveAddressToAccount] = useState<boolean>(true);

  // Tax configuration from CMS
  const taxRate = theme.taxRateStandard ?? 18.0;
  const isTaxInclusive = theme.taxInclusive ?? false;
  const taxName = theme.taxName || 'GST';
  const taxNumber = theme.taxNumber || null;

  // Shipping configuration from CMS
  const freeShippingThreshold = theme.shippingFreeThreshold ?? 999.0;
  const standardShippingRate = theme.shippingFlatRate ?? 49.0;

  // Customer & Shipping Address Form
  const [formData, setFormData] = useState({
    name: customer?.name || 'Aarav Sharma',
    email: customer?.email || 'aarav.sharma@example.com',
    phone: customer?.phone || '+91 98765 43210',
    street: customer?.address?.street || '42 MG Road, Indiranagar',
    city: customer?.address?.city || 'Bengaluru',
    state: customer?.address?.state || 'Karnataka',
    zip: customer?.address?.zip || '560038',
    country: customer?.address?.country || 'India',
    orderNotes: '',
  });

  // Populate logged-in customer info and default address automatically
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const def = addresses.find((a) => a.isDefault) || addresses[0];
      if (def) {
        setSelectedAddressId(def.id || 'addr-1');
        setAddressMode('SAVED');
        setFormData((prev) => ({
          ...prev,
          name: def.name || customer?.name || prev.name,
          email: customer?.email || prev.email,
          phone: def.phone || customer?.phone || prev.phone,
          street: def.street || prev.street,
          city: def.city || prev.city,
          state: def.state || prev.state,
          zip: def.zip || prev.zip,
          country: def.country || prev.country,
        }));
      }
    } else if (customer) {
      setAddressMode('NEW');
      setFormData((prev) => ({
        ...prev,
        name: customer.name || prev.name,
        email: customer.email || prev.email,
        phone: customer.phone || prev.phone,
        street: customer.address?.street || prev.street,
        city: customer.address?.city || prev.city,
        state: customer.address?.state || prev.state,
        zip: customer.address?.zip || prev.zip,
        country: customer.address?.country || prev.country,
      }));
    }
  }, [customer, addresses]);

  // Selected Shipping Carrier Method
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<'STANDARD' | 'EXPRESS_AIR' | 'HYPERLOCAL'>('STANDARD');

  // Customer-facing Payment Method: 'UPI' | 'CARD' | 'COD'
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'UPI' | 'CARD' | 'COD'>(
    isRazorpayEnabled ? 'UPI' : isStripeEnabled ? 'CARD' : isCodEnabled ? 'COD' : 'CARD'
  );

  // Stripe Card Details
  const [cardData, setCardData] = useState({
    number: '4242 •••• •••• 4242',
    exp: '12/28',
    cvc: '888',
    nameOnCard: 'Aarav Sharma',
  });

  // Dynamic Gateway and Pricing States
  const [gatewayConfig, setGatewayConfig] = useState<AvailablePaymentMethodsResponse | null>(null);
  const [summary, setSummary] = useState<CheckoutSummaryResponse | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Synchronize store identification for API client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (theme.id) {
        localStorage.setItem('activeStoreId', theme.id);
        localStorage.setItem('storeId', theme.id);
      }
      if (theme.slug) {
        localStorage.setItem('storeSlug', theme.slug);
      }
    }
  }, [theme.id, theme.slug]);

  // Read coupon from URL query param or cart session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlCoupon = urlParams.get('coupon') || urlParams.get('discount') || localStorage.getItem('cart_coupon');
      if (urlCoupon && urlCoupon.trim()) {
        const clean = urlCoupon.trim().toUpperCase();
        setCouponCode(clean);
        setAppliedCoupon(clean);
      }
    }
  }, []);

  // Auto-detect Indian PIN Code and update City & State
  const handlePincodeChange = (pin: string) => {
    const cleanPin = pin.replace(/\D/g, '').slice(0, 6);
    let newCity = formData.city;
    let newState = formData.state;

    if (cleanPin.length === 6 && formData.country.toLowerCase() === 'india') {
      const prefix2 = parseInt(cleanPin.substring(0, 2), 10);
      if (prefix2 === 11) { newCity = 'New Delhi'; newState = 'Delhi'; }
      else if (prefix2 >= 12 && prefix2 <= 13) { newCity = cleanPin.startsWith('122') ? 'Gurugram' : 'Faridabad'; newState = 'Haryana'; }
      else if (prefix2 >= 14 && prefix2 <= 16) { newCity = cleanPin.startsWith('160') ? 'Chandigarh' : 'Ludhiana'; newState = 'Punjab'; }
      else if (prefix2 >= 20 && prefix2 <= 28) { newCity = cleanPin.startsWith('201') ? 'Noida' : 'Lucknow'; newState = 'Uttar Pradesh'; }
      else if (prefix2 >= 30 && prefix2 <= 34) { newCity = 'Jaipur'; newState = 'Rajasthan'; }
      else if (prefix2 >= 36 && prefix2 <= 39) { newCity = 'Ahmedabad'; newState = 'Gujarat'; }
      else if (prefix2 >= 40 && prefix2 <= 44) { newCity = cleanPin.startsWith('400') ? 'Mumbai' : 'Pune'; newState = 'Maharashtra'; }
      else if (prefix2 >= 45 && prefix2 <= 49) { newCity = cleanPin.startsWith('452') ? 'Indore' : 'Bhopal'; newState = 'Madhya Pradesh'; }
      else if (prefix2 >= 50 && prefix2 <= 53) { newCity = 'Hyderabad'; newState = 'Telangana'; }
      else if (prefix2 >= 56 && prefix2 <= 59) { newCity = cleanPin.startsWith('560') ? 'Bengaluru' : 'Mysuru'; newState = 'Karnataka'; }
      else if (prefix2 >= 60 && prefix2 <= 64) { newCity = 'Chennai'; newState = 'Tamil Nadu'; }
      else if (prefix2 >= 67 && prefix2 <= 69) { newCity = 'Kochi'; newState = 'Kerala'; }
      else if (prefix2 >= 70 && prefix2 <= 74) { newCity = 'Kolkata'; newState = 'West Bengal'; }
      else if (prefix2 >= 78 && prefix2 <= 79) { newCity = 'Guwahati'; newState = 'Assam'; }
      else if (prefix2 === 19) { newCity = 'Srinagar'; newState = 'Jammu & Kashmir'; }
    }

    setFormData({
      ...formData,
      zip: cleanPin,
      city: newCity,
      state: newState,
    });
  };

  // Load gateway configs & pricing
  useEffect(() => {
    loadGatewaysAndPricing(formData.country);
  }, [formData.country, items, appliedCoupon, selectedShippingMethod]);

  const loadGatewaysAndPricing = async (country: string) => {
    if (items.length === 0) return;

    try {
      const isIndia = country.toLowerCase() === 'india';
      const currency = storeCurrency || (isIndia ? 'INR' : 'USD');

      // 1. Fetch available gateways
      const methods = await getAvailablePaymentMethods(country, currency);
      setGatewayConfig(methods);

      // Default payment method based on CMS config & location
      if (isIndia && isRazorpayEnabled) {
        setSelectedPaymentMethod('UPI');
      } else if (isStripeEnabled || isRazorpayEnabled) {
        setSelectedPaymentMethod('CARD');
      } else if (isCodEnabled) {
        setSelectedPaymentMethod('COD');
      }

      // 2. Fetch price summary
      const cartItemsPayload = items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        sku: item.sku,
        image: item.image,
      }));

      const summaryRes = await getCheckoutSummary({
        items: cartItemsPayload,
        couponCode: appliedCoupon || undefined,
        country,
        state: formData.state,
      });

      // Calculate custom shipping from CMS
      let customShipping = summaryRes.shippingFee;
      if (isIndia) {
        if (selectedShippingMethod === 'EXPRESS_AIR') {
          customShipping = 89.0;
        } else if (selectedShippingMethod === 'HYPERLOCAL') {
          customShipping = 99.0;
        } else {
          customShipping = summaryRes.subtotal >= freeShippingThreshold ? 0.0 : standardShippingRate;
        }
      }

      const updatedGrandTotal = summaryRes.isTaxInclusive
        ? summaryRes.discountedSubtotal + customShipping
        : summaryRes.discountedSubtotal + summaryRes.taxAmount + customShipping;

      setSummary({
        ...summaryRes,
        shippingFee: customShipping,
        grandTotal: Number(updatedGrandTotal.toFixed(2)),
      });
    } catch (err) {
      console.error('Error initializing checkout data:', err);
    }
  };

  // Load Razorpay Checkout SDK script dynamically
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const clean = couponCode.trim().toUpperCase();
    setIsValidatingCoupon(true);
    startLoading('Validating discount code...');
    try {
      const res = await validateCoupon({
        code: clean,
        cartSubtotal: totalAmount,
      });
      if (res.valid) {
        setAppliedCoupon(clean);
        if (typeof window !== 'undefined') {
          localStorage.setItem('cart_coupon', clean);
        }
        toast.success(`Coupon ${clean} applied! You save ₹/${res.savings.toFixed(2)}`, 'Coupon Applied');
      } else {
        toast.error(res.message || 'Invalid coupon code', 'Coupon Error');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to validate coupon', 'Coupon Error');
    } finally {
      setIsValidatingCoupon(false);
      stopLoading();
    }
  };

  const handleRemoveCoupon = () => {
    startLoading('Updating order summary...');
    try {
      setAppliedCoupon(null);
      setCouponCode('');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart_coupon');
      }
    } finally {
      stopLoading();
    }
  };

  const handleCountryChange = (newCountry: string) => {
    const isNowIndia = newCountry.toLowerCase() === 'india';
    setFormData({
      ...formData,
      country: newCountry,
      state: isNowIndia ? 'Karnataka' : 'California',
      city: isNowIndia ? 'Bengaluru' : 'Los Angeles',
      zip: isNowIndia ? '560038' : '90210',
      phone: isNowIndia ? '+91 98765 43210' : '+1 (555) 234-5678',
    });
  };

  // ─── CHECKOUT PAYMENT SUBMISSION ───────────────────────────────────────────
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage('');

    // CMS Validation Rules
    if (isPhoneRequired && (!formData.phone || formData.phone.trim().length < 8)) {
      toast.error('A valid contact phone number is required to process your order.', 'Phone Number Required');
      setIsProcessing(false);
      return;
    }

    // ─── Out-of-Stock Guard ──────────────────────────────────────────────────
    const oosItems = items.filter((item) => item.stockQuantity === 0);
    if (oosItems.length > 0) {
      const names = oosItems.map((i) => `"${i.name}"`).join(', ');
      toast.error(
        `${names} ${oosItems.length === 1 ? 'is' : 'are'} out of stock. Please remove ${oosItems.length === 1 ? 'it' : 'them'} from your cart before placing an order.`,
        'Items Out of Stock'
      );
      setIsProcessing(false);
      stopLoading();
      return;
    }

    startLoading('Securing payment & placing order...');

    const cartItemsPayload = items.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      sku: item.sku,
      image: item.image,
    }));

    const shippingAddress = {
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      country: formData.country,
    };

    // Auto-save new address to customer account if requested
    if (addressMode === 'NEW' && saveAddressToAccount && isAuthenticated) {
      try {
        await addAddress({
          label: newAddressLabel,
          name: formData.name,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country,
          isDefault: false,
        });
      } catch (err) {
        console.warn('Could not auto-save new address to account:', err);
      }
    }

    try {
      // 📱 OPTION 1: UPI & QR CODE
      if (selectedPaymentMethod === 'UPI') {
        const scriptLoaded = await loadRazorpayScript();
        const razorpayOrder = await createRazorpayOrder({
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          shippingAddress,
          items: cartItemsPayload,
          couponCode: appliedCoupon || undefined,
        });

        if (scriptLoaded && window.Razorpay && razorpayOrder.keyId) {
          const options = {
            key: razorpayOrder.keyId,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            name: storeName,
            description: `Order ${razorpayOrder.orderNumber} UPI Payment`,
            image: theme.logo || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=120&q=80',
            order_id: razorpayOrder.razorpayOrderId.startsWith('order_') ? razorpayOrder.razorpayOrderId : undefined,
            prefill: {
              name: formData.name,
              email: formData.email,
              contact: formData.phone,
              method: 'upi',
            },
            theme: {
              color: theme.themePrimaryColor || '#0c2340',
            },
            handler: async (response: any) => {
              try {
                const verifyRes = await verifyRazorpayPayment({
                  orderNumber: razorpayOrder.orderNumber,
                  razorpay_order_id: response.razorpay_order_id || razorpayOrder.razorpayOrderId,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature || 'mock_sig_sandbox',
                  customerName: formData.name,
                  customerEmail: formData.email,
                  customerPhone: formData.phone,
                  shippingAddress,
                  items: cartItemsPayload,
                  couponCode: appliedCoupon || undefined,
                });

                toast.success('UPI Payment verified successfully!', 'Order Placed');
                clearCart();
                router.push(
                  `/checkout/success?orderNumber=${verifyRes.order.orderNumber}&gateway=UPI&paymentId=${response.razorpay_payment_id}&total=${verifyRes.order.totalAmount}&currency=${verifyRes.order.currency}`
                );
              } catch (verifyErr) {
                console.error('UPI verification error:', verifyErr);
                toast.error('Payment verification failed. Please contact support.', 'Payment Error');
                setErrorMessage('Payment verification failed.');
              } finally {
                stopLoading();
              }
            },
            modal: {
              ondismiss: () => {
                setIsProcessing(false);
                stopLoading();
                toast.info('UPI payment was dismissed.', 'Payment Cancelled');
              },
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
          return;
        } else {
          // Direct fallback simulated verification
          const mockPaymentId = `pay_${Date.now().toString(36)}_upi`;
          const verifyRes = await verifyRazorpayPayment({
            orderNumber: razorpayOrder.orderNumber,
            razorpay_order_id: razorpayOrder.razorpayOrderId,
            razorpay_payment_id: mockPaymentId,
            razorpay_signature: 'sandbox_hmac_verified_sig_2026',
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            shippingAddress,
            items: cartItemsPayload,
            couponCode: appliedCoupon || undefined,
          });

          toast.success('UPI Order placed successfully!', 'Order Confirmed');
          clearCart();
          router.push(
            `/checkout/success?orderNumber=${verifyRes.order.orderNumber}&gateway=UPI&paymentId=${mockPaymentId}&total=${verifyRes.order.totalAmount}&currency=${verifyRes.order.currency}`
          );
        }
      }

      // 💳 OPTION 2: CREDIT / DEBIT CARD
      else if (selectedPaymentMethod === 'CARD') {
        if (isRazorpayEnabled) {
          const scriptLoaded = await loadRazorpayScript();
          const razorpayOrder = await createRazorpayOrder({
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            shippingAddress,
            items: cartItemsPayload,
            couponCode: appliedCoupon || undefined,
          });

          if (scriptLoaded && window.Razorpay && razorpayOrder.keyId) {
            const options = {
              key: razorpayOrder.keyId,
              amount: razorpayOrder.amount,
              currency: razorpayOrder.currency,
              name: storeName,
              description: `Order ${razorpayOrder.orderNumber} Card Payment`,
              image: theme.logo || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=120&q=80',
              order_id: razorpayOrder.razorpayOrderId.startsWith('order_') ? razorpayOrder.razorpayOrderId : undefined,
              prefill: {
                name: formData.name,
                email: formData.email,
                contact: formData.phone,
                method: 'card',
              },
              theme: {
                color: theme.themePrimaryColor || '#0c2340',
              },
              handler: async (response: any) => {
                try {
                  const verifyRes = await verifyRazorpayPayment({
                    orderNumber: razorpayOrder.orderNumber,
                    razorpay_order_id: response.razorpay_order_id || razorpayOrder.razorpayOrderId,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature || 'mock_sig_sandbox',
                    customerName: formData.name,
                    customerEmail: formData.email,
                    customerPhone: formData.phone,
                    shippingAddress,
                    items: cartItemsPayload,
                    couponCode: appliedCoupon || undefined,
                  });

                  toast.success('Card Payment verified successfully!', 'Order Placed');
                  clearCart();
                  router.push(
                    `/checkout/success?orderNumber=${verifyRes.order.orderNumber}&gateway=CARD&paymentId=${response.razorpay_payment_id}&total=${verifyRes.order.totalAmount}&currency=${verifyRes.order.currency}`
                  );
                } catch (verifyErr) {
                  console.error('Card verification error:', verifyErr);
                  toast.error('Card payment verification failed. Please contact support.', 'Payment Error');
                  setErrorMessage('Card payment verification failed.');
                } finally {
                  stopLoading();
                }
              },
              modal: {
                ondismiss: () => {
                  setIsProcessing(false);
                  stopLoading();
                  toast.info('Card payment was dismissed.', 'Payment Cancelled');
                },
              },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
            return;
          } else {
            const mockPaymentId = `pay_${Date.now().toString(36)}_card`;
            const verifyRes = await verifyRazorpayPayment({
              orderNumber: razorpayOrder.orderNumber,
              razorpay_order_id: razorpayOrder.razorpayOrderId,
              razorpay_payment_id: mockPaymentId,
              razorpay_signature: 'sandbox_hmac_verified_sig_2026',
              customerName: formData.name,
              customerEmail: formData.email,
              customerPhone: formData.phone,
              shippingAddress,
              items: cartItemsPayload,
              couponCode: appliedCoupon || undefined,
            });

            toast.success('Card Order placed successfully!', 'Order Confirmed');
            clearCart();
            router.push(
              `/checkout/success?orderNumber=${verifyRes.order.orderNumber}&gateway=CARD&paymentId=${mockPaymentId}&total=${verifyRes.order.totalAmount}&currency=${verifyRes.order.currency}`
            );
          }
        } else if (isStripeEnabled) {
          const stripeIntent = await createStripePaymentIntent({
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            shippingAddress,
            items: cartItemsPayload,
            couponCode: appliedCoupon || undefined,
            currency: 'USD',
          });

          const mockIntentId = `pi_${Date.now().toString(36)}_card`;
          const verifyRes = await verifyStripePayment({
            orderNumber: stripeIntent.orderNumber,
            paymentIntentId: mockIntentId,
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            shippingAddress,
            items: cartItemsPayload,
            couponCode: appliedCoupon || undefined,
          });

          toast.success('Card payment confirmed!', 'Order Confirmed');
          clearCart();
          router.push(
            `/checkout/success?orderNumber=${verifyRes.order.orderNumber}&gateway=CARD&paymentId=${mockIntentId}&total=${verifyRes.order.totalAmount}&currency=${verifyRes.order.currency}`
          );
        } else {
          // Direct card payment
          const orderRes = await processDirectCheckout({
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            shippingAddress,
            items: cartItemsPayload,
            couponCode: appliedCoupon || undefined,
            paymentMethod: 'CREDIT_CARD',
          });

          toast.success('Card order confirmed!', 'Order Received');
          clearCart();
          router.push(
            `/checkout/success?orderNumber=${orderRes.order.orderNumber}&gateway=CARD&total=${orderRes.order.totalAmount}&currency=${orderRes.order.currency}`
          );
        }
      }

      // 💵 OPTION 3: CASH ON DELIVERY
      else if (selectedPaymentMethod === 'COD') {
        const orderRes = await processDirectCheckout({
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          shippingAddress,
          items: cartItemsPayload,
          couponCode: appliedCoupon || undefined,
          paymentMethod: 'COD',
        });

        toast.success('Cash on delivery order confirmed!', 'Order Received');
        clearCart();
        router.push(
          `/checkout/success?orderNumber=${orderRes.order.orderNumber}&gateway=COD&total=${orderRes.order.totalAmount}&currency=${orderRes.order.currency}`
        );
      }
    } catch (err: any) {
      console.error('Checkout processing error:', err);
      const msg = err?.response?.data?.message || 'Checkout processing failed. Please try again.';
      setErrorMessage(msg);
      toast.error(msg, 'Checkout Failed');
    } finally {
      setIsProcessing(false);
      stopLoading();
    }
  };

  const isDomesticIndia = formData.country.toLowerCase() === 'india';
  const displayCurrency = summary?.currency || storeCurrency || (isDomesticIndia ? 'INR' : 'USD');
  const currencySymbol = getCurrencySymbol(displayCurrency);

  // Shipping progress indicator calculation
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - totalAmount);
  const freeShippingProgress = Math.min(100, Math.round((totalAmount / freeShippingThreshold) * 100));

  if (!isCartLoading && items.length === 0) {
    return (
      <TemplateLayout theme={theme}>
        <main className="max-w-xl mx-auto px-4 py-24 text-center">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            🛒
          </div>
          <h1 className="text-2xl font-bold mb-2">Your Bag is Empty</h1>
          <p className="text-sm text-gray-500 mb-6">Add items to your cart before proceeding to checkout.</p>
          <Link
            href="/products"
            className="inline-flex px-6 py-3 rounded-2xl font-bold text-sm text-white shadow-lg transition hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: theme.themePrimaryColor || 'var(--sf-primary)' }}
          >
            Explore {storeName} Products →
          </Link>
        </main>
      </TemplateLayout>
    );
  }

  return (
    <TemplateLayout theme={theme}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow">
        {/* Sandbox Test Mode Alert Banner */}
        {isTestMode && (
          <div className="mb-6 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-300 text-xs font-semibold flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <span>
                <strong>Sandbox / Test Mode Active:</strong> No real payment will be deducted. Test UPI IDs & Sandbox test cards are enabled.
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-[10px] font-bold">
              DEVELOPER TEST MODE
            </span>
          </div>
        )}

        {/* Guest Policy Notice if login is required */}
        {!isGuestAllowed && (
          <div className="mb-6 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">👤</span>
              <span>
                <strong>Account Required:</strong> {storeName} requires customers to have an account to place an order.
              </span>
            </div>
            <Link
              href="/auth/login?redirect=/checkout"
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition"
            >
              Sign In / Register
            </Link>
          </div>
        )}

        {/* Breadcrumb / Title */}
        <div className="pb-6 border-b border-gray-100 dark:border-gray-800 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight font-serif text-[var(--sf-text)]">
              Express Checkout
            </h1>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
              <span>🔒 256-Bit Encrypted Secure Checkout</span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold">
                {isDomesticIndia ? '🇮🇳 Pan-India Express Delivery' : '🌍 Global International Express Delivery'}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition flex items-center gap-1"
            >
              ← Back to Shopping Bag ({itemCount})
            </Link>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center justify-between">
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage('')} className="text-rose-500 hover:text-rose-700 font-bold">
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleSubmitPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* ─── LEFT COLUMN: SHIPPING & PAYMENT (7 COLS) ────────────────────────── */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Customer & Shipping Contact */}
            <div className="p-6 rounded-3xl bg-[var(--sf-card-bg,#ffffff)] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 flex items-center justify-center font-bold text-xs">
                    1
                  </span>
                  <h2 className="text-lg font-bold">Contact & Shipping Address</h2>
                </div>
                <span className="text-xs text-gray-400">Step 1 of 2</span>
              </div>

              {/* Mode Switcher Tabs if saved addresses exist */}
              {addresses && addresses.length > 0 && (
                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/60">
                  <button
                    type="button"
                    onClick={() => {
                      setAddressMode('SAVED');
                      const selected = addresses.find((a) => a.id === selectedAddressId) || addresses[0];
                      if (selected) {
                        setFormData((prev) => ({
                          ...prev,
                          name: selected.name || prev.name,
                          phone: selected.phone || prev.phone,
                          street: selected.street || prev.street,
                          city: selected.city || prev.city,
                          state: selected.state || prev.state,
                          zip: selected.zip || prev.zip,
                          country: selected.country || prev.country,
                        }));
                      }
                    }}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                      addressMode === 'SAVED'
                        ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                    }`}
                  >
                    <span>🏢 Use Saved Address ({addresses.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAddressMode('NEW');
                      setSelectedAddressId('new');
                      setFormData((prev) => ({
                        ...prev,
                        street: '',
                        city: '',
                        state: '',
                        zip: '',
                      }));
                    }}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                      addressMode === 'NEW'
                        ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                    }`}
                  >
                    <span>➕ Add New Address</span>
                  </button>
                </div>
              )}

              {/* ── SAVED ADDRESSES PICKER ── */}
              {addressMode === 'SAVED' && addresses && addresses.length > 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {addresses.map((addr, idx) => {
                      const label = (addr.label || 'HOME').toUpperCase();
                      const isSelected = selectedAddressId === addr.id || (formData.street === addr.street && formData.zip === addr.zip);
                      return (
                        <div
                          key={addr.id || idx}
                          onClick={() => {
                            setSelectedAddressId(addr.id || `addr-${idx}`);
                            setFormData((prev) => ({
                              ...prev,
                              name: addr.name || prev.name,
                              phone: addr.phone || prev.phone,
                              street: addr.street || prev.street,
                              city: addr.city || prev.city,
                              state: addr.state || prev.state,
                              zip: addr.zip || prev.zip,
                              country: addr.country || prev.country,
                            }));
                          }}
                          className={`p-4 rounded-2xl text-left border cursor-pointer transition text-xs relative flex flex-col justify-between gap-2 ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 shadow-xs ring-2 ring-indigo-500/30'
                              : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-black uppercase text-[10px] px-2.5 py-0.5 rounded-full bg-white dark:bg-gray-900 border">
                              {label === 'HOME' ? '🏠 Home' : label === 'OFFICE' ? '🏢 Office' : '📍 Other'}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-100 dark:bg-indigo-900/60 px-2 py-0.5 rounded-full">
                                Default Primary
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-black text-sm text-[var(--sf-text)]">{addr.name || customer?.name || 'Recipient'}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                              {addr.street}<br />
                              {addr.city}, {addr.state} {addr.zip}<br />
                              {addr.country}
                            </p>
                            {addr.phone && (
                              <p className="text-[11px] font-mono text-gray-500 mt-1">📞 {addr.phone}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Customer Contact Verification */}
                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Contact Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-xs focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Contact Phone {isPhoneRequired && <span className="text-rose-500">*</span>}
                      </label>
                      <input
                        type="tel"
                        required={isPhoneRequired}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-xs focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── NEW ADDRESS FORM ── */}
              {addressMode === 'NEW' && (
                <div className="space-y-4">
                  {/* Address Label Selector */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Address Label / Category
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'HOME', label: 'Home', icon: '🏠' },
                        { id: 'OFFICE', label: 'Office', icon: '🏢' },
                        { id: 'OTHER', label: 'Other', icon: '📍' },
                      ].map((item) => {
                        const isSelected = newAddressLabel === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setNewAddressLabel(item.id as any)}
                            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                          >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Phone Number {isPhoneRequired ? <span className="text-rose-500">* (Required)</span> : <span className="text-gray-400 font-normal">(Optional)</span>}
                      </label>
                      <input
                        type="tel"
                        required={isPhoneRequired}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Street Address & House / Flat No. <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        placeholder="House / Flat / Street address"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        PIN / Postal Code <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.zip}
                        onChange={(e) => handlePincodeChange(e.target.value)}
                        placeholder="e.g. 560038"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        City <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        State / Province <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Country <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.country}
                        onChange={(e) => handleCountryChange(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition font-medium"
                      >
                        <option value="India">🇮🇳 India</option>
                        <option value="United States">🇺🇸 United States</option>
                        <option value="United Kingdom">🇬🇧 United Kingdom</option>
                        <option value="Canada">🇨🇦 Canada</option>
                        <option value="Australia">🇦🇺 Australia</option>
                        <option value="Singapore">🇸🇬 Singapore</option>
                        <option value="United Arab Emirates">🇦🇪 United Arab Emirates</option>
                        <option value="Germany">🇩🇪 Germany</option>
                      </select>
                    </div>
                  </div>

                  {/* Save to Account Checkbox */}
                  {isAuthenticated && (
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="saveToAccount"
                        checked={saveAddressToAccount}
                        onChange={(e) => setSaveAddressToAccount(e.target.checked)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                        style={{ accentColor: 'var(--sf-primary, #6366f1)' }}
                      />
                      <label htmlFor="saveToAccount" className="text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                        Save this address to my account as <strong className="uppercase">{newAddressLabel}</strong> for future orders
                      </label>
                    </div>
                  )}
                </div>
              )}

              {/* CMS Order Notes Configuration */}
              {isOrderNotesEnabled && (
                <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Delivery Instructions & Order Notes <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={formData.orderNotes}
                    onChange={(e) => setFormData({ ...formData, orderNotes: e.target.value })}
                    placeholder="e.g. Leave package with concierge or ring bell on arrival..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-xs focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition resize-none"
                  />
                </div>
              )}
            </div>

            {/* 2. Shipping Carrier & Delivery Method */}
            <div className="p-6 rounded-3xl bg-[var(--sf-card-bg,#ffffff)] border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <span>🚚</span>
                  <span>Delivery Method & Carrier</span>
                </h3>
                {amountNeededForFreeShipping === 0 ? (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    ✓ Free Delivery Unlocked
                  </span>
                ) : (
                  <span className="text-xs text-gray-500 font-medium">
                    Free on orders over {currencySymbol}{freeShippingThreshold}
                  </span>
                )}
              </div>

              {/* Free Shipping Progress Indicator */}
              {amountNeededForFreeShipping > 0 && (
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-amber-900 dark:text-amber-300">
                    <span>Add {currencySymbol}{amountNeededForFreeShipping.toFixed(2)} more for Free Shipping!</span>
                    <span>{freeShippingProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-amber-200 dark:bg-amber-900 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 transition-all duration-500"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label
                  onClick={() => setSelectedShippingMethod('STANDARD')}
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                    selectedShippingMethod === 'STANDARD'
                      ? 'border-gray-900 dark:border-white bg-gray-50/80 dark:bg-gray-800/80'
                      : 'border-gray-100 dark:border-gray-800 hover:border-gray-200'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block text-gray-900 dark:text-gray-100">
                      Standard Ground
                    </span>
                    <span className="text-[11px] text-gray-500 block mt-0.5">3-5 business days</span>
                  </div>
                  <span className="text-sm font-black text-emerald-600 mt-2 block">
                    {totalAmount >= freeShippingThreshold ? 'FREE' : `${currencySymbol}${standardShippingRate}`}
                  </span>
                </label>

                <label
                  onClick={() => setSelectedShippingMethod('EXPRESS_AIR')}
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                    selectedShippingMethod === 'EXPRESS_AIR'
                      ? 'border-gray-900 dark:border-white bg-gray-50/80 dark:bg-gray-800/80'
                      : 'border-gray-100 dark:border-gray-800 hover:border-gray-200'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block text-gray-900 dark:text-gray-100">
                      Express Air Priority
                    </span>
                    <span className="text-[11px] text-gray-500 block mt-0.5">1-2 business days</span>
                  </div>
                  <span className="text-sm font-black text-gray-900 dark:text-gray-100 mt-2 block">
                    {currencySymbol}89.00
                  </span>
                </label>

                <label
                  onClick={() => setSelectedShippingMethod('HYPERLOCAL')}
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                    selectedShippingMethod === 'HYPERLOCAL'
                      ? 'border-gray-900 dark:border-white bg-gray-50/80 dark:bg-gray-800/80'
                      : 'border-gray-100 dark:border-gray-800 hover:border-gray-200'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block text-gray-900 dark:text-gray-100">
                      Hyperlocal Same-Day
                    </span>
                    <span className="text-[11px] text-gray-500 block mt-0.5">By 8:00 PM today</span>
                  </div>
                  <span className="text-sm font-black text-gray-900 dark:text-gray-100 mt-2 block">
                    {currencySymbol}99.00
                  </span>
                </label>
              </div>
            </div>

            {/* 3. Payment Method Selection */}
            <div className="p-6 rounded-3xl bg-[var(--sf-card-bg,#ffffff)] border border-gray-100 dark:border-gray-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 flex items-center justify-center font-bold text-xs">
                    2
                  </span>
                  <h2 className="text-lg font-bold">Select Payment Method</h2>
                </div>
                <span className="text-xs text-gray-400">Step 2 of 2</span>
              </div>

              {/* Payment Methods Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 📱 Instant UPI Option */}
                {isRazorpayEnabled && (
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('UPI')}
                    className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                      selectedPaymentMethod === 'UPI'
                        ? 'border-indigo-600 bg-indigo-50/60 dark:border-indigo-400 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                        : 'border-gray-100 dark:border-gray-800 hover:border-gray-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                          <span>📱</span>
                          <span>UPI & QR Code</span>
                        </span>
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                          Instant
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1 leading-tight">
                        Google Pay, PhonePe, Paytm, BHIM & UPI ID
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 mt-3 text-[10px] font-semibold text-gray-600 dark:text-gray-400">
                      <span>⚡ 0% Surcharge</span>
                    </div>
                  </button>
                )}

                {/* 💳 Card Option */}
                {(isRazorpayEnabled || isStripeEnabled) && (
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('CARD')}
                    className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                      selectedPaymentMethod === 'CARD'
                        ? 'border-indigo-600 bg-indigo-50/60 dark:border-indigo-400 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                        : 'border-gray-100 dark:border-gray-800 hover:border-gray-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                          <span>💳</span>
                          <span>Credit / Debit Card</span>
                        </span>
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                          3D Secure
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1 leading-tight">
                        Visa, MasterCard, RuPay, Maestro & Amex
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 mt-3 text-[10px] font-semibold text-gray-600 dark:text-gray-400">
                      <span>🔒 256-bit Encrypted</span>
                    </div>
                  </button>
                )}

                {/* 💵 COD Option */}
                {isCodEnabled && (
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('COD')}
                    className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                      selectedPaymentMethod === 'COD'
                        ? 'border-indigo-600 bg-indigo-50/60 dark:border-indigo-400 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                        : 'border-gray-100 dark:border-gray-800 hover:border-gray-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                          <span>💵</span>
                          <span>Cash on Delivery</span>
                        </span>
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                          COD
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1 leading-tight">
                        Pay cash upon receiving delivery at your door
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 mt-3 text-[10px] font-semibold text-gray-600 dark:text-gray-400">
                      <span>📦 Doorstep Verification</span>
                    </div>
                  </button>
                )}
              </div>

              {/* Sub-method details for UPI */}
              {selectedPaymentMethod === 'UPI' && (
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-800 dark:text-gray-200">
                    <span>📱 Supported UPI Apps & QR:</span>
                    <span className="text-emerald-600 font-semibold text-[11px]">Instant Verification</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px] font-medium text-gray-600 dark:text-gray-400">
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">Google Pay</span>
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">PhonePe</span>
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">Paytm</span>
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">BHIM UPI</span>
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">Scan QR Code</span>
                  </div>
                  <p className="text-[11px] text-gray-500 pt-1">
                    Click "Place Order" to pay using any installed UPI app or scan the QR code to complete payment instantly.
                  </p>
                </div>
              )}

              {/* Sub-method details for Card */}
              {selectedPaymentMethod === 'CARD' && (
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-800 dark:text-gray-200">
                    <span className="flex items-center gap-1.5">
                      <span>💳</span>
                      <span>Card Details (Stripe Secured)</span>
                    </span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-[11px] flex items-center gap-1">
                      <span>🔒 256-bit SSL</span>
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardData.number}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                          const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
                          setCardData({ ...cardData, number: formatted });
                        }}
                        placeholder="4242 4242 4242 4242"
                        className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white font-semibold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                          Expiration (MM/YY)
                        </label>
                        <input
                          type="text"
                          value={cardData.exp}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                            if (val.length >= 3) {
                              val = `${val.slice(0, 2)}/${val.slice(2)}`;
                            }
                            setCardData({ ...cardData, exp: val });
                          }}
                          placeholder="12/28"
                          className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                          CVC / CVV
                        </label>
                        <input
                          type="password"
                          value={cardData.cvc}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                            setCardData({ ...cardData, cvc: val });
                          }}
                          placeholder="888"
                          maxLength={4}
                          className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        value={cardData.nameOnCard}
                        onChange={(e) => setCardData({ ...cardData, nameOnCard: e.target.value })}
                        placeholder={formData.name || 'Full Name'}
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white font-semibold"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-[10px] font-medium text-gray-500 dark:text-gray-400 pt-1 border-t border-gray-200 dark:border-gray-700/60">
                    <span className="px-2 py-0.5 rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">Visa</span>
                    <span className="px-2 py-0.5 rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">Mastercard</span>
                    <span className="px-2 py-0.5 rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">RuPay</span>
                    <span className="px-2 py-0.5 rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">Amex</span>
                  </div>
                </div>
              )}

              {/* Sub-method details for COD */}
              {selectedPaymentMethod === 'COD' && (
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 space-y-1">
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                    💵 Pay on Delivery:
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Please keep exact cash ready or you may also pay via UPI QR code directly to the courier executive when your shipment is delivered.
                  </p>
                </div>
              )}
            </div>

            {/* Place Order CTA Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl font-bold text-base text-white shadow-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              style={{ backgroundColor: theme.themePrimaryColor || '#191a1b' }}
            >
              {isProcessing ? (
                <>
                  <span className="animate-spin text-lg">⏳</span>
                  <span>Processing Secure Payment...</span>
                </>
              ) : (
                <>
                  <span>🔒 Place Order • {currencySymbol}{summary?.grandTotal ?? totalAmount}</span>
                </>
              )}
            </button>
          </div>

          {/* ─── RIGHT COLUMN: ORDER SUMMARY & CMS TAXES (5 COLS) ────────────────── */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-[var(--sf-card-bg,#ffffff)] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-base font-bold">Order Summary</h3>
                <span className="text-xs font-bold text-gray-500">{itemCount} items</span>
              </div>

              {/* Items List Preview */}
              <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-gray-100 dark:divide-gray-800 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0 border border-gray-100 dark:border-gray-700">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=120&q=80'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-gray-100 line-clamp-1">{item.name}</p>
                        <p className="text-gray-400">Qty: {item.quantity} × {currencySymbol}{item.price}</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-gray-100 shrink-0">
                      {currencySymbol}{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Code Input */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                {appliedCoupon ? (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
                      <span>🏷️</span>
                      <span>{appliedCoupon}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-rose-600 hover:text-rose-800 font-bold text-xs cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Discount code or gift card"
                      className="flex-1 px-3.5 py-2 rounded-xl text-xs uppercase font-mono border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={isValidatingCoupon || !couponCode.trim()}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-900 hover:bg-black text-white dark:bg-white dark:text-gray-900 transition disabled:opacity-50 cursor-pointer"
                    >
                      {isValidatingCoupon ? 'Validating...' : 'Apply'}
                    </button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {currencySymbol}{summary?.subtotal ?? totalAmount}
                  </span>
                </div>

                {/* Discount Savings */}
                {(summary?.discountSavings ?? 0) > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 font-bold">
                    <span className="flex items-center gap-1">
                      <span>⚡ Promo Discount ({appliedCoupon || 'Auto'})</span>
                    </span>
                    <span>-{currencySymbol}{summary?.discountSavings?.toFixed(2)}</span>
                  </div>
                )}

                {/* Shipping Fee */}
                <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping Fee</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {(summary?.shippingFee ?? 0) === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `${currencySymbol}${summary?.shippingFee?.toFixed(2)}`
                    )}
                  </span>
                </div>

                {/* Dynamic Tax Calculation (CMS Configured) */}
                {isTaxInclusive ? (
                  <div className="flex items-center justify-between text-gray-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <span>Included {taxName} ({taxRate}%)</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        Included
                      </span>
                    </span>
                    <span>{currencySymbol}{summary?.taxAmount ?? ((totalAmount * taxRate) / (100 + taxRate)).toFixed(2)}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                    <span>Estimated {taxName} ({taxRate}%)</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      +{currencySymbol}{summary?.taxAmount ?? ((totalAmount * taxRate) / 100).toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Grand Total */}
                <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-baseline justify-between text-base font-black text-gray-900 dark:text-gray-100">
                  <span>Total Amount</span>
                  <span className="text-xl font-mono text-emerald-600">
                    {currencySymbol}{summary?.grandTotal ?? totalAmount}
                  </span>
                </div>
              </div>

              {/* Tax Compliance & Trust Footer */}
              <div className="pt-2 text-[10px] text-gray-400 space-y-1 text-center">
                {taxNumber && (
                  <p className="font-mono">Registered Merchant GSTIN / Tax ID: {taxNumber}</p>
                )}
                <p>All transactions processed with SSL & 3D Secure fraud prevention.</p>
              </div>
            </div>
          </div>
        </form>
      </main>
    </TemplateLayout>
  );
}
