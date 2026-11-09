'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FurnitureHeader from './Header';
import FurnitureFooter from './Footer';
import FurnitureProductCard from './ProductCard';
import type { HomePageProps } from '@/templates';
import type { Product } from '@/lib/api/types';
import { useCurrency } from '@/hooks/useCurrency';
import {
  ArrowRight,
  Palette,
  Sparkles,
  Lightbulb,
  Plus,
  Star,
  Truck,
  Home as HomeIcon,
  ShieldCheck,
  Headphones,
  Verified,
} from 'lucide-react';

export default function FurnitureHomePage({
  theme,
  products = [],
  collections = [],
  categories = [],
}: HomePageProps) {
  const { formatPrice } = useCurrency();
  const [selectedCraftTab, setSelectedCraftTab] = useState<'all' | 'ceramics' | 'lighting'>('all');
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  // Curated Archetype Products (fallback if store catalog has few items)
  const defaultArchetypes: Product[] = [
    {
      id: 'arch-1',
      name: 'Oaxaca Terracotta Vessel',
      urlSlug: 'oaxaca-terracotta-vessel',
      description: 'Hand-spun coarse red clay from San Bartolo guilds.',
      price: 165,
      compareAtPrice: 195,
      inventory: 24,
      stockQuantity: 24,
      status: 'ACTIVE',
      category: 'ceramics',
      categoryName: 'Ceramics & Tableware',
      reviewsCount: 124,
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBCoAB_GCdcZctIb8R-5Pb7vutaSPPCLEo-FZC9VRkXLj3cg4_SSiaC3uN6h-fgE9fGrzvv-FCFJNDX4FxJd-iqVqaSrgPZttPYykFrv7L6J3t00NHBKiUpk84L7ut2r2gL7QG9_Aj8PlucRJGNa3fUc8UN46GoMlUCnY1pzBFb22CeYQ1boHQlHLCZCzHLjxsJygOAZN4ZZWMGv-n9djD2DuZUvBIFaznge8fKNIQ',
      ],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBCoAB_GCdcZctIb8R-5Pb7vutaSPPCLEo-FZC9VRkXLj3cg4_SSiaC3uN6h-fgE9fGrzvv-FCFJNDX4FxJd-iqVqaSrgPZttPYykFrv7L6J3t00NHBKiUpk84L7ut2r2gL7QG9_Aj8PlucRJGNa3fUc8UN46GoMlUCnY1pzBFb22CeYQ1boHQlHLCZCzHLjxsJygOAZN4ZZWMGv-n9djD2DuZUvBIFaznge8fKNIQ',
    },
    {
      id: 'arch-2',
      name: 'Arco Cast Aluminum Lamp',
      urlSlug: 'arco-cast-aluminum-lamp',
      description: 'Recycled sand-cast metal with touch dimming curve.',
      price: 380,
      inventory: 15,
      stockQuantity: 15,
      status: 'ACTIVE',
      category: 'lighting',
      categoryName: 'Architectural Lighting',
      reviewsCount: 89,
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAnvY4aG_Yv8Ldfj0o3F40uoW-ZZ2n6Eue2Lb8FucF0bRshYlKkymlltM-crV9SB438dUUwI78BzhBDJoIxId6F3x0NlAbTKbVNKwDSlvH2MKyV6HIAI3t-Z6SYnrQzdGRI1DP-6UrBluCIkHFUanobgdd7LauMn02ZxVF1p92vllv-eZvl5w9NA-McG-R--W8E96AfN8rPPNbq-aZFuFPZlfOic_sfljZoLU8SeS4',
      ],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAnvY4aG_Yv8Ldfj0o3F40uoW-ZZ2n6Eue2Lb8FucF0bRshYlKkymlltM-crV9SB438dUUwI78BzhBDJoIxId6F3x0NlAbTKbVNKwDSlvH2MKyV6HIAI3t-Z6SYnrQzdGRI1DP-6UrBluCIkHFUanobgdd7LauMn02ZxVF1p92vllv-eZvl5w9NA-McG-R--W8E96AfN8rPPNbq-aZFuFPZlfOic_sfljZoLU8SeS4',
    },
    {
      id: 'arch-3',
      name: 'Cedar & Hinoki Wash',
      urlSlug: 'cedar-hinoki-wash',
      description: 'Steam-distilled wildcrafted wood oils from Kiso Valley.',
      price: 68,
      inventory: 50,
      stockQuantity: 50,
      status: 'ACTIVE',
      category: 'wellness',
      categoryName: 'Natural Fragrance',
      reviewsCount: 210,
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD1l8n4MuqnAQyh8GoPq4PZQfFZiP8qCPC7BQtgNwc3s06SNhVDYbTYRTo-wriCElzVESgIZ25eTb2JMabAxxwu5mHhPiwn7fa55uxKsl5ODeSLqsNEhk5kqWnem3iUssT7s3S8rOxCK_d-507aqUQoHsXPw1dsM2xcMrw3eoEEOyU6ceKYVCIxVCEG294BdEILT3P9JfkWSqenf_8wb9vASLIZraTAZPd4f2ZCohI',
      ],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD1l8n4MuqnAQyh8GoPq4PZQfFZiP8qCPC7BQtgNwc3s06SNhVDYbTYRTo-wriCElzVESgIZ25eTb2JMabAxxwu5mHhPiwn7fa55uxKsl5ODeSLqsNEhk5kqWnem3iUssT7s3S8rOxCK_d-507aqUQoHsXPw1dsM2xcMrw3eoEEOyU6ceKYVCIxVCEG294BdEILT3P9JfkWSqenf_8wb9vASLIZraTAZPd4f2ZCohI',
    },
    {
      id: 'arch-4',
      name: 'Kumo Woven Cashmere Throw',
      urlSlug: 'kumo-woven-cashmere-throw',
      description: 'Hand-spun organic Mongolian cashmere with raw edges.',
      price: 310,
      inventory: 8,
      stockQuantity: 8,
      status: 'ACTIVE',
      category: 'furniture',
      categoryName: 'Organic Lounge Linens',
      reviewsCount: 62,
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBnRXZfPl-AtV0Rk-Jc_ITsP_G2CWhsKkPeeHR5E6yPSlOU88UaM06XzvMIMXKSgNpt6XiQb3DDgYpHokEMPFQSvblTPoDDOb9FJoJ2eN0_4sFHCgdSDhjeeg3EKz2EyBYHhm5pmIc8Muv5QjAUo-PMzSXoALhIBMq2XwrHgmIBl4u0CokP8JK8PC5Avp3aTwWJXBMRVezwXKPDU99EbW5zgoBdvremMQLET7zvF6o',
      ],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBnRXZfPl-AtV0Rk-Jc_ITsP_G2CWhsKkPeeHR5E6yPSlOU88UaM06XzvMIMXKSgNpt6XiQb3DDgYpHokEMPFQSvblTPoDDOb9FJoJ2eN0_4sFHCgdSDhjeeg3EKz2EyBYHhm5pmIc8Muv5QjAUo-PMzSXoALhIBMq2XwrHgmIBl4u0CokP8JK8PC5Avp3aTwWJXBMRVezwXKPDU99EbW5zgoBdvremMQLET7zvF6o',
    },
  ];

  // Merge live store products with default archetypes
  const displayProducts = products && products.length >= 4 ? products : defaultArchetypes;

  const filteredProducts = displayProducts.filter((p) => {
    if (selectedCraftTab === 'all') return true;
    const cat = (p.categoryName || p.category || '').toLowerCase();
    const name = (p.name || '').toLowerCase();
    if (selectedCraftTab === 'ceramics') {
      return cat.includes('ceramic') || cat.includes('tableware') || name.includes('vessel') || name.includes('vase');
    }
    if (selectedCraftTab === 'lighting') {
      return cat.includes('light') || cat.includes('lamp') || name.includes('lamp');
    }
    return true;
  }).slice(0, 8);

  // Curated category archive tiles
  const curatedCategories = [
    {
      title: 'Ceramic & Tableware',
      count: '42 Articulated Objects',
      href: '/products?category=ceramics',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBdvcxSBMW6QmLD49SQoAFsMHHvod-_wHTaIro63B1NDXuA2Vtqa6osRU3KxYUnbkFrvoQTZYFpGNfTtZ1yv8_boObFALEPl1llhkmXySVWBQb-ivavL-WV5tTlILMNsN9rsPQBx0IPLuf46wKxzFVXUvOZApI2VGxA4lnPJ1A8z4e0Po4gqQ5EMQgASf8wGLnqrxBpzTMR4Nx4Bp5MJ-5PuKSIaSUwF3q67ZFsL7I',
    },
    {
      title: 'Architectural Lighting',
      count: '28 Illuminated Forms',
      href: '/products?category=lighting',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAmburidtohQapfkMGyebatvPbK2_cR7q9YwT-oFOMpRwNoai3HrswffWP-_cBBKhevciDAifCoouFiw7Q6xg_wjN8uePKdCYFTHM_yJ73Svcl58lA6n8DjsFrGgB_Km1Qm1kNOjq5T9b3qtsawWTvVGxYe8XyxE-7N2JWftQXAOCHxMO7iaUJRtavAvoWMYyC3t-44HXVp3ic-QISIZOpdLPDNqMwrX5_wO9VkgVE',
    },
    {
      title: 'Natural Fragrance',
      count: '19 Botanical Essences',
      href: '/products?category=wellness',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBMaQNxpBJuXtB1sVOtDIOPiybe0zfrPodDBUtUOhnTzBc1rTM3fKQ-RctJdiBRR4hWYw-aBsu0lemDxaun0SUJZDb0dPO3Do27-YIJT2l0Z4PIiCmNNCyfGti3TVQ1NS9hCavdq44trIuaVv2PgEg-2iL0lZWMCeCXCzMJSZ81YbzvVzO5frSAgzvGcT1XWhphiSiPSQP8RuD7epkOQqV0jrPrKeLKG2sdOoE19J8',
    },
    {
      title: 'Organic Lounge Linens',
      count: '34 Tactile Weaves',
      href: '/products?category=furniture',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDIqIXMnwTccPVfIeEGkELOeKY0aZqEwPRuycEp6TNjRXVFiEyncyBIWmwL4Uj6nAxDbSSaGNSlc9ycX7LJBYl-I2nQjoX9xFCc_4EFOviaLwGv8hF28lY_q_FLGw21PSVZhJDsIyXWyjEyVlIRtj8cm3aCg_Ck_KRsgAf1snk1AKI4S_fG6kXWX4pTZEcbxKA6GsLVMcF9bmuKfwYXeNbqK7ULlwOaKrQqh6_FMlk',
    },
  ];

  return (
    <div
      className="min-h-screen bg-[#faf9f6] text-[#1a1c1a] antialiased selection:bg-[#c5e7d6] selection:text-[#4a695b]"
      style={{ fontFamily: 'var(--font-plus-jakarta, sans-serif)' }}
    >
      <FurnitureHeader />

      <main className="w-full pt-28 bg-[#faf9f6]">
        {/* ── 1. Editorial Hero Section ── */}
        <section className="relative w-full overflow-hidden bg-[#f4f3f1]">
          <div className="w-full relative min-h-[780px] lg:min-h-[840px] flex items-center">
            {/* Background Image with Editorial Scrim */}
            <div
              className="absolute inset-0 z-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCftlFhGwWAzboOuAIeePkeU9Pw7QllXYHcQ-_SFsUP33vQlO-ZjcSUJlrgY7lCkdggyj0nW3bo8kw-EwWgWJYAuS5uZCfpN6XY_nzlfSFabrSa-yzxvrvbos9458vIZVkrZfo59SsWWbylpzcZCZ9d3k3T3foosN0ywJelI4qTEBNqxNKALmujVGKxVOoPon02uoqE1j868tK8q2YeoFB4EAOqCfSoMkzRgDoS01c')`,
              }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#faf9f6] via-[#faf9f6]/85 to-transparent" />

            {/* Ambient Graphic Blur */}
            <div className="absolute right-12 top-1/4 w-96 h-96 rounded-full bg-[#c5e7d6]/20 blur-3xl pointer-events-none" />

            {/* Hero Copy Container */}
            <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 py-20 w-full">
              <div className="max-w-2xl">
                {/* Release Tag */}
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#e9e8e5]/80 backdrop-blur-sm mb-6 border border-[#c4c7c7]/30">
                  <span className="w-2 h-2 rounded-full bg-[#466557] animate-pulse" />
                  <span className="text-[11px] font-semibold text-[#444748] uppercase tracking-widest">
                    Spring / Summer 2025 Release
                  </span>
                </div>

                {/* Hero Title */}
                <h1
                  className="text-4xl sm:text-5xl lg:text-[56px] text-[#040505] tracking-tight mb-6 leading-[1.1]"
                  style={{ fontFamily: 'var(--font-playfair, serif)' }}
                >
                  Curated Objects for Mindful Living
                </h1>

                {/* Hero Description */}
                <p className="text-base sm:text-lg text-[#444748] max-w-xl mb-8 leading-relaxed">
                  Explore the Spring/Summer 2025 interior and wellness collection crafted by global
                  independent artisans. Designed with intentional restraint and earthen tactility.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-4 mb-12">
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center bg-[#040505] text-white text-[13px] font-medium px-8 py-3.5 rounded-lg shadow-sm hover:bg-[#466557] transition-all group"
                  >
                    Explore Collection
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center bg-[#ffffff]/80 text-[#040505] text-[13px] font-medium px-8 py-3.5 rounded-lg shadow-sm hover:bg-[#e9e8e5] transition-colors backdrop-blur-sm border border-[#e3e2e0]"
                  >
                    Read The Journal
                  </Link>
                </div>

                {/* Quick Editorial Highlights */}
                <div className="pt-4 flex flex-wrap items-center gap-6 sm:gap-8 bg-[#faf9f6]/60 backdrop-blur-md p-4 rounded-xl max-w-xl border border-[#e3e2e0]/60">
                  <div className="flex items-center gap-2.5">
                    <Palette className="w-5 h-5 text-[#466557]" />
                    <div>
                      <p className="text-[12px] font-semibold text-[#040505]">Handcrafted Ceramics</p>
                      <p className="text-[10px] text-[#444748] uppercase tracking-wider">Oaxaca & Kyoto</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-5 h-5 text-[#466557]" />
                    <div>
                      <p className="text-[12px] font-semibold text-[#040505]">Organic Textiles</p>
                      <p className="text-[10px] text-[#444748] uppercase tracking-wider">GOTS Certified</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Lightbulb className="w-5 h-5 text-[#466557]" />
                    <div>
                      <p className="text-[12px] font-semibold text-[#040505]">Sculptural Lighting</p>
                      <p className="text-[10px] text-[#444748] uppercase tracking-wider">Cast Aluminum</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. Curated Categories Grid ("Spaces of Serenity") ── */}
        <section className="w-full py-20 max-w-[1440px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[11px] font-semibold text-[#466557] uppercase tracking-widest block mb-1">
                Curation Archive
              </span>
              <h2
                className="text-3xl sm:text-4xl text-[#040505] tracking-tight"
                style={{ fontFamily: 'var(--font-playfair, serif)' }}
              >
                Spaces of Serenity
              </h2>
            </div>
            <p className="text-[14px] text-[#444748] max-w-md leading-relaxed">
              Distinct tactile domains curated to bring balance, quiet acoustic warmth, and organic
              geometry to domestic sanctuaries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {curatedCategories.map((cat) => (
              <Link
                key={cat.title}
                href={cat.href}
                className="group relative flex flex-col bg-[#f4f3f1] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[#e3e2e0]"
              >
                <div className="aspect-[4/5] w-full overflow-hidden bg-[#efeeeb] relative">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="p-5 flex items-center justify-between bg-[#ffffff]">
                  <div>
                    <h3
                      className="text-[18px] text-[#040505] group-hover:text-[#466557] transition-colors"
                      style={{ fontFamily: 'var(--font-playfair, serif)' }}
                    >
                      {cat.title}
                    </h3>
                    <span className="text-[12px] text-[#444748]">{cat.count}</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#efeeeb] flex items-center justify-center text-[#040505] group-hover:bg-[#040505] group-hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 3. Featured Best-Sellers Grid ("Acclaimed Archetypes") ── */}
        <section className="w-full py-20 bg-[#f4f3f1] border-y border-[#e3e2e0]/60">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-[11px] font-semibold text-[#466557] uppercase tracking-widest block mb-1">
                  Permanent Collection
                </span>
                <h2
                  className="text-3xl sm:text-4xl text-[#040505] tracking-tight"
                  style={{ fontFamily: 'var(--font-playfair, serif)' }}
                >
                  Acclaimed Archetypes
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-[#444748] mr-1 hidden sm:inline">
                  Filtered by Craft Tier
                </span>
                <button
                  onClick={() => setSelectedCraftTab('all')}
                  className={`px-4 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                    selectedCraftTab === 'all'
                      ? 'bg-[#466557] text-white'
                      : 'bg-[#efeeeb] text-[#1a1c1a] hover:bg-[#e9e8e5]'
                  }`}
                >
                  All Forms
                </button>
                <button
                  onClick={() => setSelectedCraftTab('ceramics')}
                  className={`px-4 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                    selectedCraftTab === 'ceramics'
                      ? 'bg-[#466557] text-white'
                      : 'bg-[#efeeeb] text-[#1a1c1a] hover:bg-[#e9e8e5]'
                  }`}
                >
                  Ceramics
                </button>
                <button
                  onClick={() => setSelectedCraftTab('lighting')}
                  className={`px-4 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                    selectedCraftTab === 'lighting'
                      ? 'bg-[#466557] text-white'
                      : 'bg-[#efeeeb] text-[#1a1c1a] hover:bg-[#e9e8e5]'
                  }`}
                >
                  Lighting
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((p, idx) => {
                const badges: Array<{ badge: string; type: 'new' | 'bestseller' | 'botanical' | 'limited' }> = [
                  { badge: 'New Season', type: 'new' },
                  { badge: 'Best Seller', type: 'bestseller' },
                  { badge: 'Botanical Craft', type: 'botanical' },
                  { badge: 'Limited Edition', type: 'limited' },
                ];
                const badgeInfo = badges[idx % badges.length];
                return (
                  <FurnitureProductCard
                    key={p.id}
                    product={p}
                    badge={badgeInfo.badge}
                    badgeType={badgeInfo.type}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 4. Craft & Artisan Editorial Spotlight ── */}
        <section className="w-full py-24 max-w-[1440px] mx-auto px-4 sm:px-8 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Visual Column with Overlapping Vignettes */}
            <div className="lg:col-span-6 relative">
              <div className="relative z-10 w-4/5 rounded-2xl overflow-hidden shadow-xl bg-[#efeeeb] aspect-[4/5]">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_DqZdw6N7LPq_x82-LzpQfRuJoJnHNi_GQAlwRpgb4n6U0BgRmwXXIPrxDwa_ztt1WTSJo7A7jlzcBEq_t6Ikc-93dAKW8yEHSDCTOQ1yIVyOtmu55M3G53wBRgxdXLNjyJOkhOPvPW5eaATRFcoQaf5QWPBrEllHOwCtNtAFNQf8DqPYx-mTyH7O-Ro4kYVBMy1xr5CHh67RTPCFsaapdHzO-BDnf75Ojssy65U"
                  alt="Ceramicist shaping wet earthenware on wheel"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Overlapping Inset Picture */}
              <div className="absolute -bottom-8 right-0 z-20 w-3/5 rounded-xl overflow-hidden shadow-2xl bg-[#e9e8e5] hidden sm:block aspect-square">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDD9H9XnQG8HJQh8P55nOJbFbEInSNspliYPDsfEVcsocbus8DynCL47wkKz4uVlgc5BlTKRZx-T40DJQbta9wpuNcnRNOnWkO17Id_feWDvdbxyVifzQchNKqq6CLmVrVh_fFoBGlhha5CLNVEzegWbEzMIIbOhgXz6n6cq5-Z3VguI2xKl0g6PU3BAkWmSkpaI1Gje2WkDJw0M7MlMyPQTf1OdmmNhSJFQxUucTI"
                  alt="Artisan carving solid walnut stool"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Decorative Guild Badge */}
              <div className="absolute top-8 right-8 z-20 bg-[#faf9f6]/95 backdrop-blur-md px-4 py-2.5 rounded-lg shadow-md hidden sm:flex items-center gap-3 border border-[#c4c7c7]/30">
                <Verified className="w-6 h-6 text-[#466557]" />
                <div>
                  <p className="text-[11px] font-bold text-[#040505] uppercase tracking-wider">
                    Guild Verified
                  </p>
                  <p className="text-[12px] text-[#747878]">Heritage Provenance</p>
                </div>
              </div>
            </div>

            {/* Story Narrative Column */}
            <div className="lg:col-span-6 lg:pl-6 mt-8 lg:mt-0">
              <span className="text-[11px] font-semibold text-[#466557] uppercase tracking-widest block mb-2">
                Artisan Manifesto
              </span>
              <h2
                className="text-3xl sm:text-4xl text-[#040505] tracking-tight mb-6 leading-tight"
                style={{ fontFamily: 'var(--font-playfair, serif)' }}
              >
                Designed slowly.
                <br />
                Made to endure generations.
              </h2>
              <p className="text-base text-[#444748] mb-8 leading-relaxed">
                In an era of disposable velocity, we align with slow production cycles. Every bowl,
                luminaire, and textile is born from independent generational workshops across Oaxaca,
                Kyoto, and the Portuguese coast.
              </p>

              {/* Stats Bento Bar */}
              <div className="grid grid-cols-3 gap-4 mb-8 p-4 rounded-xl bg-[#f4f3f1] border border-[#e3e2e0]">
                <div className="flex flex-col">
                  <span
                    className="text-2xl font-semibold text-[#040505]"
                    style={{ fontFamily: 'var(--font-playfair, serif)' }}
                  >
                    100%
                  </span>
                  <span className="text-[12px] text-[#444748]">Traceable Origin</span>
                </div>
                <div className="flex flex-col">
                  <span
                    className="text-2xl font-semibold text-[#040505]"
                    style={{ fontFamily: 'var(--font-playfair, serif)' }}
                  >
                    Net 0
                  </span>
                  <span className="text-[12px] text-[#444748]">Carbon Logistics</span>
                </div>
                <div className="flex flex-col">
                  <span
                    className="text-2xl font-semibold text-[#040505]"
                    style={{ fontFamily: 'var(--font-playfair, serif)' }}
                  >
                    24
                  </span>
                  <span className="text-[12px] text-[#444748]">Guild Cooperatives</span>
                </div>
              </div>

              {/* Pull Quote */}
              <blockquote className="bg-[#ffffff] p-6 rounded-xl shadow-sm mb-8 relative border border-[#e3e2e0]">
                <span
                  className="text-4xl text-[#466557]/20 absolute -top-2 left-4 select-none font-serif"
                >
                  “
                </span>
                <p
                  className="text-[16px] text-[#040505] italic mb-3 relative z-10 leading-relaxed"
                  style={{ fontFamily: 'var(--font-playfair, serif)' }}
                >
                  “We don’t manufacture objects. We preserve relationships between human touch, raw
                  geological material, and living space.”
                </p>
                <cite className="text-[11px] text-[#444748] not-italic uppercase tracking-wider block">
                  — Hiroshi Yamagata, Principal Curation Director
                </cite>
              </blockquote>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-[#466557] text-[13px] font-semibold hover:text-[#040505] transition-colors group"
              >
                Discover Our Artisans & Workshops
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── 5. Interactive Sanctuary / Shoppable Lookbook ── */}
        <section className="w-full py-20 bg-[#e9e8e5]/60 border-y border-[#e3e2e0]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-[11px] font-semibold text-[#466557] uppercase tracking-widest block mb-1">
                  Interactive Sanctuary
                </span>
                <h2
                  className="text-3xl sm:text-4xl text-[#040505] tracking-tight"
                  style={{ fontFamily: 'var(--font-playfair, serif)' }}
                >
                  The Kyoto Pavillion Residence
                </h2>
              </div>
              <p className="text-[14px] text-[#444748] max-w-sm leading-relaxed">
                Tap active markers within the scene to reveal integrated artifacts, dimensions, and
                instant ordering details.
              </p>
            </div>

            {/* Hotspot Scene Canvas */}
            <div className="relative w-full rounded-2xl overflow-hidden shadow-xl bg-[#efeeeb] aspect-[16/9] max-h-[720px]">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1Q3GoBsDV9P_67DZiNEZPfgV-DWLFak89WWA7-SX63Hu1CHaTvUCBOTZP-FXcpZrxdHUShnGx-1tY3Qe9bjSOSA-i1qnlvCy5pdB-ihHuHobhuKIW7z8OpW3g4hOgWfqAHKs28j6gJTgScYlJEWlUXnTe6Q2q_bow9e1Vk8PZ8FI9vIwpbA5ekNrxeXp6OugZzR4xumKGtI9KuqHA7JZnpxv3WXpwCwiXQYWP88Q"
                alt="Kyoto Pavilion Residence Living Room Scene"
                fill
                className="object-cover"
              />

              {/* Pin 1: Fluted Vase */}
              <div className="absolute top-[38%] left-[28%] z-20 group">
                <button
                  type="button"
                  aria-label="View Terracotta Vessel"
                  onClick={() => setActiveHotspot(activeHotspot === 1 ? null : 1)}
                  className="relative w-8 h-8 rounded-full bg-[#040505] text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-125 focus:outline-none"
                >
                  <Plus className="w-4 h-4" />
                  <span className="absolute inset-0 rounded-full bg-[#040505]/40 animate-ping" />
                </button>
                <div
                  className={`absolute left-10 top-1/2 -translate-y-1/2 w-64 bg-[#ffffff] p-4 rounded-xl shadow-2xl transition-all duration-300 border border-[#e3e2e0] ${
                    activeHotspot === 1
                      ? 'opacity-100 pointer-events-auto'
                      : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transform group-hover:translate-x-1'
                  }`}
                >
                  <p className="text-[10px] font-semibold text-[#466557] uppercase tracking-wider">
                    Ceramics
                  </p>
                  <p
                    className="text-[15px] text-[#040505] font-semibold mb-0.5"
                    style={{ fontFamily: 'var(--font-playfair, serif)' }}
                  >
                    Tsuchi Raw Fluted Vase
                  </p>
                  <p className="text-[12px] text-[#444748] mb-3">$195 • Hand-turned stoneware</p>
                  <Link
                    href="/products?category=ceramics"
                    className="text-xs font-semibold text-[#040505] underline hover:text-[#466557]"
                  >
                    View Specifications &rarr;
                  </Link>
                </div>
              </div>

              {/* Pin 2: Bronze Floor Lamp */}
              <div className="absolute top-[52%] left-[64%] z-20 group">
                <button
                  type="button"
                  aria-label="View Bronze Lamp"
                  onClick={() => setActiveHotspot(activeHotspot === 2 ? null : 2)}
                  className="relative w-8 h-8 rounded-full bg-[#040505] text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-125 focus:outline-none"
                >
                  <Plus className="w-4 h-4" />
                  <span className="absolute inset-0 rounded-full bg-[#040505]/40 animate-ping" />
                </button>
                <div
                  className={`absolute right-10 top-1/2 -translate-y-1/2 w-64 bg-[#ffffff] p-4 rounded-xl shadow-2xl transition-all duration-300 border border-[#e3e2e0] ${
                    activeHotspot === 2
                      ? 'opacity-100 pointer-events-auto'
                      : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transform group-hover:-translate-x-1'
                  }`}
                >
                  <p className="text-[10px] font-semibold text-[#466557] uppercase tracking-wider">
                    Illumination
                  </p>
                  <p
                    className="text-[15px] text-[#040505] font-semibold mb-0.5"
                    style={{ fontFamily: 'var(--font-playfair, serif)' }}
                  >
                    Sol Cast Bronze Floor Lamp
                  </p>
                  <p className="text-[12px] text-[#444748] mb-3">
                    $520 • Dimmable 2700K warm LED
                  </p>
                  <Link
                    href="/products?category=lighting"
                    className="text-xs font-semibold text-[#040505] underline hover:text-[#466557]"
                  >
                    View Specifications &rarr;
                  </Link>
                </div>
              </div>

              {/* Pin 3: Linen Bench Cushion */}
              <div className="absolute top-[72%] left-[42%] z-20 group">
                <button
                  type="button"
                  aria-label="View Linen Cushion"
                  onClick={() => setActiveHotspot(activeHotspot === 3 ? null : 3)}
                  className="relative w-8 h-8 rounded-full bg-[#040505] text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-125 focus:outline-none"
                >
                  <Plus className="w-4 h-4" />
                  <span className="absolute inset-0 rounded-full bg-[#040505]/40 animate-ping" />
                </button>
                <div
                  className={`absolute bottom-10 left-1/2 -translate-x-1/2 w-64 bg-[#ffffff] p-4 rounded-xl shadow-2xl transition-all duration-300 border border-[#e3e2e0] ${
                    activeHotspot === 3
                      ? 'opacity-100 pointer-events-auto'
                      : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'
                  }`}
                >
                  <p className="text-[10px] font-semibold text-[#466557] uppercase tracking-wider">
                    Living Textile
                  </p>
                  <p
                    className="text-[15px] text-[#040505] font-semibold mb-0.5"
                    style={{ fontFamily: 'var(--font-playfair, serif)' }}
                  >
                    Sora Heavyweight Linen Pad
                  </p>
                  <p className="text-[12px] text-[#444748] mb-3">
                    $140 • Organic stone-washed flax
                  </p>
                  <Link
                    href="/products?category=furniture"
                    className="text-xs font-semibold text-[#040505] underline hover:text-[#466557]"
                  >
                    View Specifications &rarr;
                  </Link>
                </div>
              </div>

              {/* Bottom Scene Specifications Bar */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#040505]/85 via-[#040505]/50 to-transparent p-6 text-white flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-[#e5e2e1]">
                    Location Archive 04
                  </span>
                  <span className="text-[13px] text-[#faf9f6]/90 hidden sm:inline">
                    Higashiyama Ward, Kyoto • Curated by Studio AURA
                  </span>
                </div>
                <Link
                  href="/products"
                  className="text-[13px] font-medium text-white hover:text-[#c5e7d6] transition-colors flex items-center gap-1.5"
                >
                  Shop Full Kyoto Scene (6 Pieces)
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. Customer Reviews & Press Ticker ── */}
        <section className="w-full py-20 max-w-[1440px] mx-auto px-4 sm:px-8">
          {/* Press Quotes */}
          <div className="mb-16 text-center">
            <p className="text-[11px] font-semibold text-[#747878] uppercase tracking-widest mb-8">
              Critical Acclaim & Endorsements
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-[#f4f3f1] flex flex-col justify-between border border-[#e3e2e0]">
                <p
                  className="text-[16px] text-[#040505] mb-4 italic leading-relaxed"
                  style={{ fontFamily: 'var(--font-playfair, serif)' }}
                >
                  “A transformative voice in sustainable luxury. AURA proves that minimalism can
                  vibrate with visceral soul.”
                </p>
                <span className="text-[11px] font-bold text-[#466557] tracking-widest uppercase">
                  Architectural Digest
                </span>
              </div>
              <div className="p-6 rounded-xl bg-[#f4f3f1] flex flex-col justify-between border border-[#e3e2e0]">
                <p
                  className="text-[16px] text-[#040505] mb-4 italic leading-relaxed"
                  style={{ fontFamily: 'var(--font-playfair, serif)' }}
                >
                  “Each piece possesses museum-grade tactile dignity. Our favorite home goods
                  discovery of the decade.”
                </p>
                <span className="text-[11px] font-bold text-[#466557] tracking-widest uppercase">
                  Vogue Living
                </span>
              </div>
              <div className="p-6 rounded-xl bg-[#f4f3f1] flex flex-col justify-between border border-[#e3e2e0]">
                <p
                  className="text-[16px] text-[#040505] mb-4 italic leading-relaxed"
                  style={{ fontFamily: 'var(--font-playfair, serif)' }}
                >
                  “Unrivaled craftsmanship standards with a transparent carbon commitment we wish all
                  brands practiced.”
                </p>
                <span className="text-[11px] font-bold text-[#466557] tracking-widest uppercase">
                  Elle Decoration International
                </span>
              </div>
            </div>
          </div>

          {/* Patron Testimonials */}
          <div className="p-8 sm:p-12 bg-[#ffffff] rounded-2xl shadow-sm border border-[#e3e2e0]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <span className="text-[11px] font-semibold text-[#466557] uppercase tracking-widest block mb-1">
                  Patron Impressions
                </span>
                <h3
                  className="text-2xl text-[#040505]"
                  style={{ fontFamily: 'var(--font-playfair, serif)' }}
                >
                  Voices from the Sanctuary
                </h3>
              </div>
              <div className="flex items-center gap-1 text-[#D4A373]">
                <Star className="w-5 h-5 fill-[#D4A373]" />
                <Star className="w-5 h-5 fill-[#D4A373]" />
                <Star className="w-5 h-5 fill-[#D4A373]" />
                <Star className="w-5 h-5 fill-[#D4A373]" />
                <Star className="w-5 h-5 fill-[#D4A373]" />
                <span className="text-[14px] text-[#040505] font-bold ml-1.5">4.96 / 5.0</span>
                <span className="text-[12px] text-[#747878] ml-1">(2,840 Verified Orders)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-[#f4f3f1] border border-[#e3e2e0]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[14px] font-semibold text-[#040505]">Clara Sterling</span>
                  <span className="text-[10px] font-bold text-[#466557] uppercase tracking-wider">
                    Verified Collector
                  </span>
                </div>
                <p className="text-[14px] text-[#444748] mb-3 leading-relaxed">
                  “The Oaxaca Terracotta Vessel arrived in 100% biodegradable fiber packaging. The raw
                  texture on the clay surface catches early morning sunlight on our dining credenza like
                  fine sculpture.”
                </p>
                <span className="text-[12px] text-[#747878]">Purchased Oaxaca Vessel • London, UK</span>
              </div>

              <div className="p-6 rounded-xl bg-[#f4f3f1] border border-[#e3e2e0]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[14px] font-semibold text-[#040505]">Julian Thorne</span>
                  <span className="text-[10px] font-bold text-[#466557] uppercase tracking-wider">
                    Verified Collector
                  </span>
                </div>
                <p className="text-[14px] text-[#444748] mb-3 leading-relaxed">
                  “The Arco Cast Lamp provides the absolute softest ambient glow I have ever
                  experienced. You can literally sense the weight and integrity of the recycled
                  sand-cast aluminum.”
                </p>
                <span className="text-[12px] text-[#747878]">
                  Purchased Arco Aluminum Lamp • San Francisco, CA
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. Perks Bar ── */}
        <section className="w-full bg-[#efeeeb] py-12 border-t border-[#e3e2e0]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#ffffff] flex items-center justify-center text-[#466557] shadow-sm flex-shrink-0 border border-[#e3e2e0]">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-[14px] font-semibold text-[#040505] mb-1">
                    Carbon Neutral Delivery
                  </h4>
                  <p className="text-[13px] text-[#444748] leading-relaxed">
                    Fully offset courier routing with zero single-use plastics.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#ffffff] flex items-center justify-center text-[#466557] shadow-sm flex-shrink-0 border border-[#e3e2e0]">
                  <HomeIcon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-[14px] font-semibold text-[#040505] mb-1">
                    30-Day In-Home Trial
                  </h4>
                  <p className="text-[13px] text-[#444748] leading-relaxed">
                    Experience tactile quality within your own living architecture.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#ffffff] flex items-center justify-center text-[#466557] shadow-sm flex-shrink-0 border border-[#e3e2e0]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-[14px] font-semibold text-[#040505] mb-1">
                    Lifetime Craft Warranty
                  </h4>
                  <p className="text-[13px] text-[#444748] leading-relaxed">
                    Enduring joinery and structural integrity guaranteed.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#ffffff] flex items-center justify-center text-[#466557] shadow-sm flex-shrink-0 border border-[#e3e2e0]">
                  <Headphones className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-[14px] font-semibold text-[#040505] mb-1">
                    Private Concierge
                  </h4>
                  <p className="text-[13px] text-[#444748] leading-relaxed">
                    Dedicated curation assistance and custom guild inquiries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <FurnitureFooter />
    </div>
  );
}
