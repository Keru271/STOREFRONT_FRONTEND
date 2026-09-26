'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PawzyHeader from './Header';
import PawzyFooter from './Footer';
import PawzyProductCard from './ProductCard';
import type { HomePageProps } from '@/templates';
import type { Product } from '@/lib/api/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/hooks/useCurrency';
import {
  Heart,
  ShoppingBag,
  Star,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Award,
  Scissors,
  PhoneCall,
  User,
  Send,
  HelpCircle,
  ChevronRight,
  Check,
} from 'lucide-react';

function BirdLineIcon({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M26 14c-3-2-7-1-10 1-2 2-3 5-3 8 0 3 2 4 4 3 3-1 4-4 4-7" />
      <path d="M20 18c3-3 8-5 13-3 6 2 9 8 9 15 0 8-5 18-12 24l-2 10h-3l2-9c-6 3-12 4-18 4" />
      <circle cx="21" cy="17" r="1.5" fill="currentColor" />
      <path d="M29 25c4 1 9 4 9 10 0 7-6 13-12 15" />
      <path d="M31 31c3 2 6 5 6 9" />
      <path d="M32 37c2 2 4 4 4 7" />
      <path d="M12 49h40" strokeWidth="2.5" />
      <path d="M26 49v3" />
      <path d="M29 49v3" />
    </svg>
  );
}

function CatLineIcon({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 27 L16 16 L27 21 C29 20 35 20 37 21 L48 16 L46 27 C50 31 51 37 49 43 C47 49 41 52 32 52 C23 52 17 49 15 43 C13 37 14 31 18 27 Z" />
      <path d="M20 23 L18 19 L25 22" />
      <path d="M44 23 L46 19 L39 22" />
      <circle cx="25" cy="33" r="2" fill="currentColor" />
      <circle cx="39" cy="33" r="2" fill="currentColor" />
      <path d="M30 38 L34 38 L32 41 Z" fill="currentColor" />
      <path d="M32 41 C30 44 26 44 25 42" />
      <path d="M32 41 C34 44 38 44 39 42" />
      <path d="M21 35 L12 34" />
      <path d="M21 39 L12 40" />
      <path d="M43 35 L52 34" />
      <path d="M43 39 L52 40" />
      <path d="M20 52 C20 49 23 47 26 47 C29 47 30 49 30 52" />
      <path d="M34 52 C34 49 35 47 38 47 C41 47 44 49 44 52" />
      <path d="M23 49 v3" />
      <path d="M27 49 v3" />
      <path d="M37 49 v3" />
      <path d="M41 49 v3" />
    </svg>
  );
}

function DogLineIcon({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M24 23 C24 17 29 14 34 14 C37 14 41 16 43 19 L48 20 C50 20 51 22 50 24 C49 26 47 27 44 27 L41 27 C40 31 38 34 34 35" />
      <circle cx="48.5" cy="22" r="1.5" fill="currentColor" />
      <circle cx="36" cy="20" r="1.5" fill="currentColor" />
      <path d="M31 16 C27 16 25 19 25 24 C25 29 27 32 30 32 C33 32 34 29 34 25" />
      <path d="M27 34 C30 35 34 35 37 34" strokeWidth="3" />
      <path d="M36 36 C38 40 39 46 39 52 C39 54 37 54 35 54 C34 54 33 53 33 50 L33 42 L29 50 C29 53 28 54 26 54 C24 54 23 53 23 51 C23 46 25 40 27 36" />
      <path d="M27 34 C24 37 20 40 18 45 C16 50 18 54 22 54 L30 54" />
      <path d="M17 46 C12 44 11 39 13 36 C14 34 16 35 16 37" />
    </svg>
  );
}

function RabbitLineIcon({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M32 24 C30 18 29 10 32 6 C34 3 37 5 36 12 L35 22" />
      <path d="M36 22 C37 16 39 8 42 7 C44 6 46 9 44 15 L40 25" />
      <path d="M32 24 C29 24 26 26 24 29 C22 32 23 35 26 36 L34 36" />
      <circle cx="28" cy="29" r="1.5" fill="currentColor" />
      <path d="M34 26 C38 28 42 32 43 38 C44 44 43 49 40 52 C37 54 32 54 27 54 C23 54 20 53 20 50 C20 47 24 45 28 45 L34 45" />
      <path d="M29 36 C28 40 26 44 24 48 C23 50 25 51 27 51" />
      <circle cx="44" cy="46" r="3.5" />
    </svg>
  );
}

function FishLineIcon({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M46 22 C38 25 30 23 20 28 C12 32 12 38 20 42 C30 47 38 45 46 48 L52 52 L50 35 L52 18 Z" />
      <circle cx="20" cy="33" r="2" fill="currentColor" />
      <path d="M14 34 C12 35 12 36 14 36" />
      <path d="M25 29 C27 33 27 37 25 41" />
      <path d="M32 25 C34 20 38 18 42 19" />
      <path d="M32 45 C34 50 38 52 42 51" />
      <path d="M33 32 C35 34 35 37 33 39" />
      <path d="M38 31 C40 33 40 37 38 39" />
    </svg>
  );
}

function HamsterLineIcon({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="22" cy="18" r="6" />
      <circle cx="42" cy="18" r="6" />
      <path d="M22 18 C22 16 24 15 25 17" />
      <path d="M42 18 C42 16 40 15 39 17" />
      <path d="M25 22 C27 21 37 21 39 22 C45 24 49 30 48 37 C47 45 43 53 32 53 C21 53 17 45 16 37 C15 30 19 24 25 22 Z" />
      <circle cx="25" cy="30" r="2.5" fill="currentColor" />
      <circle cx="39" cy="30" r="2.5" fill="currentColor" />
      <path d="M30 34 L34 34 L32 36 Z" fill="currentColor" />
      <path d="M32 36 C30 38 27 38 26 36" />
      <path d="M32 36 C34 38 37 38 38 36" />
      <path d="M20 33 L11 32" />
      <path d="M20 37 L12 39" />
      <path d="M44 33 L53 32" />
      <path d="M44 37 L52 39" />
      <path d="M26 44 C26 41 29 40 31 42 C31 45 28 46 26 44 Z" />
      <path d="M38 44 C38 41 35 40 33 42 C33 45 36 46 38 44 Z" />
    </svg>
  );
}

const PET_CATEGORIES = [
  {
    name: 'Birds',
    query: 'birds',
    Icon: BirdLineIcon,
    blobShape: 'rounded-[50%_50%_40%_60%/60%_40%_60%_40%]',
  },
  {
    name: 'Cats',
    query: 'cats',
    Icon: CatLineIcon,
    blobShape: 'rounded-[60%_40%_50%_50%/50%_60%_40%_50%]',
  },
  {
    name: 'Dogs',
    query: 'dogs',
    Icon: DogLineIcon,
    blobShape: 'rounded-[40%_60%_60%_40%/50%_50%_60%_40%]',
  },
  {
    name: 'Rabbit',
    query: 'rabbit',
    Icon: RabbitLineIcon,
    blobShape: 'rounded-[50%_50%_40%_60%/40%_60%_50%_50%]',
  },
  {
    name: 'Fish',
    query: 'fish',
    Icon: FishLineIcon,
    blobShape: 'rounded-[60%_40%_50%_50%/50%_40%_60%_50%]',
  },
  {
    name: 'Hamster',
    query: 'hamster',
    Icon: HamsterLineIcon,
    blobShape: 'rounded-[40%_60%_50%_50%/60%_50%_40%_60%]',
  },
];

const SPLIT_CARE_TABS = [
  {
    title: 'Fun & Play',
    icon: '⚽',
    desc: "Bring joy to your pet's day with toys, games, and accessories designed for endless fun, active play, happy moments, and daily excitement.",
  },
  {
    title: 'Healthy Nutrition',
    icon: '🥣',
    desc: 'Biologically balanced raw formulas, vet-certified organic kibbles, and essential supplements formulated for longevity.',
  },
  {
    title: 'Daily Hygiene',
    icon: '🛁',
    desc: 'Gentle plant-based herbal shampoos, paw sanitation balms, and tear-free face wash for pristine grooming.',
  },
  {
    title: 'Comfortable Living',
    icon: '🛏️',
    desc: 'Orthopedic memory foam pet beds, self-warming fleece blankets, and cozy travel crates for deep restorative sleep.',
  },
];

const CARE_SERVICES = {
  left: [
    {
      icon: '🛁',
      title: 'Bathing & Grooming',
      desc: 'Plant-based herbal washes, coat styling, and gentle sanitation.',
    },
    {
      icon: '✂️',
      title: 'Haircut & Styling',
      desc: 'Professional breed-specific coat trimming and detangling styling.',
    },
    {
      icon: '🐕',
      title: 'Dog Walking',
      desc: 'Certified and bonded local walkers providing GPS-tracked exercise.',
    },
  ],
  right: [
    {
      icon: '🐾',
      title: 'Nail & Paw Care',
      desc: 'Gentle claw clipping, filing, and organic pad moisturizing balm.',
    },
    {
      icon: '🏠',
      title: 'Pet Hotel Stay',
      desc: 'Safe, climate-controlled play suites with 24/7 live webcams.',
    },
    {
      icon: '🩺',
      title: 'Health Checkup',
      desc: 'Personalized dietary consults and preventative health assessments.',
    },
  ],
};

const PAWZY_FAQS = [
  {
    question: 'What types of pets do you support?',
    answer: 'We offer a wide range of items for dogs, cats, small animals like rabbits and hamsters, birds, and even aquatic pets.',
  },
  {
    question: 'Do you offer grooming appointments?',
    answer: 'Yes! Our certified pet stylists offer herbal baths, nail trimming, coat de-shedding, and full spa sessions.',
  },
  {
    question: 'How long does shipping take?',
    answer: 'Standard domestic delivery arrives in 2–3 business days. We also offer 2-hour rush local delivery in select cities.',
  },
  {
    question: "Can I return a product if it doesn't fit my pet?",
    answer: 'Absolutely! We offer a 30-day hassle-free return and exchange guarantee on all gear and accessories.',
  },
  {
    question: 'Are your products vet-approved?',
    answer: 'Yes! All our organic recipes, raw diets, and wellness formulas are formulated and vetted by licensed veterinary nutritionists.',
  },
];

const SERVICE_PACKAGES = [
  {
    name: 'Grooming Package',
    icon: '🛁',
    price: 25,
    period: '/ session',
    desc: 'Ideal for routine refreshing, coat detangling, and gentle claw maintenance.',
    features: ['Herbal essential oil bath', 'Claw clipping & filing', 'Ear hygiene cleaning', 'Fluff dry & natural cologne'],
    highlight: false,
  },
  {
    name: 'Walking Package',
    icon: '🐕',
    price: 45,
    period: '/ week',
    desc: 'Daily active exercise and outdoor mental stimulation for energetic pets.',
    features: ['5 weekly 45-min GPS walks', 'Fresh hydration & post-walk treat', 'Paw cleaning before return', 'Daily photo & route report'],
    highlight: true,
  },
  {
    name: 'Care Package',
    icon: '🩺',
    price: 90,
    period: '/ checkup',
    desc: 'Comprehensive veterinary wellness screening and preventative health assessment.',
    features: ['Complete nose-to-tail exam', 'Dental & gum checkup', 'Vaccination booster review', 'Custom nutrition roadmap'],
    highlight: false,
  },
];

const BLOG_ARTICLES = [
  {
    id: 1,
    title: '10 Early Warning Signs of Food Allergies in Dogs',
    category: 'Dog Nutrition',
    date: 'Sep 24, 2026',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
    summary: 'Learn how to identify itching, digestive sensitivities, and ingredient triggers before they worsen.',
  },
  {
    id: 2,
    title: 'How to Successfully Socialize a Rescue Puppy in 30 Days',
    category: 'Training & Care',
    date: 'Sep 21, 2026',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80',
    summary: 'A step-by-step socialization protocol designed to build unshakable confidence and calm behavior.',
  },
  {
    id: 3,
    title: 'The Ultimate Indoor Cat Enrichment & Nutrition Guide',
    category: 'Feline Health',
    date: 'Sep 18, 2026',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    summary: 'Keep indoor cats mentally stimulated, physically active, and hydrated with raw moisture diets.',
  },
];

export default function PawzyHomePage({
  theme,
  products,
  collections,
  categories,
}: HomePageProps) {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Interactive Tabs & FAQ Accordion State
  const [activeCareTab, setActiveCareTab] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Interactive Appointment Form State
  const [apptService, setApptService] = useState('Full Grooming & Spa');
  const [apptPet, setApptPet] = useState('Dog');
  const [apptDate, setApptDate] = useState('');
  const [apptTime, setApptTime] = useState('10:00 AM');
  const [apptNotes, setApptNotes] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooked(true);
    setTimeout(() => {
      setIsBooked(false);
      setApptNotes('');
      setApptDate('');
    }, 4500);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setTimeout(() => {
        setNewsletterSubscribed(false);
        setNewsletterEmail('');
      }, 4000);
    }
  };

  // Curate products for Favorites & Bestsellers
  const favoritesList = products.slice(0, 4);
  const bestSellersList = products.slice(4, 8).length >= 4 ? products.slice(4, 8) : products.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white dark:bg-[#0c121e] text-slate-800 dark:text-slate-100 antialiased selection:bg-amber-300 selection:text-slate-900">
      <PawzyHeader />

      <main className="flex-1">
        {/* ── 1. Hero Section (Pastel Cyan Banner with Food Pack & Smiling Dog) ── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#d9f4f8] via-[#e6f8fa] to-[#f4fcfe] dark:from-[#0d232a] dark:via-[#091a20] dark:to-[#0c121e] py-14 lg:py-20 border-b border-sky-100 dark:border-sky-950/50">
          {/* Decorative Paw Print Watermarks */}
          <div className="absolute top-8 left-10 text-sky-200/50 dark:text-sky-900/20 text-7xl select-none pointer-events-none transform -rotate-12">
            🐾
          </div>
          <div className="absolute bottom-10 right-16 text-sky-200/40 dark:text-sky-900/20 text-9xl select-none pointer-events-none transform rotate-12">
            🐾
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/40 dark:bg-sky-900/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column Text */}
              <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-sky-950/80 backdrop-blur border border-sky-200/80 dark:border-sky-800 text-xs font-black uppercase tracking-widest text-sky-700 dark:text-sky-300 shadow-xs">
                  <span>🐾</span>
                  <span>PET CARE & NUTRITION</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] font-heading">
                  Love, Treats, And Care <br />
                  <span className="text-sky-600 dark:text-sky-400">For Your Furry Friend</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                  Explore biologically appropriate raw diets, vet-certified organic kibbles, orthopedic plush beds, and gentle grooming care designed to keep tails wagging.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link
                    href="/products"
                    className="px-8 py-4 bg-[#ffd100] hover:bg-[#ffc400] active:scale-95 text-slate-950 font-black text-sm uppercase tracking-wider rounded-full shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center gap-2"
                  >
                    <span>Shop Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/collections"
                    className="px-8 py-4 bg-white dark:bg-card hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-extrabold text-sm uppercase tracking-wider rounded-full shadow-xs transition"
                  >
                    <span>View Catalog</span>
                  </Link>
                </div>

                {/* Trust mini bar */}
                <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>100% Grain-Free</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Vet Approved</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Fast 2-Day Delivery</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Visual with Food Pack & Dog */}
              <div className="lg:col-span-6 flex justify-center relative">
                <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
                  {/* Organic circular backdrop badge */}
                  <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-sky-200/70 to-amber-200/50 dark:from-sky-950 dark:to-amber-950/40 -rotate-6 transform scale-95" />

                  {/* Main Dog & Pet Food Composition */}
                  <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-900 group">
                    <img
                      src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1000&q=80"
                      alt="Happy dog with organic pet food"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Floating Product Badge */}
                    <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur border border-sky-100 dark:border-slate-800 shadow-xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-2xl shrink-0">
                          🥩
                        </div>
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-amber-600">Featured Recipe</div>
                          <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">Freeze-Dried Raw Salmon & Duck Kibble</h4>
                        </div>
                      </div>
                      <Link
                        href="/products"
                        className="px-3.5 py-2 rounded-xl bg-[#ffd100] text-slate-950 font-black text-xs hover:bg-[#ffc400] transition whitespace-nowrap"
                      >
                        $28.00 →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. "Everything Your Pet Needs" 6-Category Organic Blob Row ── */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
              Pet Picks
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
              Everything Your Pet Needs
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 items-center justify-items-center">
            {PET_CATEGORIES.map((cat) => {
              const IconComp = cat.Icon;
              return (
                <Link
                  key={cat.name}
                  href={`/products?category=${cat.query}`}
                  className="group flex flex-col items-center justify-center text-center transition-all duration-300 transform hover:-translate-y-1.5 focus:outline-none"
                >
                  <div
                    className={`w-28 h-24 sm:w-32 sm:h-28 md:w-36 md:h-32 bg-[#edf5fd] dark:bg-sky-950/40 flex items-center justify-center shadow-xs group-hover:bg-[#e0effe] dark:group-hover:bg-sky-900/50 group-hover:scale-105 transition-all duration-300 ${cat.blobShape}`}
                  >
                    <IconComp className="w-14 h-14 sm:w-16 sm:h-16 stroke-slate-900 dark:stroke-slate-100 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <span className="mt-4 font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── 3. "Complete Care For Happy Pets!" Split Feature with Interactive Tabs ── */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden bg-white dark:bg-transparent">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Happy Woman Hugging Fluffy Dog with Yellow Blob and Blue Doodles */}
            <div className="lg:col-span-6 flex justify-center relative">
              <div className="relative w-full max-w-md">
                {/* Playful background blob shape */}
                <div className="absolute inset-0 bg-[#fff3d4] dark:bg-amber-950/30 rounded-[45%_55%_60%_40%/50%_45%_55%_50%] transform -rotate-3 scale-105 pointer-events-none -z-10" />

                {/* Decorative doodle scribbles */}
                <div className="absolute -top-6 -left-6 text-sky-400 dark:text-sky-500 select-none pointer-events-none opacity-80">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 24 C8 12, 24 8, 20 22 C18 30, 32 28, 30 18 C28 10, 40 12, 38 24" />
                  </svg>
                </div>
                <div className="absolute -top-4 right-4 text-sky-400 dark:text-sky-500 select-none pointer-events-none opacity-80">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <path d="M20 6 L20 12" />
                    <path d="M10 12 L15 16" />
                    <path d="M30 12 L25 16" />
                  </svg>
                </div>

                {/* Main Visual Card */}
                <div className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-amber-50 dark:bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80"
                    alt="Happy pet owner with puppy"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Gentle Service kicker, Heading, and 4 Interactive Tabs */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                Gentle Service
              </span>

              <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-[1.15] font-heading">
                Complete Care For <br />
                <span className="text-[#ffd100]">Happy Pets!</span>
              </h2>

              <div className="space-y-4 pt-2">
                {SPLIT_CARE_TABS.map((tab, idx) => {
                  const isActive = activeCareTab === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveCareTab(idx)}
                      className={`transition-all duration-300 cursor-pointer rounded-2xl p-4 ${
                        isActive
                          ? 'border-l-4 border-[#ffd100] bg-amber-50/40 dark:bg-amber-950/20 shadow-xs'
                          : 'border-l-4 border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{tab.icon}</span>
                        <h3
                          className={`text-lg sm:text-xl font-extrabold tracking-tight ${
                            isActive
                              ? 'text-slate-950 dark:text-white'
                              : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                          }`}
                        >
                          {tab.title}
                        </h3>
                      </div>

                      {isActive && (
                        <p className="mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl animate-in fade-in">
                          {tab.desc}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. "Favorites This Week" Product Carousel / Grid ── */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-sky-600 dark:text-sky-400 block">
              TRENDING
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Favorites This Week
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoritesList.map((product) => (
              <PawzyProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ── 5. "Care You Can Trust" Feature Wheel (Center Kitten & Puppy Duo) ── */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-transparent">
          <div className="text-center space-y-2 mb-14">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
              Our Services
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight font-heading">
              Care You Can Trust
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left 3 items */}
            <div className="lg:col-span-4 space-y-8">
              {CARE_SERVICES.left.map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-left">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-3xl shrink-0 shadow-xs">
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-base text-slate-950 dark:text-white">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Center Column: Kitten and Puppy Duo in soft lavender arched backdrop */}
            <div className="lg:col-span-4 flex justify-center relative">
              <div className="relative w-72 h-80 sm:w-80 sm:h-96 flex items-center justify-center">
                {/* Soft purple/lavender arch background */}
                <div className="absolute inset-0 bg-[#e8edff] dark:bg-indigo-950/40 rounded-t-[10rem] rounded-b-[4rem] pointer-events-none -z-10" />

                {/* Doodle floating bone on top right */}
                <div className="absolute top-6 right-2 text-2xl select-none pointer-events-none transform rotate-12">
                  🦴✨
                </div>

                {/* Main cutout image */}
                <div className="relative w-full h-full flex items-end justify-center overflow-hidden rounded-t-[10rem] rounded-b-[4rem]">
                  <img
                    src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80"
                    alt="Puppy and kitten sitting together"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right 3 items */}
            <div className="lg:col-span-4 space-y-8">
              {CARE_SERVICES.right.map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-4 text-left">
                  <div className="space-y-1 flex-1">
                    <h4 className="font-extrabold text-base text-slate-950 dark:text-white">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                      {item.desc}
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-3xl shrink-0 shadow-xs">
                    {item.icon}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. "Best Selling Products" ── */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-amber-600 block mb-1">
                HOT PICKS
              </span>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Best Selling Products
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-sky-600 hover:text-sky-700 underline flex items-center gap-1"
            >
              <span>View All</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellersList.map((product) => (
              <PawzyProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ── 7. Teal 15% Off Promo Banner ── */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-[#bdf0eb] via-[#cbf5f1] to-[#d6faf6] dark:from-[#0d2a27] dark:via-[#0a2320] dark:to-[#0c121e] border border-teal-200 dark:border-teal-900/60 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Bag illustration / Food Pack */}
            <div className="w-full lg:w-96 aspect-square max-w-xs rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80"
                alt="Organic Pet Food Pack"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Banner Text & CTA */}
            <div className="space-y-4 max-w-xl text-center lg:text-left flex-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 text-teal-800 dark:text-teal-300 text-xs font-black uppercase tracking-wider">
                <span>🐱</span>
                <span>ORGANIC CAT & DOG DIET</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Get 15% Off Either On First Order Or Auto-Ship
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                Never worry about running out of food again. Set your preferred delivery frequency and enjoy flexible cancellations anytime.
              </p>

              <div className="pt-2">
                <Link
                  href="/products"
                  className="px-8 py-4 bg-[#ffd100] hover:bg-[#ffc400] text-slate-950 font-black text-xs uppercase tracking-wider rounded-full shadow-lg inline-flex items-center gap-2 transition"
                >
                  <span>Shop Promotion Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── 8. Testimonials ("What Pet Parents Say") ── */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-sky-600 dark:text-sky-400 block">
              TESTIMONIALS
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              What Pet Parents Say
            </h2>
          </div>

          <div className="max-w-4xl mx-auto p-8 sm:p-12 rounded-3xl bg-white dark:bg-card border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-lg border-2 border-amber-300 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
                alt="Sarah with pet dog"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-4 text-left">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed italic font-medium">
                "We saw an incredible transformation in Bella's energy, digestion, and coat shine within just two weeks of switching to Pawzy's salmon recipe! The in-store grooming staff is remarkably patient and sweet."
              </p>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Sarah Jenkins</h4>
                <p className="text-xs text-slate-400 font-medium">Proud Golden Retriever Parent • Verified Buyer</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 9. Peeking Pets Illustration & "Make Your Pet's Appointment" Form ── */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Peeking Pets Avatar Emojis */}
          <div className="flex justify-center -mb-4 relative z-10">
            <div className="flex items-end gap-6 text-6xl select-none">
              <span className="transform -rotate-6 animate-bounce duration-1000">🐶</span>
              <span className="transform rotate-6 animate-bounce duration-1000 delay-150">🐱</span>
            </div>
          </div>

          <div className="p-8 sm:p-14 rounded-3xl bg-[#efefff] dark:bg-[#14152b] border border-indigo-100 dark:border-indigo-950/60 shadow-2xl space-y-8">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 text-2xl">
                <span>🐾</span>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-heading">
                  Make Your Pet's Appointment
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto font-normal">
                Book a grooming session, vet consultation, or day-care trial with our certified caretakers.
              </p>
            </div>

            {isBooked ? (
              <div className="p-6 rounded-2xl bg-emerald-100 text-emerald-800 text-center font-extrabold text-sm border border-emerald-300 max-w-xl mx-auto animate-in fade-in">
                🎉 Appointment Request Submitted! Our clinic concierge will text/email your confirmation within 15 minutes.
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4 max-w-3xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Service */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">Select Service</label>
                    <select
                      value={apptService}
                      onChange={(e) => setApptService(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      <option>Full Grooming & Spa</option>
                      <option>Vet Wellness Checkup</option>
                      <option>Dental Scale & Polish</option>
                      <option>Daycare Play Trial</option>
                    </select>
                  </div>

                  {/* Pet Type */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">Pet Type</label>
                    <select
                      value={apptPet}
                      onChange={(e) => setApptPet(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      <option>Dog 🐕</option>
                      <option>Cat 🐈</option>
                      <option>Bird 🦜</option>
                      <option>Small Pet 🐹</option>
                    </select>
                  </div>

                  {/* Date */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">Select Date</label>
                    <input
                      type="date"
                      required
                      value={apptDate}
                      onChange={(e) => setApptDate(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  {/* Time */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">Select Time</label>
                    <select
                      value={apptTime}
                      onChange={(e) => setApptTime(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      <option>09:00 AM</option>
                      <option>10:00 AM</option>
                      <option>11:30 AM</option>
                      <option>02:00 PM</option>
                      <option>03:30 PM</option>
                      <option>05:00 PM</option>
                    </select>
                  </div>
                </div>

                {/* Notes Textarea */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Special Care Notes (Breed, Allergies, Temperament)
                  </label>
                  <textarea
                    rows={2}
                    value={apptNotes}
                    onChange={(e) => setApptNotes(e.target.value)}
                    placeholder="e.g. Bella is a 2-year old Golden Retriever who is shy around blow-dryers..."
                    className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div className="text-center pt-2">
                  <button
                    type="submit"
                    className="px-10 py-4 bg-[#ffd100] hover:bg-[#ffc400] text-slate-950 font-black text-xs uppercase tracking-wider rounded-full shadow-xl transition transform hover:-translate-y-0.5 inline-flex items-center gap-2"
                  >
                    <span>Book Appointment Now →</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* ── 10. "From Latest News" (Blog Cards) ── */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-sky-600 dark:text-sky-400 block">
              OUR BLOG
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              From Latest News
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BLOG_ARTICLES.map((article) => (
              <div
                key={article.id}
                className="group rounded-3xl overflow-hidden bg-white dark:bg-card border border-slate-200/80 dark:border-slate-800 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest">
                    {article.category}
                  </div>
                </div>

                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[11px] text-slate-400 font-bold">{article.date}</span>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-sky-600 transition leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {article.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-black text-sky-600 dark:text-sky-400 group-hover:translate-x-1 inline-flex items-center gap-1 transition-transform">
                      Read Article →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 11. Store Locations & Frequently Asked Questions (3-Column Layout) ── */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-transparent">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Store Locations & Contact Button */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl text-[#ffd100]">📍</span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white font-heading">
                  Store Location
                </h3>
              </div>

              <ul className="space-y-3.5 text-sm text-slate-700 dark:text-slate-300 font-medium">
                {[
                  '159 Mulholland Drive, CA, Los Angeles',
                  '289 Haight Street, CA, San Francisco',
                  '434 5th Avenue, NY, New York',
                ].map((loc, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-slate-900 dark:text-slate-100 font-black">•</span>
                    <span>{loc}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <Link
                  href="/contact"
                  className="px-8 py-3.5 bg-[#ffd100] hover:bg-[#e6bc00] text-slate-950 font-black text-xs uppercase tracking-wider rounded-full shadow-md inline-block transition transform active:scale-95"
                >
                  Contact Now
                </Link>
              </div>
            </div>

            {/* Center Column: 3D Red Location Pin Visual with Dog & Boy */}
            <div className="lg:col-span-4 flex justify-center relative">
              <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-900 group">
                  <img
                    src="https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&q=80"
                    alt="Store Location & Pet"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Overlay 3D Pin Badge */}
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center text-xl shadow-xl border-2 border-white">
                    🐾
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Frequently Asked Questions Accordion */}
            <div className="lg:col-span-4 space-y-6">
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white font-heading">
                Frequently Asked Questions
              </h3>

              <div className="space-y-3">
                {PAWZY_FAQS.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="border-b border-slate-200 dark:border-slate-800 pb-3 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between gap-4 text-left py-1 text-sm sm:text-base font-extrabold text-slate-900 dark:text-white hover:text-amber-500 transition-colors"
                      >
                        <span>{faq.question}</span>
                        <span className="text-xl font-bold shrink-0 text-slate-400">
                          {isOpen ? '−' : '+'}
                        </span>
                      </button>

                      {isOpen && (
                        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal animate-in fade-in">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── 12. "Pet Service Packages" 3 Pricing Cards ── */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-14">
            <span className="text-xs font-black uppercase tracking-widest text-sky-600 dark:text-sky-400 block">
              PRICING TIERS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Pet Service Packages
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SERVICE_PACKAGES.map((pkg, i) => (
              <div
                key={i}
                className={`rounded-3xl p-8 border flex flex-col justify-between transition-all duration-300 ${
                  pkg.highlight
                    ? 'bg-gradient-to-b from-sky-50 to-white dark:from-sky-950/40 dark:to-card border-sky-400 dark:border-sky-600 shadow-2xl ring-2 ring-sky-400/30'
                    : 'bg-white dark:bg-card border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-xl'
                }`}
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{pkg.icon}</span>
                    {pkg.highlight && (
                      <span className="px-3 py-1 rounded-full bg-[#ffd100] text-slate-950 font-black text-[10px] uppercase tracking-wider">
                        Most Popular
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">{pkg.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{pkg.desc}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900 dark:text-white">
                      {formatPrice(pkg.price)}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">{pkg.period}</span>
                  </div>

                  <ul className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                    {pkg.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => {
                      setApptService(pkg.name);
                      window.scrollTo({ top: 2200, behavior: 'smooth' });
                    }}
                    className={`w-full py-3.5 rounded-full font-black text-xs uppercase tracking-wider shadow-md transition ${
                      pkg.highlight
                        ? 'bg-[#ffd100] hover:bg-[#ffc400] text-slate-950'
                        : 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-sky-600'
                    }`}
                  >
                    Book Package →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 13. Instagram 4-Photo Live Gallery Grid ── */}
        <section className="py-6 border-t border-slate-100 dark:border-slate-800">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 px-2">
            {[
              'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
              'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80',
              'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
              'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80',
            ].map((imgUrl, i) => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden relative group">
                <img
                  src={imgUrl}
                  alt="Pawzy Community Pet"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-sky-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-2xl font-bold">
                  🐾
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 14. "Subscribe For Our Newsletter" ── */}
        <section className="py-16 bg-slate-50 dark:bg-card border-t border-slate-100 dark:border-slate-800 text-center">
          <div className="max-w-xl mx-auto px-4 space-y-4">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Subscribe For Our Newsletter
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Get monthly nutrition tips, exclusive treat drops, and 10% off your next purchase.
            </p>

            {newsletterSubscribed ? (
              <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-800 text-xs font-bold">
                ✓ Thank you for subscribing! Check your inbox for your 10% welcome coupon.
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-md mx-auto pt-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="flex-1 px-4 py-3.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <button
                  type="submit"
                  className="px-7 py-3.5 bg-[#ffd100] hover:bg-[#ffc400] text-slate-950 font-black text-xs uppercase tracking-wider rounded-full shadow-md whitespace-nowrap transition"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <PawzyFooter />
    </div>
  );
}
