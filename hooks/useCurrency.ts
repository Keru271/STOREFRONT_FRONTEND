'use client';

import { useTheme } from '@/context/ThemeContext';
import { formatPrice, getCurrencySymbol } from '@/lib/currency';

export function useCurrency() {
  const { theme } = useTheme();
  const currency = theme?.currency || 'USD';
  const language = theme?.language || 'en-US';

  const format = (amount?: number | null) => {
    return formatPrice(amount, currency, language);
  };

  const symbol = getCurrencySymbol(currency);

  return {
    currency,
    symbol,
    formatPrice: format,
  };
}
