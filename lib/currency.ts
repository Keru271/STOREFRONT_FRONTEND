// ─── Central Currency Formatter ────────────────────────────────────────────────
// Formats product prices and order totals using the merchant's CMS-configured currency.

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  CAD: 'CA$',
  AUD: 'A$',
  JPY: '¥',
  AED: 'AED ',
  SGD: 'SG$',
  CNY: '¥',
  CHF: 'CHF ',
  NZD: 'NZ$',
  BRL: 'R$',
  MXN: 'MX$',
};

/**
 * Returns the symbol for a given ISO currency code.
 */
export function getCurrencySymbol(currency: string = 'USD'): string {
  const upper = (currency || 'USD').toUpperCase();
  return CURRENCY_SYMBOLS[upper] || `${upper} `;
}

/**
 * Formats a numeric price into a localized currency string.
 */
export function formatPrice(
  amount?: number | null,
  currency: string = 'USD',
  language: string = 'en-US'
): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return `${getCurrencySymbol(currency)}0.00`;
  }

  try {
    return new Intl.NumberFormat(language || 'en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    const symbol = getCurrencySymbol(currency);
    return `${symbol}${amount.toFixed(2)}`;
  }
}
