'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import TechnoHeader from './Header';
import TechnoFooter from './Footer';
import TechnoProductCard from './ProductCard';
import type { HomePageProps } from '@/templates';
import type { Product } from '@/lib/api/types';
import { useCurrency } from '@/hooks/useCurrency';
import {
  Heart,
  ShoppingBag,
  ArrowRight,
  Leaf,
  Users,
  ShieldCheck,
  Truck,
  Sparkles,
  MapPin,
  Star,
  BookOpen,
  Compass,
} from 'lucide-react';

export default function TechnoHomePage({
  theme,
  products,
  collections,
  categories,
}: HomePageProps) {
  const { formatPrice } = useCurrency();
  const [selectedCraftTab, setSelectedCraftTab] = useState('all');

  // Filter products by selected craft category tab
  const displayProducts =
    selectedCraftTab === 'all'
      ? products.slice(0, 8)
      : products
          .filter((p) => {
            const cat = (p.categoryName || p.category || '').toLowerCase();
            const name = (p.name || '').toLowerCase();
            return cat.includes(selectedCraftTab) || name.includes(selectedCraftTab);
          })
          .slice(0, 8);

  const craftCategories = [
    {
      id: 'ceramics',
      name: 'Ceramics & Pottery',
      count: '340+ pieces',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800&auto=format&fit=crop',
      tag: 'Hand-thrown Stoneware',
    },
    {
      id: 'textiles',
      name: 'Woven Textiles',
      count: '210+ pieces',
      image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=800&auto=format&fit=crop',
      tag: 'Organic Linen & Wool',
    },
    {
      id: 'woodwork',
      name: 'Carved Woodcraft',
      count: '180+ pieces',
      image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=800&auto=format&fit=crop',
      tag: 'Sustainable Walnut & Oak',
    },
    {
      id: 'jewelry',
      name: 'Fine Studio Jewelry',
      count: '145+ pieces',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
      tag: 'Recycled Silver & Brass',
    },
    {
      id: 'botanical',
      name: 'Apothecary & Scents',
      count: '95+ pieces',
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop',
      tag: 'Pure Soy & Essential Oils',
    },
  ];

  const featuredStories = [
    {
      title: 'The Art of the Pit Fire: How Smoke Breathes Color into Clay',
      maker: 'Elena Vance · Asheville, NC',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=800&auto=format&fit=crop',
      category: 'Pottery Heritage',
    },
    {
      title: 'Reviving Ancient Loom Techniques in the Blue Ridge Mountains',
      maker: 'Marcus Lind · Portland, OR',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=800&auto=format&fit=crop',
      category: 'Slow Textiles',
    },
    {
      title: 'Carving with the Grain: Why Japanese Hand Planes Outperform Machines',
      maker: 'Aoi Takahashi · Kyoto, Japan',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=800&auto=format&fit=crop',
      category: 'Woodworking',
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col antialiased bg-[#FFFBF5] text-[#1C1917]"
      style={{ fontFamily: "'Open Sans', sans-serif" }}
    >
      <TechnoHeader />

      <main className="flex-1 space-y-20 sm:space-y-28 pb-20">
        {/* ── 1. Hero Section: Warm, Spacious, Maker Storytelling ─────────── */}
        <section className="relative w-full border-b border-[#E7E5E4] bg-[#FAF6F0] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Narrative Headline & CTAs */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#DCFCE7] text-[#166534] border border-[#365314]/20 text-[11px] font-bold uppercase tracking-wider">
                  <Leaf className="w-3.5 h-3.5 text-[#365314]" />
                  <span>Direct From Independent Ateliers</span>
                </div>

                <h1
                  className="text-4xl sm:text-5xl lg:text-[54px] font-bold text-[#1C1917] leading-[1.15] tracking-[0.01em]"
                  style={{ fontFamily: "'Lora', serif" }}
                >
                  Every object carries the warmth of human hands.
                </h1>

                <p className="text-[17px] sm:text-[18px] text-[#57534E] leading-[1.6] max-w-xl">
                  Discover small-batch ceramics, handwoven textiles, and heirloom woodcraft
                  crafted by independent artisans worldwide. No factories, no shortcuts.
                </p>

                {/* CTAs per design.md (Terracotta Primary + Outline Secondary) */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href="/products"
                    className="h-[50px] px-8 rounded-[4px] bg-[#C2410C] hover:bg-[#9A3412] active:bg-[#7C2D12] text-white text-[15px] font-semibold transition-colors flex items-center justify-center gap-2 border border-[#C2410C]"
                  >
                    <span>Explore Handmade Goods</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/collections"
                    className="h-[50px] px-8 rounded-[4px] bg-transparent hover:bg-[#FDF6EC] text-[#C2410C] border-[1.5px] border-[#C2410C] text-[15px] font-semibold transition-colors flex items-center justify-center"
                  >
                    Curated Collections
                  </Link>
                </div>

                {/* Micro trust provenance */}
                <div className="pt-6 border-t border-[#E7E5E4] flex items-center gap-8 text-[13px] text-[#57534E]">
                  <div>
                    <span
                      className="block text-[20px] font-bold text-[#1C1917]"
                      style={{ fontFamily: "'Source Code Pro', monospace" }}
                    >
                      1,200+
                    </span>
                    <span>Verified Makers</span>
                  </div>
                  <div className="w-[1px] h-8 bg-[#E7E5E4]" />
                  <div>
                    <span
                      className="block text-[20px] font-bold text-[#1C1917]"
                      style={{ fontFamily: "'Source Code Pro', monospace" }}
                    >
                      100%
                    </span>
                    <span>Natural Materials</span>
                  </div>
                  <div className="w-[1px] h-8 bg-[#E7E5E4]" />
                  <div>
                    <span
                      className="block text-[20px] font-bold text-[#1C1917]"
                      style={{ fontFamily: "'Source Code Pro', monospace" }}
                    >
                      4.9 / 5
                    </span>
                    <span>Artisan Trust Score</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Natural Light Hero Imagery (Flat, warm border) */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-[8px] overflow-hidden border border-[#D6D3D1] bg-white p-2">
                  <div className="relative aspect-[4/5] rounded-[6px] overflow-hidden bg-[#FAF6F0]">
                    <Image
                      src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=1200&auto=format&fit=crop"
                      alt="Artisan shaping stoneware clay on pottery wheel"
                      fill
                      priority
                      className="object-cover"
                    />
                  </div>

                  {/* Featured Studio Tag */}
                  <div className="p-4 bg-white flex items-center justify-between border-t border-[#E7E5E4] mt-2">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                        alt="Elena Vance"
                        className="w-10 h-10 rounded-full object-cover border border-[#D6D3D1]"
                      />
                      <div>
                        <p className="text-[14px] font-semibold text-[#1C1917]">
                          Elena Vance Studio
                        </p>
                        <p className="text-[12px] text-[#A8A29E] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#D4A373]" /> Asheville, North Carolina
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#365314] bg-[#DCFCE7] px-2.5 py-1 rounded-[4px] border border-[#365314]/20">
                      Master Ceramist
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. Explore By Craft Category (Warm Cards, Forest Green Overline) ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#365314]">
                AUTHENTIC DISCIPLINES
              </span>
              <h2
                className="text-3xl sm:text-4xl font-semibold text-[#1C1917] tracking-[0.005em]"
                style={{ fontFamily: "'Lora', serif" }}
              >
                Shop by Craft Tradition
              </h2>
            </div>
            <Link
              href="/products"
              className="text-[14px] font-semibold text-[#C2410C] hover:text-[#9A3412] flex items-center gap-1.5 transition-colors"
            >
              <span>View all disciplines</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {craftCategories.map((craft) => (
              <Link
                key={craft.id}
                href={`/products?category=${craft.id}`}
                className="group flex flex-col bg-white rounded-[8px] border border-[#E7E5E4] hover:border-[#D6D3D1] transition-colors overflow-hidden"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF6F0] border-b border-[#E7E5E4]">
                  <Image
                    src={craft.image}
                    alt={craft.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#365314] block">
                      {craft.tag}
                    </span>
                    <h3
                      className="text-[15px] font-semibold text-[#1C1917] group-hover:text-[#C2410C] transition-colors mt-0.5"
                      style={{ fontFamily: "'Lora', serif" }}
                    >
                      {craft.name}
                    </h3>
                  </div>
                  <span className="text-[12px] text-[#A8A29E] mt-2 block">
                    {craft.count}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 3. Featured Products Grid (Tabbed Filter Chips) ─────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#365314]">
                HANDPICKED SMALL-BATCH PIECES
              </span>
              <h2
                className="text-3xl sm:text-4xl font-semibold text-[#1C1917]"
                style={{ fontFamily: "'Lora', serif" }}
              >
                Featured Works of Craft
              </h2>
            </div>

            {/* Filter Chips per design.md (h-8, px-3.5, rounded-4px, border-1px #D6D3D1, hover:bg-[#FDF6EC]) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {[
                { id: 'all', label: 'All Disciplines' },
                { id: 'ceramics', label: 'Ceramics' },
                { id: 'textiles', label: 'Textiles' },
                { id: 'woodwork', label: 'Woodwork' },
                { id: 'jewelry', label: 'Jewelry' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCraftTab(tab.id)}
                  className={`h-8 px-3.5 rounded-[4px] text-[13px] font-medium transition-colors flex-shrink-0 ${
                    selectedCraftTab === tab.id
                      ? 'bg-[#C2410C] text-white border border-[#C2410C]'
                      : 'bg-white text-[#57534E] border border-[#D6D3D1] hover:bg-[#FDF6EC]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <TechnoProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center pt-10">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 h-[46px] px-8 rounded-[4px] border-[1.5px] border-[#C2410C] text-[#C2410C] hover:bg-[#FDF6EC] text-[14px] font-semibold transition-colors"
            >
              <span>Explore All {products.length} Artisan Creations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ── 4. Meet The Maker / Atelier Story Spotlight (Spacious & Narrative) ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[12px] bg-[#FAF6F0] border-2 border-[#D6D3D1] p-8 sm:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Studio imagery grid */}
              <div className="lg:col-span-6 grid grid-cols-2 gap-4">
                <div className="relative aspect-[3/4] rounded-[8px] overflow-hidden border border-[#D6D3D1] bg-white">
                  <Image
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop"
                    alt="Elena Vance in her ceramic studio"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <div className="relative aspect-square rounded-[8px] overflow-hidden border border-[#D6D3D1] bg-white">
                    <Image
                      src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800&auto=format&fit=crop"
                      alt="Hand-glazed stoneware bowls on drying rack"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 rounded-[8px] bg-white border border-[#E7E5E4]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#365314] block">
                      Kiln Firing Technique
                    </span>
                    <p className="text-[13px] text-[#57534E] mt-1">
                      High-fire reduction at cone 10 creates non-porous, dishwasher-safe heirloom stoneware.
                    </p>
                  </div>
                </div>
              </div>

              {/* Story Narrative Content */}
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#C2410C]">
                    FEATURED ATELIER SPOTLIGHT
                  </span>
                  <span className="text-[#D6D3D1]">·</span>
                  <span className="text-[12px] text-[#57534E] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#D4A373]" /> Asheville, NC
                  </span>
                </div>

                <h3
                  className="text-3xl sm:text-4xl font-semibold text-[#1C1917] leading-snug"
                  style={{ fontFamily: "'Lora', serif" }}
                >
                  "In a disposable world, slow craft is an act of deep mindfulness."
                </h3>

                <p className="text-[16px] text-[#57534E] leading-[1.6]">
                  Elena Vance has been throwing clay in the Blue Ridge Mountains for over fifteen
                  years. Every bowl, mug, and vase is pulled from raw regional clay and glazed with
                  minerals collected by hand along mountain stream beds.
                </p>

                <div className="p-4 rounded-[8px] bg-white border border-[#E7E5E4] flex items-center justify-between">
                  <div>
                    <h4 className="text-[15px] font-bold text-[#1C1917]">Terra & Pine Studio</h4>
                    <p className="text-[12px] text-[#A8A29E]">Joined MarketNest 2021 · 4.98 Rating (520+ Reviews)</p>
                  </div>
                  <Link
                    href="/products?category=ceramics"
                    className="h-[38px] px-4 rounded-[4px] bg-[#C2410C] hover:bg-[#9A3412] text-white text-[13px] font-semibold flex items-center justify-center transition-colors"
                  >
                    View Studio
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. Curated Story Collections (Double Editorial Banners) ─────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Banner 1: Slow Morning Rituals */}
            <div className="relative rounded-[12px] overflow-hidden border border-[#D6D3D1] bg-[#FAF6F0] p-8 sm:p-10 flex flex-col justify-between min-h-[380px]">
              <div className="relative z-10 space-y-3 max-w-md">
                <span className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#365314]">
                  CURATED CAPSULE
                </span>
                <h3
                  className="text-2xl sm:text-3xl font-semibold text-[#1C1917]"
                  style={{ fontFamily: "'Lora', serif" }}
                >
                  The Slow Morning Tea & Coffee Ritual
                </h3>
                <p className="text-[14px] text-[#57534E] leading-relaxed">
                  Ceramic pour-overs, linen coffee filters, and heavy stoneware mugs designed to
                  bring peace to your first hour of the day.
                </p>
              </div>

              <div className="relative z-10 pt-6">
                <Link
                  href="/products?category=ceramics"
                  className="inline-flex items-center gap-2 h-[42px] px-6 rounded-[4px] bg-[#1C1917] hover:bg-[#292524] text-white text-[13px] font-semibold transition-colors"
                >
                  <span>Shop The Capsule</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Banner 2: Handwoven Living */}
            <div className="relative rounded-[12px] overflow-hidden border border-[#D6D3D1] bg-[#FAF6F0] p-8 sm:p-10 flex flex-col justify-between min-h-[380px]">
              <div className="relative z-10 space-y-3 max-w-md">
                <span className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#365314]">
                  AUTUMN HEARTH
                </span>
                <h3
                  className="text-2xl sm:text-3xl font-semibold text-[#1C1917]"
                  style={{ fontFamily: "'Lora', serif" }}
                >
                  Heirloom Wool Throws & Woven Linens
                </h3>
                <p className="text-[14px] text-[#57534E] leading-relaxed">
                  Pure un-dyed virgin wool blankets handwoven on traditional pedal looms by master
                  weavers in Oaxaca and Kyoto.
                </p>
              </div>

              <div className="relative z-10 pt-6">
                <Link
                  href="/products?category=textiles"
                  className="inline-flex items-center gap-2 h-[42px] px-6 rounded-[4px] bg-[#1C1917] hover:bg-[#292524] text-white text-[13px] font-semibold transition-colors"
                >
                  <span>Shop Woven Living</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. Workshop Journal: Stories Behind The Craft ────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#365314]">
                STORIES FROM THE ATELIER
              </span>
              <h2
                className="text-3xl sm:text-4xl font-semibold text-[#1C1917]"
                style={{ fontFamily: "'Lora', serif" }}
              >
                The Artisan Journal
              </h2>
            </div>
            <Link
              href="/journal"
              className="text-[14px] font-semibold text-[#C2410C] hover:text-[#9A3412] flex items-center gap-1.5 transition-colors"
            >
              <span>Read all essays</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredStories.map((story, idx) => (
              <article
                key={idx}
                className="group flex flex-col bg-white rounded-[8px] border border-[#E7E5E4] hover:border-[#D6D3D1] transition-colors overflow-hidden"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#FAF6F0] border-b border-[#E7E5E4]">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#A8A29E]">
                      <span className="font-semibold uppercase tracking-wider text-[#365314]">
                        {story.category}
                      </span>
                      <span>{story.readTime}</span>
                    </div>
                    <h3
                      className="text-[18px] font-semibold text-[#1C1917] group-hover:text-[#C2410C] transition-colors leading-snug"
                      style={{ fontFamily: "'Lora', serif" }}
                    >
                      {story.title}
                    </h3>
                  </div>

                  <p className="text-[12px] text-[#57534E] pt-2 border-t border-[#F5F5F4]">
                    By {story.maker}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── 7. Artisan Invitation Callout (Join MarketNest) ───────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[12px] bg-[#292524] text-white p-8 sm:p-12 lg:p-14 border border-[#44403C] flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4A373]">
                OPEN CALL FOR MAKERS
              </span>
              <h3
                className="text-3xl sm:text-4xl font-semibold text-white"
                style={{ fontFamily: "'Lora', serif" }}
              >
                Are you an independent craftsperson or studio artist?
              </h3>
              <p className="text-[15px] text-[#D6D3D1] leading-relaxed">
                We believe makers should spend their days creating, not fighting marketplace algorithms.
                MarketNest provides direct seller storefronts, fair trade payouts, and a community
                that treasures genuine craftsmanship.
              </p>
            </div>

            <div className="flex-shrink-0">
              <Link
                href="/sell"
                className="h-[50px] px-8 rounded-[4px] bg-[#C2410C] hover:bg-[#9A3412] active:bg-[#7C2D12] text-white text-[15px] font-semibold transition-colors flex items-center justify-center border border-[#C2410C]"
              >
                Apply to Sell Your Craft
              </Link>
            </div>
          </div>
        </section>
      </main>

      <TechnoFooter />
    </div>
  );
}
