import { getProducts } from './products';
import { apiClient } from './client';
import type { Product } from './types';

export interface AiShoppingMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  products?: Product[];
  suggestedPrompts?: string[];
}

interface ParsedIntent {
  query: string;
  category?: string;
  maxPrice?: number;
  minPrice?: number;
  color?: string;
  style?: string;
  material?: string;
  isCheaperRequest?: boolean;
  isGiftRequest?: boolean;
}

function parseCustomerQuery(message: string, previousProducts: Product[] = []): ParsedIntent {
  const lower = message.toLowerCase().trim();

  // 1. Price Budget Extraction (e.g. "under ₹2,000", "below 1500", "under $50")
  let maxPrice: number | undefined;
  let minPrice: number | undefined;
  const underPriceMatch = lower.match(/(?:under|below|less than|max|budget of|within)\s*(?:₹|rs\.?|\$)?\s*([0-9,]+)/i);
  if (underPriceMatch && underPriceMatch[1]) {
    maxPrice = parseFloat(underPriceMatch[1].replace(/,/g, ''));
  }

  const betweenMatch = lower.match(/(?:between)\s*(?:₹|rs\.?|\$)?\s*([0-9,]+)\s*(?:and|to|-)\s*(?:₹|rs\.?|\$)?\s*([0-9,]+)/i);
  if (betweenMatch && betweenMatch[1] && betweenMatch[2]) {
    minPrice = parseFloat(betweenMatch[1].replace(/,/g, ''));
    maxPrice = parseFloat(betweenMatch[2].replace(/,/g, ''));
  }

  // 2. Relative "More Affordable / Cheaper" Extraction
  const isCheaperRequest =
    lower.includes('cheaper') ||
    lower.includes('more affordable') ||
    lower.includes('lower price') ||
    lower.includes('less expensive') ||
    lower.includes('budget option');

  if (isCheaperRequest && previousProducts.length > 0) {
    const minPreviousPrice = Math.min(...previousProducts.map((p) => p.price));
    maxPrice = minPreviousPrice * 0.85; // Look for items 15%+ cheaper
  }

  // 3. Color extraction
  const colors = ['black', 'white', 'brown', 'tan', 'blue', 'navy', 'green', 'red', 'gold', 'silver', 'grey', 'gray', 'pink', 'yellow'];
  const matchedColor = colors.find((c) => lower.includes(c));

  // 4. Style & Material extraction
  const styles = ['formal', 'casual', 'minimal', 'luxury', 'artisan', 'vintage', 'modern', 'streetwear', 'classic', 'sport'];
  const matchedStyle = styles.find((s) => lower.includes(s));

  const materials = ['leather', 'wood', 'cotton', 'silk', 'ceramic', 'brass', 'canvas', 'organic', 'gold', 'titanium'];
  const matchedMaterial = materials.find((m) => lower.includes(m));

  // 5. Category / Keywords
  const isGiftRequest = lower.includes('gift') || lower.includes('present') || lower.includes('birthday');

  return {
    query: lower,
    maxPrice,
    minPrice,
    color: matchedColor,
    style: matchedStyle,
    material: matchedMaterial,
    isCheaperRequest,
    isGiftRequest,
  };
}

export async function processCustomerAiShopping(
  message: string,
  history: AiShoppingMessage[] = [],
  currency: string = 'INR'
): Promise<{
  text: string;
  products?: Product[];
  suggestedPrompts?: string[];
}> {
  // Try calling backend LLM + PostgreSQL vector & filter search endpoint first
  try {
    const backendRes = await apiClient.post<any>('/api/products/ai-search', {
      query: message,
      currency,
      limit: 4,
    });

    if (backendRes && backendRes.products && backendRes.products.length > 0) {
      return {
        text: backendRes.text,
        products: backendRes.products,
        suggestedPrompts: backendRes.suggestedPrompts,
      };
    }
  } catch (err) {
    console.warn('Backend AI Shopping Search notice, utilizing resilient client engine fallback:', err);
  }

  // Collect previously shown products for context follow-ups
  const previousProducts: Product[] = [];
  history.forEach((h) => {
    if (h.products) previousProducts.push(...h.products);
  });

  const intent = parseCustomerQuery(message, previousProducts);
  const currencySymbol = currency === 'INR' ? '₹' : '$';

  // Fetch candidate products from the active catalog
  let allCatalogProducts: Product[] = [];
  try {
    allCatalogProducts = await getProducts({ limit: 40 });
  } catch (err) {
    console.warn('Could not fetch catalog for AI shopping, using fallback:', err);
  }

  if (allCatalogProducts.length === 0) {
    // Graceful fallback mock catalog if empty
    allCatalogProducts = [
      {
        id: 'p1',
        name: 'The Bifold Artisan Wallet',
        price: currency === 'INR' ? 1899 : 38,
        compareAtPrice: currency === 'INR' ? 2499 : 50,
        images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80'],
        tags: 'leather, formal, black, wallet, classic',
        category: 'Wallets',
        rating: 4.9,
        reviewsCount: 128,
        slug: 'the-bifold-artisan-wallet',
        stock: 45,
      } as any,
      {
        id: 'p2',
        name: 'The Slim Minimalist Card Sleeve',
        price: currency === 'INR' ? 1299 : 25,
        compareAtPrice: currency === 'INR' ? 1599 : 32,
        images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80'],
        tags: 'leather, minimal, black, cardholder, pocket',
        category: 'Accessories',
        rating: 4.8,
        reviewsCount: 94,
        slug: 'the-slim-minimalist-card-sleeve',
        stock: 60,
      } as any,
      {
        id: 'p3',
        name: 'The Executive Valet Tray',
        price: currency === 'INR' ? 1499 : 28,
        compareAtPrice: currency === 'INR' ? 1899 : 35,
        images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80'],
        tags: 'desk, organizer, tray, leather, brown',
        category: 'Desk',
        rating: 4.9,
        reviewsCount: 52,
        slug: 'the-executive-valet-tray',
        stock: 30,
      } as any,
      {
        id: 'p4',
        name: 'The Voyager Weekender Duffel',
        price: currency === 'INR' ? 8999 : 180,
        compareAtPrice: currency === 'INR' ? 11999 : 240,
        images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80'],
        tags: 'bag, duffel, travel, luxury, brown',
        category: 'Bags',
        rating: 5.0,
        reviewsCount: 41,
        slug: 'the-voyager-weekender-duffel',
        stock: 15,
      } as any,
    ];
  }

  // 1. Scoring & Filtering Algorithm
  const scored = allCatalogProducts.map((p) => {
    let score = 0;
    const titleLower = (p.name || '').toLowerCase();
    const descLower = (p.description || '').toLowerCase();
    const tagsLower = Array.isArray(p.tags) ? p.tags.join(' ').toLowerCase() : (p.tags || '').toLowerCase();
    const categoryLower = (p.categoryName || p.category || '').toLowerCase();
    const fullText = `${titleLower} ${descLower} ${tagsLower} ${categoryLower}`;

    // Price filtering
    if (intent.maxPrice !== undefined) {
      if (p.price <= intent.maxPrice) {
        score += 25;
      } else {
        score -= 50; // Heavy penalty if outside budget
      }
    }

    if (intent.minPrice !== undefined && p.price >= intent.minPrice) {
      score += 15;
    }

    // Color match
    if (intent.color && fullText.includes(intent.color)) {
      score += 20;
    }

    // Style match
    if (intent.style && fullText.includes(intent.style)) {
      score += 20;
    }

    // Material match
    if (intent.material && fullText.includes(intent.material)) {
      score += 20;
    }

    // Keyword tokens
    const tokens = intent.query.split(/\s+/).filter((w) => w.length > 2);
    tokens.forEach((token) => {
      if (['under', 'below', 'need', 'want', 'show', 'find', 'some', 'with'].includes(token)) return;
      if (fullText.includes(token)) {
        score += 15;
      }
    });

    // Rating boost
    if (p.rating && p.rating >= 4.5) {
      score += 5;
    }

    return { product: p, score };
  });

  // Filter positive scores or fallback to top items
  let matched = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score).map((s) => s.product);

  if (matched.length === 0) {
    const max = intent.maxPrice;
    if (max !== undefined) {
      matched = allCatalogProducts.filter((p) => p.price <= max);
    }
    if (matched.length === 0) {
      matched = allCatalogProducts.slice(0, 3);
    }
  }

  const topRecommendations = matched.slice(0, 3);

  // 2. Synthesize Conversational Response Copy
  let text = '';
  let suggestedPrompts: string[] = [];

  if (intent.isCheaperRequest) {
    text = `I found **${matched.length} more affordable alternatives** with similar craftsmanship and aesthetic:`;
    suggestedPrompts = [
      'Show me matching accessories',
      'What are your top customer favorites?',
      'Do you offer free shipping?',
    ];
  } else if (intent.maxPrice !== undefined) {
    text = `I found **${matched.length} products** in our catalog. Here are **${topRecommendations.length} top picks** that match your budget under **${currencySymbol}${intent.maxPrice.toLocaleString()}**:`;
    suggestedPrompts = [
      'Show something similar but more affordable',
      'What are the best customer reviews on these?',
      'Any gift packaging options?',
    ];
  } else if (intent.isGiftRequest) {
    text = `Here are our **most cherished gift recommendations**, thoughtfully handcrafted and packaged for a lasting impression:`;
    suggestedPrompts = [
      `Gift options under ${currencySymbol}2,000`,
      'Show me everyday accessories',
      'What is your return policy?',
    ];
  } else {
    text = `Here are **${topRecommendations.length} curated pieces** matching your request:`;
    suggestedPrompts = [
      `Show products under ${currencySymbol}2,000`,
      'Show me something more affordable',
      'What are your best sellers?',
    ];
  }

  return {
    text,
    products: topRecommendations,
    suggestedPrompts,
  };
}
