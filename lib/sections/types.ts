// ─── Section Types ────────────────────────────────────────────────────────────
// Defines the CMS page section schema used by the SectionResolver.

// ── Individual section configs ────────────────────────────────────────────────

export interface HeroSectionConfig {
  type: 'hero';
  config: {
    headline?: string;
    subheadline?: string;
    badge?: string;
    ctaLabel?: string;
    ctaHref?: string;
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
    backgroundImage?: string;
    stats?: Array<{ value: string; label: string }>;
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
    testimonials?: Array<{
      name: string;
      rating: number;
      text: string;
      avatar?: string;
      role?: string;
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
    titlePrefix?: string;
    titleHighlight?: string;
    image?: string;
    tabs?: SplitFeatureTab[];
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
  | SpacerSectionConfig;

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
