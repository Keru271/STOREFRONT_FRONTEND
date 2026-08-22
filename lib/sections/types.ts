// ─── Section Types ────────────────────────────────────────────────────────────
// Defines the CMS page section schema used by the SectionResolver.

// ── Individual section configs ────────────────────────────────────────────────

export interface HeroSectionConfig {
  type: 'hero';
  config: {
    headline?: string;
    subheadline?: string;
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
    collection?: string;   // collection slug to filter
    category?: string;     // category slug to filter
    limit?: number;
    viewAllHref?: string;
  };
}

export interface BannerSectionConfig {
  type: 'banner';
  config: {
    title?: string;
    description?: string;
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
    testimonials?: Array<{
      name: string;
      rating: number;
      text: string;
      avatar?: string;
    }>;
  };
}

export interface TrustBadgesSectionConfig {
  type: 'trust-badges';
  config: {
    badges?: Array<{ icon: string; title: string; desc: string }>;
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
  | SpacerSectionConfig;

// ── Page Layout ───────────────────────────────────────────────────────────────

export interface PageLayout {
  page: string;
  sections: SectionConfig[];
}

// ── Default homepage layout ───────────────────────────────────────────────────
// Used as fallback when the CMS endpoint is unavailable.

export const DEFAULT_HOME_LAYOUT: PageLayout = {
  page: 'home',
  sections: [
    {
      type: 'hero',
      config: {
        headline: 'Shop the Latest Drops',
        subheadline: 'Discover thousands of products curated just for you. Free shipping on orders over $50.',
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
          { icon: '🚚', title: 'Free Shipping',   desc: 'On orders over $50' },
          { icon: '↩️', title: 'Easy Returns',    desc: '30-day return policy' },
          { icon: '🔒', title: 'Secure Payment',  desc: 'SSL encrypted checkout' },
          { icon: '💬', title: '24/7 Support',    desc: 'Always here to help' },
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
        limit: 12,
        viewAllHref: '/products?sort=newest',
      },
    },
    {
      type: 'banner',
      config: {
        title: 'Members get more',
        description: 'Join thousands of shoppers and unlock exclusive deals, early access, and free shipping.',
        ctaLabel: 'Join Free Today',
        ctaHref: '/auth/signup',
        variant: 'accent',
      },
    },
  ],
};
