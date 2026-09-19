'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import type { ThemeConfig } from '@/lib/api/types';
import { useToast } from '@/hooks/useToast';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Copy,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  ExternalLink,
  FileQuestion,
  UserCheck,
} from 'lucide-react';

export interface SupportBodyProps {
  theme: ThemeConfig;
}

interface FaqItem {
  id: string;
  category: 'orders' | 'returns' | 'payments' | 'shipping' | 'general';
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'orders',
    question: 'How do I track my order status?',
    answer:
      'Once your order has shipped, you will receive an email and SMS containing your live carrier tracking number and estimated delivery date. You can also view real-time status updates under My Account > Orders.',
  },
  {
    id: 'faq-2',
    category: 'returns',
    question: 'What is your return & exchange policy?',
    answer:
      'We offer a 30-day hassle-free return window for all unused, unopened merchandise in original packaging. To initiate a return, contact our support concierge or submit a ticket below with your order number.',
  },
  {
    id: 'faq-3',
    category: 'shipping',
    question: 'How long does domestic and express shipping take?',
    answer:
      'Standard delivery typically arrives within 3–5 business days. Priority expedited transit delivers in 1–2 business days. Orders placed before 12:00 PM EST ship the same business day.',
  },
  {
    id: 'faq-4',
    category: 'payments',
    question: 'Which payment methods do you accept?',
    answer:
      'We securely process all major credit/debit cards (Visa, MasterCard, American Express), UPI, Net Banking, cash on delivery (COD) for eligible locations, and store gift cards.',
  },
  {
    id: 'faq-5',
    category: 'orders',
    question: 'Can I modify or cancel my order after placing it?',
    answer:
      'Orders enter fulfillment quickly! You can request modifications or cancellations within 60 minutes of placement by calling our concierge hotline or opening an urgent ticket below.',
  },
  {
    id: 'faq-6',
    category: 'general',
    question: 'Are products covered by a warranty?',
    answer:
      'Yes, all authentic products sold in our store include standard manufacturer warranty against defects in materials and craftsmanship. Extended protection plans are also available on select items.',
  },
];

export function SupportBody({ theme }: SupportBodyProps) {
  const toast = useToast();
  const template = (theme.activeTemplateSlug || 'mincom').toLowerCase();

  const isLuxe = template === 'luxe' || template === 'velvet-luxury';
  const isMincom = template === 'mincom' || template === 'mincom-furniture' || template === 'artisan-craft';
  const isFuno = template === 'funo';
  const isMinimal = template === 'minimal' || template === 'nova' || template === 'nova-tech';

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderNumber: '',
    category: 'Order Status',
    priority: 'Normal',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<{
    id: string;
    email: string;
    category: string;
  } | null>(null);
  const [copiedTicket, setCopiedTicket] = useState(false);

  // FAQ state
  const [activeFaqCategory, setActiveFaqCategory] = useState<
    'all' | 'orders' | 'returns' | 'payments' | 'shipping' | 'general'
  >('all');
  const [faqSearch, setFaqSearch] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory =
        activeFaqCategory === 'all' || item.category === activeFaqCategory;
      const matchesSearch =
        faqSearch.trim() === '' ||
        item.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
        item.answer.toLowerCase().includes(faqSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeFaqCategory, faqSearch]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in your name, email, and message.');
      return;
    }

    setIsSubmitting(true);
    // Simulate real network submission with realistic ticket generation
    await new Promise((resolve) => setTimeout(resolve, 800));

    const ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedTicket({
      id: ticketId,
      email: formData.email,
      category: formData.category,
    });
    setIsSubmitting(false);
    toast.success('Your support inquiry has been successfully submitted!');
  };

  const handleCopyTicket = () => {
    if (submittedTicket) {
      navigator.clipboard.writeText(submittedTicket.id);
      setCopiedTicket(true);
      toast.success('Ticket ID copied to clipboard!');
      setTimeout(() => setCopiedTicket(false), 2500);
    }
  };

  const handleResetForm = () => {
    setSubmittedTicket(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      orderNumber: '',
      category: 'Order Status',
      priority: 'Normal',
      message: '',
    });
  };

  // Support channels data
  const supportEmail = theme.contactEmail || 'support@omnistore.com';
  const supportPhone = theme.contactPhone || '+1 (800) 555-0199';
  const hasAddress = !!(theme.addressStreet || theme.addressCity);
  const formattedAddress = [
    theme.addressStreet,
    theme.addressCity,
    theme.addressState,
    theme.addressZip,
    theme.addressCountry,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div
      className="min-h-screen py-12 md:py-20 transition-colors duration-300"
      style={{ backgroundColor: 'var(--sf-bg, #ffffff)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* ─── Hero Header ────────────────────────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border shadow-xs"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--sf-primary, #6366f1) 8%, transparent)',
              borderColor: 'color-mix(in srgb, var(--sf-primary, #6366f1) 25%, transparent)',
              color: 'var(--sf-primary, #6366f1)',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {isLuxe
                ? 'Private Client Atelier Concierge'
                : isFuno
                  ? 'We Are Here to Help! 💬'
                  : 'Customer Care & Support Center'}
            </span>
          </div>

          <h1
            className={`tracking-tight ${
              isLuxe
                ? 'font-serif text-3xl sm:text-5xl uppercase tracking-[0.15em]'
                : isFuno
                  ? 'font-black text-4xl sm:text-6xl'
                  : isMinimal
                    ? 'font-extralight text-3xl sm:text-5xl tracking-widest uppercase'
                    : 'font-extrabold text-3xl sm:text-5xl'
            }`}
            style={{ color: 'var(--sf-text, #0f172a)' }}
          >
            {isLuxe
              ? 'White-Glove Assistance'
              : isFuno
                ? 'How can we help today?'
                : 'Help & Concierge'}
          </h1>

          <p
            className="text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'color-mix(in srgb, var(--sf-text, #0f172a) 65%, transparent)' }}
          >
            {isLuxe
              ? `Our dedicated private client advisers are available to assist you with order status, bespoke customizations, and personal consultations.`
              : isFuno
                ? `Got a question about your order, returns, or just want to say hi? Drop us a line below and we'll get back to you in a flash!`
                : `Have a question about an order, shipping, returns, or product details? Our team is dedicated to providing you prompt, comprehensive assistance.`}
          </p>

          {/* SLA Pill */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-medium text-neutral-500">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-500" />
              Average response time: <strong>&lt; 2 hours</strong>
            </span>
            <span className="hidden sm:inline opacity-30">•</span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              100% Guaranteed Resolution
            </span>
          </div>
        </div>

        {/* ─── Contact Channels Grid ─────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Email Support */}
          <div
            className={`p-6 sm:p-8 flex flex-col justify-between border shadow-sm transition-all hover:shadow-md ${
              isLuxe
                ? 'rounded-none border-neutral-800'
                : isFuno
                  ? 'rounded-3xl border-2 border-black bg-yellow-50 dark:bg-neutral-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  : isMincom
                    ? 'rounded-3xl border-slate-200 dark:border-slate-800 bg-stone-50/50 dark:bg-neutral-900/50'
                    : 'rounded-2xl border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'
            }`}
          >
            <div className="space-y-4">
              <div
                className={`w-12 h-12 flex items-center justify-center ${
                  isLuxe
                    ? 'rounded-none border border-neutral-700 bg-neutral-900 text-amber-300'
                    : isFuno
                      ? 'rounded-2xl bg-black text-white'
                      : 'rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                }`}
              >
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3
                  className="font-bold text-base sm:text-lg"
                  style={{ color: 'var(--sf-text)' }}
                >
                  Email Inquiries
                </h3>
                <p
                  className="text-xs sm:text-sm mt-1 leading-relaxed"
                  style={{ color: 'color-mix(in srgb, var(--sf-text) 60%, transparent)' }}
                >
                  For detailed questions, order modifications, or official inquiries.
                </p>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-neutral-800">
              <a
                href={`mailto:${supportEmail}`}
                className="inline-flex items-center gap-2 text-sm font-semibold hover:underline"
                style={{ color: 'var(--sf-primary)' }}
              >
                <span>{supportEmail}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 2: Phone / Direct Hotline */}
          <div
            className={`p-6 sm:p-8 flex flex-col justify-between border shadow-sm transition-all hover:shadow-md ${
              isLuxe
                ? 'rounded-none border-neutral-800'
                : isFuno
                  ? 'rounded-3xl border-2 border-black bg-rose-50 dark:bg-neutral-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  : isMincom
                    ? 'rounded-3xl border-slate-200 dark:border-slate-800 bg-stone-50/50 dark:bg-neutral-900/50'
                    : 'rounded-2xl border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'
            }`}
          >
            <div className="space-y-4">
              <div
                className={`w-12 h-12 flex items-center justify-center ${
                  isLuxe
                    ? 'rounded-none border border-neutral-700 bg-neutral-900 text-amber-300'
                    : isFuno
                      ? 'rounded-2xl bg-black text-white'
                      : 'rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                }`}
              >
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3
                  className="font-bold text-base sm:text-lg"
                  style={{ color: 'var(--sf-text)' }}
                >
                  Phone & WhatsApp
                </h3>
                <p
                  className="text-xs sm:text-sm mt-1 leading-relaxed"
                  style={{ color: 'color-mix(in srgb, var(--sf-text) 60%, transparent)' }}
                >
                  Speak directly with an associate. Mon–Fri from 9:00 AM – 6:00 PM EST.
                </p>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-neutral-800">
              <a
                href={`tel:${supportPhone.replace(/[^+\d]/g, '')}`}
                className="inline-flex items-center gap-2 text-sm font-semibold hover:underline"
                style={{ color: 'var(--sf-primary)' }}
              >
                <span>{supportPhone}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 3: Location / Studio */}
          <div
            className={`p-6 sm:p-8 flex flex-col justify-between border shadow-sm transition-all hover:shadow-md ${
              isLuxe
                ? 'rounded-none border-neutral-800'
                : isFuno
                  ? 'rounded-3xl border-2 border-black bg-cyan-50 dark:bg-neutral-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  : isMincom
                    ? 'rounded-3xl border-slate-200 dark:border-slate-800 bg-stone-50/50 dark:bg-neutral-900/50'
                    : 'rounded-2xl border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'
            }`}
          >
            <div className="space-y-4">
              <div
                className={`w-12 h-12 flex items-center justify-center ${
                  isLuxe
                    ? 'rounded-none border border-neutral-700 bg-neutral-900 text-amber-300'
                    : isFuno
                      ? 'rounded-2xl bg-black text-white'
                      : 'rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
                }`}
              >
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3
                  className="font-bold text-base sm:text-lg"
                  style={{ color: 'var(--sf-text)' }}
                >
                  {isLuxe ? 'Private Salon & Studio' : 'Headquarters & Studio'}
                </h3>
                <p
                  className="text-xs sm:text-sm mt-1 leading-relaxed"
                  style={{ color: 'color-mix(in srgb, var(--sf-text) 60%, transparent)' }}
                >
                  {hasAddress ? formattedAddress : '100 Madison Ave, New York, NY 10016, USA'}
                </p>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-neutral-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                In-person by appointment
              </span>
            </div>
          </div>
        </div>

        {/* ─── Main Support Area: Form & Direct Actions ──────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Interactive Ticket Form */}
          <div
            className={`lg:col-span-7 p-6 sm:p-10 border shadow-md ${
              isLuxe
                ? 'rounded-none border-neutral-800 bg-neutral-950/40 backdrop-blur-sm'
                : isFuno
                  ? 'rounded-3xl border-2 border-black bg-white dark:bg-neutral-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
                  : isMincom
                    ? 'rounded-3xl border-slate-200 dark:border-slate-800 bg-white dark:bg-neutral-900'
                    : 'rounded-2xl border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'
            }`}
          >
            {submittedTicket ? (
              /* Success Confirmation Card */
              <div className="text-center py-10 px-4 space-y-6 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3
                    className="text-2xl font-black"
                    style={{ color: 'var(--sf-text)' }}
                  >
                    Support Ticket Created!
                  </h3>
                  <p
                    className="text-sm max-w-md mx-auto"
                    style={{ color: 'color-mix(in srgb, var(--sf-text) 60%, transparent)' }}
                  >
                    Thank you for reaching out. We have logged your request and sent a confirmation
                    to <strong>{submittedTicket.email}</strong>.
                  </p>
                </div>

                <div
                  className="p-5 max-w-sm mx-auto rounded-2xl border flex items-center justify-between gap-4"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--sf-primary) 5%, transparent)',
                    borderColor: 'color-mix(in srgb, var(--sf-primary) 20%, transparent)',
                  }}
                >
                  <div className="text-left">
                    <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold block">
                      Ticket Reference
                    </span>
                    <span className="font-mono text-lg font-bold text-neutral-900 dark:text-white">
                      {submittedTicket.id}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyTicket}
                    className="p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedTicket ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-4 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider border hover:opacity-80 transition cursor-pointer"
                    style={{
                      borderColor: 'color-mix(in srgb, var(--sf-text) 20%, transparent)',
                      color: 'var(--sf-text)',
                    }}
                  >
                    Submit Another Inquiry
                  </button>
                  <Link
                    href="/orders"
                    className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white transition shadow-sm hover:opacity-90"
                    style={{ backgroundColor: 'var(--sf-primary)' }}
                  >
                    View My Orders
                  </Link>
                </div>
              </div>
            ) : (
              /* Support Form */
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="space-y-1">
                  <h2
                    className={`text-2xl font-black ${
                      isLuxe ? 'font-serif uppercase tracking-widest' : ''
                    }`}
                    style={{ color: 'var(--sf-text)' }}
                  >
                    Send Us a Message
                  </h2>
                  <p
                    className="text-xs sm:text-sm"
                    style={{ color: 'color-mix(in srgb, var(--sf-text) 60%, transparent)' }}
                  >
                    Fill out the form below and an associate will get back to you promptly.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="support-name"
                      className="text-xs font-bold uppercase tracking-wider block"
                      style={{ color: 'var(--sf-text)' }}
                    >
                      Your Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="support-name"
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition focus:ring-2"
                      style={{
                        backgroundColor: 'var(--sf-bg)',
                        borderColor: 'color-mix(in srgb, var(--sf-text) 15%, transparent)',
                        color: 'var(--sf-text)',
                      }}
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="support-email"
                      className="text-xs font-bold uppercase tracking-wider block"
                      style={{ color: 'var(--sf-text)' }}
                    >
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="support-email"
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition focus:ring-2"
                      style={{
                        backgroundColor: 'var(--sf-bg)',
                        borderColor: 'color-mix(in srgb, var(--sf-text) 15%, transparent)',
                        color: 'var(--sf-text)',
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="support-phone"
                      className="text-xs font-bold uppercase tracking-wider block"
                      style={{ color: 'var(--sf-text)' }}
                    >
                      Phone Number (Optional)
                    </label>
                    <input
                      id="support-phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition focus:ring-2"
                      style={{
                        backgroundColor: 'var(--sf-bg)',
                        borderColor: 'color-mix(in srgb, var(--sf-text) 15%, transparent)',
                        color: 'var(--sf-text)',
                      }}
                    />
                  </div>

                  {/* Order Number */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="support-order"
                      className="text-xs font-bold uppercase tracking-wider block"
                      style={{ color: 'var(--sf-text)' }}
                    >
                      Order Number (Optional)
                    </label>
                    <input
                      id="support-order"
                      type="text"
                      placeholder="e.g. ORD-109482"
                      value={formData.orderNumber}
                      onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition focus:ring-2 font-mono"
                      style={{
                        backgroundColor: 'var(--sf-bg)',
                        borderColor: 'color-mix(in srgb, var(--sf-text) 15%, transparent)',
                        color: 'var(--sf-text)',
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="support-category"
                      className="text-xs font-bold uppercase tracking-wider block"
                      style={{ color: 'var(--sf-text)' }}
                    >
                      Topic / Category
                    </label>
                    <select
                      id="support-category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition"
                      style={{
                        backgroundColor: 'var(--sf-bg)',
                        borderColor: 'color-mix(in srgb, var(--sf-text) 15%, transparent)',
                        color: 'var(--sf-text)',
                      }}
                    >
                      <option value="Order Status">📦 Order Status & Tracking</option>
                      <option value="Returns & Refunds">↩️ Returns & Refund Request</option>
                      <option value="Product & Sizing">✨ Product Details & Sizing</option>
                      <option value="Payment & Billing">💳 Payment & Invoicing</option>
                      {isLuxe && <option value="Bespoke Concierge">💎 Bespoke Private Consultation</option>}
                      <option value="Other">💬 General Feedback</option>
                    </select>
                  </div>

                  {/* Priority */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="support-priority"
                      className="text-xs font-bold uppercase tracking-wider block"
                      style={{ color: 'var(--sf-text)' }}
                    >
                      Urgency Level
                    </label>
                    <select
                      id="support-priority"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition"
                      style={{
                        backgroundColor: 'var(--sf-bg)',
                        borderColor: 'color-mix(in srgb, var(--sf-text) 15%, transparent)',
                        color: 'var(--sf-text)',
                      }}
                    >
                      <option value="Normal">Normal (reply within 2–4h)</option>
                      <option value="Urgent">Urgent (active shipment inquiry)</option>
                      <option value="Low">Low (general question)</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="support-message"
                    className="text-xs font-bold uppercase tracking-wider block"
                    style={{ color: 'var(--sf-text)' }}
                  >
                    How Can We Help? <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="support-message"
                    rows={4}
                    required
                    placeholder="Please share details about your inquiry, item names, or any specific questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition focus:ring-2 resize-none"
                    style={{
                      backgroundColor: 'var(--sf-bg)',
                      borderColor: 'color-mix(in srgb, var(--sf-text) 15%, transparent)',
                      color: 'var(--sf-text)',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isLuxe
                      ? 'rounded-none uppercase tracking-[0.2em] hover:opacity-90 active:scale-[0.99]'
                      : isFuno
                        ? 'rounded-2xl border-2 border-black bg-black text-white hover:bg-neutral-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                        : isMincom
                          ? 'rounded-2xl hover:opacity-90 active:scale-[0.99]'
                          : 'rounded-xl hover:opacity-90 active:scale-[0.99]'
                  }`}
                  style={{ backgroundColor: isFuno ? '#000000' : 'var(--sf-primary)' }}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending Message...</span>
                    </div>
                  ) : (
                    <>
                      <span>{isLuxe ? 'Submit Inquiry to Atelier' : 'Submit Support Request'}</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Quick Help & Help Cards */}
          <div className="lg:col-span-5 space-y-6">
            {/* Fast Order Status Lookup Widget */}
            <div
              className={`p-6 sm:p-8 border shadow-sm ${
                isLuxe
                  ? 'rounded-none border-neutral-800 bg-neutral-900/30'
                  : isFuno
                    ? 'rounded-3xl border-2 border-black bg-white dark:bg-neutral-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                    : isMincom
                      ? 'rounded-3xl border-slate-200 dark:border-slate-800 bg-white dark:bg-neutral-900'
                      : 'rounded-2xl border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: 'var(--sf-primary)' }}
                >
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base" style={{ color: 'var(--sf-text)' }}>
                    Quick Order Tracking
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Check fulfillment & transit status instantly
                  </p>
                </div>
              </div>
              <p
                className="text-xs leading-relaxed mb-4"
                style={{ color: 'color-mix(in srgb, var(--sf-text) 65%, transparent)' }}
              >
                Track live parcels, download invoices, or print return shipping labels directly
                from your account orders tab.
              </p>
              <Link
                href="/orders"
                className="w-full py-3 px-4 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
                style={{
                  borderColor: 'color-mix(in srgb, var(--sf-text) 20%, transparent)',
                  color: 'var(--sf-text)',
                }}
              >
                <span>Go to My Orders</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Guarantees Box */}
            <div
              className={`p-6 sm:p-8 border space-y-4 shadow-sm ${
                isLuxe
                  ? 'rounded-none border-neutral-800 bg-neutral-900/20'
                  : isFuno
                    ? 'rounded-3xl border-2 border-black bg-purple-50 dark:bg-neutral-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                    : isMincom
                      ? 'rounded-3xl border-slate-200 dark:border-slate-800 bg-white dark:bg-neutral-900'
                      : 'rounded-2xl border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'
              }`}
            >
              <h4 className="font-bold text-sm flex items-center gap-2" style={{ color: 'var(--sf-text)' }}>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Our Merchant Promises</span>
              </h4>

              <div className="space-y-3 text-xs" style={{ color: 'color-mix(in srgb, var(--sf-text) 70%, transparent)' }}>
                <div className="flex items-start gap-2.5">
                  <RotateCcw className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block" style={{ color: 'var(--sf-text)' }}>
                      30-Day Effortless Returns
                    </span>
                    <span>Full refunds on qualifying unused merchandise with prepaid labels.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CreditCard className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block" style={{ color: 'var(--sf-text)' }}>
                      Encrypted Checkout & Privacy
                    </span>
                    <span>256-bit bank-grade SSL encryption on all payment transactions.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <UserCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block" style={{ color: 'var(--sf-text)' }}>
                      Dedicated Human Support
                    </span>
                    <span>Real product specialists handling inquiries without automated dead-ends.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Hours Box */}
            <div
              className={`p-6 border space-y-3 ${
                isLuxe
                  ? 'rounded-none border-neutral-800'
                  : 'rounded-2xl border-slate-200 dark:border-neutral-800'
              }`}
              style={{ backgroundColor: 'color-mix(in srgb, var(--sf-text) 3%, var(--sf-bg))' }}
            >
              <div className="flex items-center gap-2 text-xs font-bold" style={{ color: 'var(--sf-text)' }}>
                <Clock className="w-4 h-4 text-neutral-400" />
                <span>Operating Concierge Hours</span>
              </div>
              <div className="text-xs space-y-1 text-neutral-500">
                <div className="flex justify-between">
                  <span>Monday – Friday:</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    9:00 AM – 6:00 PM EST
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday – Sunday:</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    10:00 AM – 4:00 PM EST
                  </span>
                </div>
                <div className="flex justify-between text-[11px] pt-1 text-emerald-600 dark:text-emerald-400">
                  <span>Status:</span>
                  <span className="font-bold">Agents Active & Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Interactive FAQ Accordion Section ──────────────────────── */}
        <div className="pt-12 border-t border-slate-200/60 dark:border-neutral-800 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2
              className={`text-2xl sm:text-3xl font-extrabold ${
                isLuxe ? 'font-serif uppercase tracking-widest' : ''
              }`}
              style={{ color: 'var(--sf-text)' }}
            >
              Frequently Asked Questions
            </h2>
            <p
              className="text-xs sm:text-sm"
              style={{ color: 'color-mix(in srgb, var(--sf-text) 60%, transparent)' }}
            >
              Find instant answers to the most common questions regarding orders, shipping, and returns.
            </p>
          </div>

          {/* FAQ Controls: Search & Category Pills */}
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-4 top-3.5 text-neutral-400" />
              <input
                type="text"
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                placeholder="Search help topics (e.g. shipping time, returns, tracking)..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl border text-sm outline-none transition focus:ring-2"
                style={{
                  backgroundColor: 'var(--sf-bg)',
                  borderColor: 'color-mix(in srgb, var(--sf-text) 15%, transparent)',
                  color: 'var(--sf-text)',
                }}
              />
              {faqSearch && (
                <button
                  type="button"
                  onClick={() => setFaqSearch('')}
                  className="absolute right-3.5 top-3 text-xs text-neutral-400 hover:text-neutral-600 px-1.5 py-0.5 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { id: 'all', label: 'All Questions' },
                { id: 'orders', label: 'Orders & Tracking' },
                { id: 'returns', label: 'Returns & Refunds' },
                { id: 'shipping', label: 'Shipping & Transit' },
                { id: 'payments', label: 'Payments' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFaqCategory(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeFaqCategory === tab.id
                      ? 'text-white shadow-xs'
                      : 'border text-neutral-600 dark:text-neutral-400 hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor:
                      activeFaqCategory === tab.id ? 'var(--sf-primary)' : 'transparent',
                    borderColor:
                      activeFaqCategory === tab.id
                        ? 'var(--sf-primary)'
                        : 'color-mix(in srgb, var(--sf-text) 15%, transparent)',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Accordion List */}
          <div className="max-w-3xl mx-auto space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12 text-sm text-neutral-400">
                <FileQuestion className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <span>No matching questions found. Submit a ticket above for custom assistance!</span>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = expandedFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`border overflow-hidden transition-all ${
                      isLuxe
                        ? 'rounded-none border-neutral-800'
                        : isFuno
                          ? 'rounded-2xl border-2 border-black bg-white dark:bg-neutral-900'
                          : 'rounded-2xl border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaqId(isOpen ? null : faq.id)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition"
                      style={{ color: 'var(--sf-text)' }}
                    >
                      <span>{faq.question}</span>
                      <div className="shrink-0 text-neutral-400">
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </button>
                    {isOpen && (
                      <div
                        className="px-5 pb-5 text-xs sm:text-sm leading-relaxed border-t border-slate-100 dark:border-neutral-800/80 pt-3"
                        style={{
                          color: 'color-mix(in srgb, var(--sf-text) 65%, transparent)',
                        }}
                      >
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
