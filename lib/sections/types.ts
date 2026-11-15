// ─── Section Types ────────────────────────────────────────────────────────────
// Defines the CMS page section schema used by the SectionResolver.

// ── Individual section configs ────────────────────────────────────────────────

export interface HeroSectionConfig {
  type: 'hero';
  config: {
    headline?: string;
    subheadline?: string;
    title?: string;
    subtitle?: string;
    badge?: string;
    ctaLabel?: string;
    ctaHref?: string;
    ctaPrimary?: string;
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
    ctaSecondary?: string;
    backgroundImage?: string;
    image?: string;
    heroImage?: string;
    stats?: Array<{ value: string; label: string }>;
    floatingBadge?: string;
    trustBadges?: string[];
  };
}

export interface FeaturedProductsSectionConfig {
  type: 'featured-products';
  config: {
    title?: string;
    subtitle?: string;
    badge?: string;
    collection?: string; // collection slug to filter
    category?: string; // category slug to filter
    limit?: number;
    viewAllHref?: string;
    products?: any[];
    categories?: string[];
  };
}

export interface BannerSectionConfig {
  type: 'banner';
  config: {
    title?: string;
    description?: string;
    badge?: string;
    ctaLabel?: string;
    ctaHref?: string;
    backgroundImage?: string;
    variant?: 'primary' | 'accent' | 'dark';
  };
}

export interface CategoriesSectionConfig {
  type: 'categories';
  config: {
    title?: string;
    subtitle?: string;
    showAll?: boolean;
    limit?: number;
  };
}

export interface CollectionsSectionConfig {
  type: 'collections';
  config: {
    title?: string;
    subtitle?: string;
    limit?: number;
    layout?: 'grid' | 'masonry';
  };
}

export interface TestimonialsSectionConfig {
  type: 'testimonials';
  config: {
    title?: string;
    subtitle?: string;
    summary?: string;
    trustScore?: string;
    testimonials?: Array<{
      name: string;
      rating: number;
      text: string;
      avatar?: string;
      role?: string;
      title?: string;
      location?: string;
    }>;
    items?: Array<{
      name: string;
      rating: number;
      text: string;
      avatar?: string;
      role?: string;
      title?: string;
      location?: string;
    }>;
  };
}

export interface TrustBadgesSectionConfig {
  type: 'trust-badges';
  config: {
    kicker?: string;
    title?: string;
    badges?: Array<{ icon: string; title: string; desc: string }>;
    leftBadges?: Array<{ icon: string; title: string; desc: string }>;
    rightBadges?: Array<{ icon: string; title: string; desc: string }>;
    centerImage?: string;
  };
}

export interface NewsletterSectionConfig {
  type: 'newsletter';
  config: {
    title?: string;
    description?: string;
    placeholder?: string;
    ctaLabel?: string;
  };
}

export interface LookbookSectionConfig {
  type: 'lookbook';
  config: {
    lookbookTitle?: string;
    lookbookDesc?: string;
    lookbookImage?: string;
    badge?: string;
    ctaLabel?: string;
    ctaHref?: string;
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
  };
}

export interface DealCountdownSectionConfig {
  type: 'deal-countdown';
  config: {
    badge?: string;
    title?: string;
    subtitle?: string;
    discountPercent?: number;
    price?: number | string;
    compareAtPrice?: number | string;
    productName?: string;
    productCategory?: string;
    image?: string;
    ctaLabel?: string;
    ctaHref?: string;
    hoursLeft?: number;
  };
}

export interface RoomGridItem {
  title: string;
  sub: string;
  count: string;
  image: string;
  href: string;
}

export interface RoomGridSectionConfig {
  type: 'room-grid';
  config: {
    tagline?: string;
    title?: string;
    viewAllHref?: string;
    viewAllLabel?: string;
    items?: RoomGridItem[];
  };
}

export interface ProductMatrixSectionConfig {
  type: 'product-matrix';
  config: {
    title?: string;
    subtitle?: string;
    limit?: number;
  };
}

export interface CustomFormSectionConfig {
  type: 'custom_form';
  config: {
    formId?: string;
    formSlug?: string;
    formTitle?: string;
    heading?: string;
    subtitle?: string;
    containerWidth?: 'full' | 'container';
    containerMaxWidth?: string;
  };
}

export interface SplitFeatureTab {
  id?: string;
  title: string;
  icon?: string;
  desc: string;
}

export interface SplitFeaturesSectionConfig {
  type: 'split-features';
  config: {
    kicker?: string;
    badge?: string;
    titlePrefix?: string;
    titleHighlight?: string;
    title?: string;
    description?: string;
    image?: string;
    tabs?: SplitFeatureTab[];
    pillars?: Array<{
      title: string;
      desc?: string;
      description?: string;
      icon?: string;
      iconType?: string;
    }>;
  };
}

export interface CustomHtmlSectionConfig {
  type: 'custom';
  config: {
    title?: string;
    subtitle?: string;
    customHtml?: string;
    html?: string;
    padding?: string;
  };
}

export interface AnnouncementSectionConfig {
  type: 'announcement';
  config: {
    text?: string;
    title?: string;
    linkText?: string;
    linkHref?: string;
    badge?: string;
    dismissible?: boolean;
  };
}

export interface WhatsAppCtaSectionConfig {
  type: 'whatsapp_cta';
  config: {
    title?: string;
    subtitle?: string;
    phoneNumber?: string;
    message?: string;
    buttonText?: string;
  };
}

export interface VideoSectionConfig {
  type: 'video';
  config: {
    title?: string;
    subtitle?: string;
    videoUrl?: string;
    poster?: string;
    badge?: string;
    autoplay?: boolean;
  };
}

export interface SliderWidgetsSectionConfig {
  type: 'slider';
  config: {
    title?: string;
    subtitle?: string;
    items?: Array<{
      title: string;
      subtitle?: string;
      image?: string;
      href?: string;
      badge?: string;
    }>;
  };
}

export interface FaqLocationsSectionConfig {
  type: 'faq-locations';
  config: {
    locationsTitle?: string;
    locations?: string[];
    contactCtaLabel?: string;
    contactCtaHref?: string;
    centerImage?: string;
    faqTitle?: string;
    faqs?: Array<{
      question: string;
      answer: string;
    }>;
  };
}

export interface SpacerSectionConfig {
  type: 'spacer';
  config: { height?: number };
}

export type SectionConfig =
  | HeroSectionConfig
  | FeaturedProductsSectionConfig
  | BannerSectionConfig
  | CategoriesSectionConfig
  | CollectionsSectionConfig
  | TestimonialsSectionConfig
  | TrustBadgesSectionConfig
  | NewsletterSectionConfig
  | LookbookSectionConfig
  | DealCountdownSectionConfig
  | RoomGridSectionConfig
  | ProductMatrixSectionConfig
  | CustomFormSectionConfig
  | SplitFeaturesSectionConfig
  | FaqLocationsSectionConfig
  | SpacerSectionConfig
  | CustomHtmlSectionConfig
  | AnnouncementSectionConfig
  | WhatsAppCtaSectionConfig
  | VideoSectionConfig
  | SliderWidgetsSectionConfig;

// ── Page Layout ───────────────────────────────────────────────────────────────

export interface PageLayout {
  page: string;
  sections: SectionConfig[];
}

// ── Default Section Layouts Per Template ──────────────────────────────────────

export const DEFAULT_TEMPLATE_SECTIONS: Record<string, SectionConfig[]> = {
  mincom: [
    {
      type: 'hero',
      config: {
        badge: '✨ NEW 2026 COLLECTION',
        headline: 'Elevate Your Living Space With Nordic Craft',
        subheadline:
          'Handcrafted solid oak timber, natural wool upholstery, and ergonomic aesthetics designed for everyday serenity.',
        ctaLabel: 'Shop Collection →',
        ctaHref: '/products',
        secondaryCtaLabel: 'Explore Rooms',
        secondaryCtaHref: '/collections',
        backgroundImage:
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1920&auto=format&fit=crop',
      },
    },
    {
      type: 'trust-badges',
      config: {
        badges: [
          { icon: '🚚', title: 'Free Home Delivery', desc: 'On all orders over $150' },
          { icon: '🛡️', title: '10-Year Warranty', desc: '100% solid wood guaranteed' },
          { icon: '🔄', title: '30-Day Easy Returns', desc: 'Hassle-free return policy' },
          { icon: '💳', title: 'Secure Payments', desc: 'Encrypted checkout' },
        ],
      },
    },
    {
      type: 'room-grid',
      config: {
        tagline: 'INSPIRATION',
        title: 'Shop by Living Space',
        viewAllHref: '/collections',
        viewAllLabel: 'All Spaces →',
        items: [
          {
            title: 'Living Room',
            sub: 'Sofas, Lounges & Coffee Tables',
            count: '48 items',
            image:
              'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=600&auto=format&fit=crop',
            href: '/products?category=living-room',
          },
          {
            title: 'Bedroom Sets',
            sub: 'Platform Beds, Nightstands & Linens',
            count: '32 items',
            image:
              'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=600&auto=format&fit=crop',
            href: '/products?category=bedroom',
          },
          {
            title: 'Kitchen & Dining',
            sub: 'Solid Wood Dining Tables & Chairs',
            count: '24 items',
            image:
              'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=600&auto=format&fit=crop',
            href: '/products?category=dining',
          },
          {
            title: 'Office & Decor',
            sub: 'Ergonomic Desks, Bookshelves & Lamps',
            count: '40 items',
            image:
              'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=600&auto=format&fit=crop',
            href: '/products?category=office',
          },
        ],
      },
    },
    {
      type: 'featured-products',
      config: {
        badge: 'CURATED SELECTION',
        title: 'Trending Furniture & Pieces',
        subtitle: 'Our most sought-after handcrafted pieces this season',
        limit: 8,
        viewAllHref: '/products',
      },
    },
    {
      type: 'deal-countdown',
      config: {
        badge: '⚡ LIMITED TIME PROMOTION',
        title: 'Deal of the Day',
        subtitle: 'Special promotional pricing on our flagship ergonomic accent chair.',
        discountPercent: 28,
        price: 249.0,
        compareAtPrice: 349.0,
        productName: 'Mid-Century Nordic Ergonomic Lounge Chair in Oat Bouclé',
        productCategory: 'Living Room',
        image:
          'https://images.unsplash.com/photo-1580481077194-4d22223a502f?q=80&w=800&auto=format&fit=crop',
        ctaLabel: 'Claim Deal Now →',
        ctaHref: '/products',
      },
    },
    {
      type: 'lookbook',
      config: {
        badge: 'ARTISAN SPOTLIGHT',
        lookbookTitle: 'Crafted by Master Joiners in Småland',
        lookbookDesc:
          'Every dining surface and armchair is shaped by hand using traditional mortise-and-tenon joints, sustainably harvested FSC European timber, and organic beeswax finishes.',
        lookbookImage:
          'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        ctaLabel: 'Explore Artisan Workshop',
        ctaHref: '/products',
      },
    },
    {
      type: 'product-matrix',
      config: {
        title: 'Explore Collections',
        subtitle: 'Top rated, best selling, on sale, and featured picks',
        limit: 3,
      },
    },
    {
      type: 'newsletter',
      config: {
        title: 'Join the Mincom Collective',
        description:
          'Receive early access to seasonal drops, interior design guides, and private showroom events.',
        placeholder: 'Enter your email address...',
        ctaLabel: 'Subscribe for 10% Off',
      },
    },
  ],
  funo: [
    {
      type: 'hero',
      config: {
        badge: '✨ Scandinavian Modern Furniture',
        headline: 'Furniture for Mindful, Calm Living',
        subheadline:
          'Contemporary Scandinavian silhouettes crafted from solid European oak, natural bouclé, and artisanal ceramics.',
        ctaLabel: 'Shop Living Room',
        ctaHref: '/products',
        secondaryCtaLabel: 'Explore Catalog',
        secondaryCtaHref: '/products',
        backgroundImage:
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
      },
    },
    {
      type: 'categories',
      config: {
        title: 'Shop by Curated Room',
        subtitle: 'Living Room, Bedroom, Dining & Studio accents',
        limit: 4,
      },
    },
    {
      type: 'featured-products',
      config: {
        title: 'Trending Essentials',
        subtitle: 'Handpicked furniture and accents for mindful interiors',
        limit: 8,
      },
    },
    {
      type: 'lookbook',
      config: {
        lookbookTitle: 'Crafted by Master Joiners in Småland',
        lookbookDesc:
          'Every dining surface and armchair is shaped by hand using traditional mortise-and-tenon joints.',
        lookbookImage:
          'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        ctaLabel: 'Discover Specs',
        ctaHref: '/products',
      },
    },
    {
      type: 'newsletter',
      config: {
        title: 'Subscribe to Funo Design Journal',
        description:
          'Get exclusive Scandinavian interior design guides and 10% off your first order.',
        placeholder: 'Enter your email...',
        ctaLabel: 'Join Journal',
      },
    },
  ],
  pawzy: [
    {
      type: 'hero',
      config: {
        badge: '🐾 PET CARE & NUTRITION',
        headline: 'Love, Treats, And Care For Your Furry Friend',
        subheadline:
          'Explore biologically appropriate raw diets, vet-certified organic kibbles, orthopedic plush beds, and gentle grooming care designed to keep tails wagging.',
        ctaLabel: 'Shop Now',
        ctaHref: '/products',
        secondaryCtaLabel: 'View Catalog',
        secondaryCtaHref: '/collections',
        backgroundImage:
          'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=80',
      },
    },
    {
      type: 'categories',
      config: {
        title: 'Everything Your Pet Needs',
        subtitle: 'Pet Picks',
        limit: 6,
      },
    },
    {
      type: 'split-features',
      config: {
        kicker: 'Gentle Service',
        titlePrefix: 'Complete Care For',
        titleHighlight: 'Happy Pets!',
        image:
          'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
        tabs: [
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
        ],
      },
    },
    {
      type: 'featured-products',
      config: {
        badge: 'TRENDING',
        title: 'Favorites This Week',
        subtitle: 'Our most sought-after treats, collars, and toys',
        limit: 4,
      },
    },
    {
      type: 'trust-badges',
      config: {
        kicker: 'Our Services',
        title: 'Care You Can Trust',
        leftBadges: [
          { icon: '🛁', title: 'Bathing & Grooming', desc: 'Plant-based herbal washes, coat styling, and gentle sanitation.' },
          { icon: '✂️', title: 'Haircut & Styling', desc: 'Professional breed-specific coat trimming and detangling styling.' },
          { icon: '🐕', title: 'Dog Walking', desc: 'Certified and bonded local walkers providing GPS-tracked exercise.' },
        ],
        rightBadges: [
          { icon: '🐾', title: 'Nail & Paw Care', desc: 'Gentle claw clipping, filing, and organic pad moisturizing balm.' },
          { icon: '🏠', title: 'Pet Hotel Stay', desc: 'Safe, climate-controlled play suites with 24/7 live webcams.' },
          { icon: '🩺', title: 'Health Checkup', desc: 'Personalized dietary consults and preventative health assessments.' },
        ],
        centerImage:
          'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
      },
    },
    {
      type: 'featured-products',
      config: {
        badge: 'HOT PICKS',
        title: 'Best Selling Products',
        subtitle: 'Customer favorites loved by thousands of happy pets',
        limit: 4,
      },
    },
    {
      type: 'banner',
      config: {
        badge: '🐱 ORGANIC CAT & DOG DIET',
        title: 'Get 15% Off Either On First Order Or Auto-Ship',
        description:
          'Never worry about running out of food again. Set your preferred delivery frequency and enjoy flexible cancellations.',
        ctaLabel: 'Shop Promotion Now',
        ctaHref: '/products',
        variant: 'accent',
      },
    },
    {
      type: 'faq-locations',
      config: {
        locationsTitle: 'Store Location',
        locations: [
          '159 Mulholland Drive, CA, Los Angeles',
          '289 Haight Street, CA, San Francisco',
          '434 5th Avenue, NY, New York',
        ],
        contactCtaLabel: 'Contact Now',
        contactCtaHref: '/contact',
        centerImage:
          'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&q=80',
        faqTitle: 'Frequently Asked Questions',
        faqs: [
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
            question: 'Can I return a product if it doesn\'t fit my pet?',
            answer: 'Absolutely! We offer a 30-day hassle-free return and exchange guarantee on all gear and accessories.',
          },
          {
            question: 'Are your products vet-approved?',
            answer: 'Yes! All our organic recipes, raw diets, and wellness formulas are formulated and vetted by licensed veterinary nutritionists.',
          },
        ],
      },
    },
    {
      type: 'testimonials',
      config: {
        title: 'What Pet Parents Say',
        subtitle: 'Real experiences from happy pet owners.',
        testimonials: [
          {
            name: 'Sarah Jenkins',
            rating: 5,
            text: "We saw an incredible transformation in Bella's energy, digestion, and coat shine within just two weeks of switching to Pawzy's salmon recipe!",
            role: 'Proud Golden Retriever Parent',
          },
        ],
      },
    },
    {
      type: 'newsletter',
      config: {
        title: 'Subscribe For Our Newsletter',
        description:
          'Get monthly nutrition tips, exclusive treat drops, and 10% off your next purchase.',
        placeholder: 'Enter your email address...',
        ctaLabel: 'Subscribe',
      },
    },
  ],
  luxe: [
    {
      type: 'hero',
      config: {
        badge: 'HAUTE COUTURE 2026',
        headline: 'Timeless Elegance & Modern Luxury',
        subheadline:
          'Discover curated designer collections, exquisite fine jewelry, and bespoke fashion crafted for discerning tastes.',
        ctaLabel: 'Explore Atelier',
        ctaHref: '/products',
        secondaryCtaLabel: 'View Runway',
        secondaryCtaHref: '/collections',
        backgroundImage:
          'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
      },
    },
    {
      type: 'trust-badges',
      config: {
        badges: [
          { icon: '💎', title: 'Authenticity Guaranteed', desc: '100% verified luxury pieces' },
          { icon: '✈️', title: 'White-Glove Express', desc: 'Complimentary insured shipping' },
          { icon: '🎁', title: 'Signature Packaging', desc: 'Bespoke gift presentation' },
          { icon: '👑', title: 'Private Styling', desc: 'Dedicated concierge team' },
        ],
      },
    },
    {
      type: 'collections',
      config: {
        title: 'The Season Collections',
        subtitle: 'Artisanal tailoring and limited capsule releases',
        limit: 3,
      },
    },
    {
      type: 'featured-products',
      config: {
        title: 'Iconic Pieces',
        subtitle: 'Selected by our head stylist',
        limit: 8,
      },
    },
    {
      type: 'newsletter',
      config: {
        title: 'The Luxe Private Circle',
        description:
          'Receive private salon invitations, private runway previews, and personal stylist consultations.',
        placeholder: 'Enter your email...',
        ctaLabel: 'Request Invitation',
      },
    },
  ],
  northvale: [
    {
      type: 'hero',
      config: {
        badge: 'FIELD NOTES • EDITION 04',
        headline: 'Built for the quiet distance.',
        subheadline:
          'Technical outdoor apparel and equipment designed for hikers, climbers, and the long trail ahead. Field-tested in the Northern Dolomites.',
        ctaLabel: 'Explore Gear',
        ctaHref: '/products',
        secondaryCtaLabel: 'Read Journal',
        secondaryCtaHref: '/products',
        backgroundImage:
          'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1600&auto=format&fit=crop&q=80',
        stats: [
          { value: '260g', label: 'Trail Runner Lite' },
          { value: '28,000mm', label: 'Hydrostatic Barrier' },
          { value: '200km', label: 'Alta Via Tested' },
        ],
      },
    },
    {
      type: 'trust-badges',
      config: {
        kicker: 'ALPINE CRAFT & INTEGRITY',
        title: 'Performance engineered into every fiber.',
        badges: [
          {
            icon: '🌧️',
            title: 'Weather Protection',
            desc: '28,000mm hydrostatic head waterproof barrier with fluorocarbon-free DWR.',
          },
          {
            icon: '⚡',
            title: 'Engineered Construction',
            desc: 'Fully taped micro-seams and abrasion-resistant Cordura ripstop.',
          },
          {
            icon: '🌬️',
            title: 'Breathable Performance',
            desc: 'Sub-300g ultralight matrix mesh venting active body heat on steep ascents.',
          },
          {
            icon: '🛡️',
            title: 'Lifetime Repair Program',
            desc: 'Free repairs for the life of your gear to prevent mountain equipment waste.',
          },
        ],
      },
    },
    {
      type: 'categories',
      config: {
        title: 'Three categories. One system.',
        subtitle: 'Field-tested essentials designed to work together.',
        showAll: true,
        limit: 6,
      },
    },
    {
      type: 'featured-products',
      config: {
        badge: 'SEASON ESSENTIALS',
        title: 'Field-tested essentials, quietly organized.',
        subtitle: 'Sub-300g shells, approach footwear, and technical mountain packs.',
        limit: 8,
        viewAllHref: '/products',
      },
    },
    {
      type: 'banner',
      config: {
        badge: 'EDITORIAL STORY • ALTA VIA',
        title: 'Two hundred kilometers of quiet weather along the Alta Via.',
        description:
          'Our field team spent four weeks testing our lightweight matrix mesh shells through alpine wind, granite scree, and sudden mountain downpours.',
        ctaLabel: 'Read the Field Notes',
        ctaHref: '/products',
        backgroundImage:
          'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1600&auto=format&fit=crop&q=80',
        variant: 'dark',
      },
    },
    {
      type: 'testimonials',
      config: {
        title: 'Trail-Tested Reviews',
        subtitle: 'Field feedback from alpinists, mountain guides, and long-distance hikers.',
        testimonials: [
          {
            name: 'Liam Henderson',
            rating: 5,
            text: 'The Trail Runner Lite carried me through 90 miles of wet granite and river crossings in the Wind River Range. Zero blisters, insane grip on steep slab.',
            role: 'Ultralight Thru-Hiker (Boulder, CO)',
          },
          {
            name: 'Elena Rostova',
            rating: 5,
            text: 'Totally stormproof in high-altitude sleet yet genuinely breathable on steep ascents. Minimalist perfection without shouting neon logos.',
            role: 'Alpine Mountain Guide (Innsbruck, Austria)',
          },
        ],
      },
    },
    {
      type: 'newsletter',
      config: {
        title: 'New releases and quiet drops — no noise, once a month.',
        description:
          'Field Notes direct to your inbox with edition announcements and zero promotional spam.',
        placeholder: 'Enter your email address...',
        ctaLabel: 'Subscribe →',
      },
    },
  ],
  default: [
    {
      type: 'hero',
      config: {
        headline: 'Shop the Latest Drops',
        subheadline:
          'Discover thousands of products curated just for you. Free shipping on orders over $50.',
        ctaLabel: 'Shop Now',
        ctaHref: '/products',
        secondaryCtaLabel: 'Explore Collections',
        secondaryCtaHref: '/collections',
        stats: [
          { value: '10K+', label: 'Products' },
          { value: '50K+', label: 'Happy Customers' },
          { value: '4.9★', label: 'Average Rating' },
        ],
      },
    },
    {
      type: 'trust-badges',
      config: {
        badges: [
          { icon: '🚚', title: 'Free Shipping', desc: 'On orders over $50' },
          { icon: '↩️', title: 'Easy Returns', desc: '30-day return policy' },
          { icon: '🔒', title: 'Secure Payment', desc: 'SSL encrypted checkout' },
          { icon: '💬', title: '24/7 Support', desc: 'Always here to help' },
        ],
      },
    },
    {
      type: 'collections',
      config: { title: 'Featured Collections', limit: 3 },
    },
    {
      type: 'categories',
      config: { showAll: true },
    },
    {
      type: 'featured-products',
      config: {
        title: 'New Arrivals',
        subtitle: 'Just In',
        limit: 8,
        viewAllHref: '/products?sort=newest',
      },
    },
    {
      type: 'banner',
      config: {
        title: 'Members get more',
        description:
          'Join thousands of shoppers and unlock exclusive deals, early access, and free shipping.',
        ctaLabel: 'Join Free Today',
        ctaHref: '/auth/signup',
        variant: 'accent',
      },
    },
    {
      type: 'newsletter',
      config: {
        title: 'Stay in the loop',
        description: 'Subscribe to our newsletter for exclusive discounts and product releases.',
        placeholder: 'Enter your email address...',
        ctaLabel: 'Subscribe',
      },
    },
  ],
};

export const DEFAULT_HOME_LAYOUT: PageLayout = {
  page: 'home',
  sections: DEFAULT_TEMPLATE_SECTIONS.default,
};

// ── Universal Section Normalizer ─────────────────────────────────────────────
/**
 * Normalizes any section representation (whether from Readdy AI website builder,
 * CMS Theme Studio, or raw JSON) into a strict SectionConfig object.
 */
export function normalizeSection(raw: any): SectionConfig | null {
  if (!raw || typeof raw !== 'object') return null;
  if (raw.enabled === false) return null;

  const rawType = String(raw.type || raw.id || '').toLowerCase().trim();
  if (!rawType) return null;

  // Header and footer are part of the template layout frame unless they contain explicit custom HTML
  if (
    (rawType === 'header' || rawType === 'footer') &&
    !raw.customHtml &&
    !raw.config?.customHtml &&
    !raw.contentJson?.customHtml
  ) {
    return null;
  }

  // Extract merged configuration
  const contentJson = raw.contentJson && typeof raw.contentJson === 'object' ? raw.contentJson : {};
  const existingConfig = raw.config && typeof raw.config === 'object' ? raw.config : {};
  const merged: Record<string, any> = {
    ...contentJson,
    ...existingConfig,
  };

  // Hoist top-level fields
  if (raw.title && !merged.title && !merged.headline) {
    merged.title = raw.title;
    merged.headline = raw.title;
  }
  if (raw.subtitle && !merged.subtitle && !merged.subheadline) {
    merged.subtitle = raw.subtitle;
    merged.subheadline = raw.subtitle;
  }
  if (raw.customHtml && !merged.customHtml) {
    merged.customHtml = raw.customHtml;
  }

  // If section has custom HTML and is not explicitly mapped or is custom/customHtml
  if (
    rawType === 'custom' ||
    rawType === 'custom_html' ||
    rawType === 'customhtml' ||
    (merged.customHtml &&
      !['hero', 'products', 'featured-products', 'testimonials', 'split-features', 'trust-badges'].includes(
        rawType,
      ))
  ) {
    return {
      type: 'custom',
      config: {
        title: merged.title || raw.title,
        subtitle: merged.subtitle || raw.subtitle,
        customHtml: merged.customHtml || merged.html || '',
      },
    };
  }

  // 1. Hero variations
  if (
    rawType === 'hero' ||
    rawType === 'header' ||
    rawType === 'impact-hero' ||
    rawType === 'marketplace_header'
  ) {
    return {
      type: 'hero',
      config: {
        headline: merged.headline || merged.title || raw.title || 'Welcome',
        subheadline: merged.subheadline || merged.subtitle || raw.subtitle,
        badge: merged.badge,
        ctaLabel: merged.ctaLabel || merged.ctaPrimary || 'Shop Now',
        ctaHref: merged.ctaHref || merged.primaryLink || '/products',
        secondaryCtaLabel: merged.secondaryCtaLabel || merged.ctaSecondary,
        secondaryCtaHref: merged.secondaryCtaHref || merged.secondaryLink || '/collections',
        backgroundImage: merged.backgroundImage || merged.image || merged.heroImage,
        stats: merged.stats,
        floatingBadge: merged.floatingBadge,
        trustBadges: merged.trustBadges,
      },
    };
  }

  // 2. Featured Products variations
  if (
    rawType === 'featured-products' ||
    rawType === 'featured_products' ||
    rawType === 'products' ||
    rawType === 'catalog' ||
    rawType === 'marketplace_grid'
  ) {
    return {
      type: 'featured-products',
      config: {
        title: merged.title || raw.title || 'Featured Products',
        subtitle: merged.subtitle || raw.subtitle,
        badge: merged.badge,
        collection: merged.collection,
        category: merged.category,
        limit: merged.limit ? Number(merged.limit) : 8,
        viewAllHref: merged.viewAllHref || '/products',
        products: merged.products,
        categories: merged.categories,
      },
    };
  }

  // 3. Split Features / Brand Pillars variations
  if (
    rawType === 'split-features' ||
    rawType === 'split_features' ||
    rawType === 'features' ||
    rawType === 'story' ||
    rawType === 'pillars' ||
    rawType === 'brand_values'
  ) {
    const rawTabs = merged.tabs || merged.pillars || [];
    const normalizedTabs = rawTabs.map((t: any, idx: number) => ({
      id: t.id || `tab-${idx}`,
      title: t.title || 'Feature',
      icon:
        t.icon ||
        (t.iconType === 'leaf'
          ? '🌿'
          : t.iconType === 'sparkles'
          ? '✨'
          : t.iconType === 'shield'
          ? '🛡️'
          : '🐾'),
      desc: t.desc || t.description || '',
    }));

    return {
      type: 'split-features',
      config: {
        kicker: merged.kicker || merged.badge || 'Our Commitment',
        titlePrefix: merged.titlePrefix || merged.title || raw.title || 'Complete Care For',
        titleHighlight: merged.titleHighlight || '',
        image: merged.image || merged.imageUrl,
        tabs: normalizedTabs.length > 0 ? normalizedTabs : undefined,
      },
    };
  }

  // 4. Testimonials / Reviews variations
  if (
    rawType === 'testimonials' ||
    rawType === 'reviews' ||
    rawType === 'social_proof'
  ) {
    const rawItems = merged.testimonials || merged.items || [];
    const normalizedItems = rawItems.map((item: any) => ({
      name: item.name || 'Verified Customer',
      rating: Number(item.rating) || 5,
      text: item.text || item.review || item.comment || '',
      avatar: item.avatar,
      role: item.role || item.location || 'Verified Buyer',
    }));

    return {
      type: 'testimonials',
      config: {
        title: merged.title || raw.title || 'Loved by Customers',
        subtitle: merged.subtitle || raw.subtitle || merged.summary,
        testimonials: normalizedItems.length > 0 ? normalizedItems : undefined,
      },
    };
  }

  // 5. Trust Badges variations
  if (
    rawType === 'trust-badges' ||
    rawType === 'trust_badges' ||
    rawType === 'badges'
  ) {
    return {
      type: 'trust-badges',
      config: {
        kicker: merged.kicker,
        title: merged.title || raw.title,
        badges: merged.badges,
        leftBadges: merged.leftBadges,
        rightBadges: merged.rightBadges,
        centerImage: merged.centerImage,
      },
    };
  }

  // 6. Categories variations
  if (
    rawType === 'categories' ||
    rawType === 'category-grid' ||
    rawType === 'category_ribbon'
  ) {
    return {
      type: 'categories',
      config: {
        title: merged.title || raw.title,
        subtitle: merged.subtitle || raw.subtitle,
        showAll: merged.showAll,
        limit: merged.limit ? Number(merged.limit) : 6,
      },
    };
  }

  // 7. Collections variations
  if (rawType === 'collections' || rawType === 'collection-grid') {
    return {
      type: 'collections',
      config: {
        title: merged.title || raw.title,
        subtitle: merged.subtitle || raw.subtitle,
        limit: merged.limit ? Number(merged.limit) : 3,
        layout: merged.layout,
      },
    };
  }

  // 8. Deal Countdown variations
  if (
    rawType === 'deal-countdown' ||
    rawType === 'deal_countdown' ||
    rawType === 'lightning_deals' ||
    rawType === 'flash_sale'
  ) {
    return {
      type: 'deal-countdown',
      config: {
        badge: merged.badge,
        title: merged.title || raw.title,
        subtitle: merged.subtitle || raw.subtitle,
        discountPercent: merged.discountPercent,
        price: merged.price,
        compareAtPrice: merged.compareAtPrice,
        productName: merged.productName,
        productCategory: merged.productCategory,
        image: merged.image,
        ctaLabel: merged.ctaLabel,
        ctaHref: merged.ctaHref,
        hoursLeft: merged.hoursLeft,
      },
    };
  }

  // 9. Announcement
  if (rawType === 'announcement' || rawType === 'announcement_ribbon') {
    return {
      type: 'announcement',
      config: {
        text: merged.text || merged.title || raw.title,
        title: merged.title || raw.title,
        badge: merged.badge,
        linkText: merged.linkText,
        linkHref: merged.linkHref,
        dismissible: merged.dismissible,
      },
    };
  }

  // 10. WhatsApp CTA
  if (rawType === 'whatsapp' || rawType === 'whatsapp_cta') {
    return {
      type: 'whatsapp_cta',
      config: {
        title: merged.title || raw.title,
        subtitle: merged.subtitle || raw.subtitle,
        phoneNumber: merged.phoneNumber || merged.whatsappNumber,
        message: merged.message,
        buttonText: merged.buttonText || merged.ctaLabel,
      },
    };
  }

  // 11. Video / Video Showcase
  if (rawType === 'video' || rawType === 'video_showcase') {
    return {
      type: 'video',
      config: {
        title: merged.title || raw.title,
        subtitle: merged.subtitle || raw.subtitle,
        videoUrl: merged.videoUrl || merged.url || merged.src,
        poster: merged.poster || merged.image,
        badge: merged.badge,
        autoplay: merged.autoplay,
      },
    };
  }

  // 12. Slider / Widgets
  if (rawType === 'slider' || rawType === 'widgets') {
    return {
      type: 'slider',
      config: {
        title: merged.title || raw.title,
        subtitle: merged.subtitle || raw.subtitle,
        items: merged.items || merged.widgets || [],
      },
    };
  }

  // 13. Banner
  if (rawType === 'banner') {
    return {
      type: 'banner',
      config: {
        title: merged.title || raw.title,
        description: merged.description || merged.subtitle || raw.subtitle,
        badge: merged.badge,
        ctaLabel: merged.ctaLabel,
        ctaHref: merged.ctaHref,
        backgroundImage: merged.backgroundImage || merged.image,
        variant: merged.variant,
      },
    };
  }

  // 14. Newsletter
  if (rawType === 'newsletter') {
    return {
      type: 'newsletter',
      config: {
        title: merged.title || raw.title,
        description: merged.description || merged.subtitle || raw.subtitle,
        placeholder: merged.placeholder,
        ctaLabel: merged.ctaLabel,
      },
    };
  }

  // 15. Lookbook
  if (rawType === 'lookbook') {
    return {
      type: 'lookbook',
      config: {
        lookbookTitle: merged.lookbookTitle || merged.title || raw.title,
        lookbookDesc: merged.lookbookDesc || merged.description || merged.subtitle || raw.subtitle,
        lookbookImage: merged.lookbookImage || merged.image,
        badge: merged.badge,
        ctaLabel: merged.ctaLabel,
        ctaHref: merged.ctaHref,
        secondaryCtaLabel: merged.secondaryCtaLabel,
        secondaryCtaHref: merged.secondaryCtaHref,
      },
    };
  }

  // 16. Room Grid
  if (rawType === 'room-grid' || rawType === 'room_grid') {
    return {
      type: 'room-grid',
      config: {
        tagline: merged.tagline || merged.badge,
        title: merged.title || raw.title,
        viewAllHref: merged.viewAllHref,
        viewAllLabel: merged.viewAllLabel,
        items: merged.items,
      },
    };
  }

  // 17. Product Matrix
  if (rawType === 'product-matrix' || rawType === 'product_matrix') {
    return {
      type: 'product-matrix',
      config: {
        title: merged.title || raw.title,
        subtitle: merged.subtitle || raw.subtitle,
        limit: merged.limit ? Number(merged.limit) : 3,
      },
    };
  }

  // 18. Custom Form
  if (rawType === 'custom_form' || rawType === 'form') {
    return {
      type: 'custom_form',
      config: {
        formId: merged.formId,
        formSlug: merged.formSlug,
        formTitle: merged.formTitle,
        heading: merged.heading || merged.title || raw.title,
        subtitle: merged.subtitle || raw.subtitle,
        containerWidth: merged.containerWidth,
        containerMaxWidth: merged.containerMaxWidth,
      },
    };
  }

  // 19. FAQ / Locations
  if (rawType === 'faq-locations' || rawType === 'faq_locations' || rawType === 'faq') {
    return {
      type: 'faq-locations',
      config: {
        locationsTitle: merged.locationsTitle,
        locations: merged.locations,
        contactCtaLabel: merged.contactCtaLabel,
        contactCtaHref: merged.contactCtaHref,
        centerImage: merged.centerImage,
        faqTitle: merged.faqTitle || merged.title || raw.title,
        faqs: merged.faqs,
      },
    };
  }

  // 20. Spacer
  if (rawType === 'spacer') {
    return {
      type: 'spacer',
      config: {
        height: merged.height ? Number(merged.height) : 32,
      },
    };
  }

  // Fallback: If customHtml is present in any other unrecognized type, render as custom section
  if (merged.customHtml || raw.customHtml) {
    return {
      type: 'custom',
      config: {
        title: merged.title || raw.title,
        subtitle: merged.subtitle || raw.subtitle,
        customHtml: merged.customHtml || raw.customHtml || '',
      },
    };
  }

  return null;
}
