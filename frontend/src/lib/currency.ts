export const getCurrencySymbol = (country?: string): string =>
  country === 'AMERICA' ? '$' : '₹';

export const formatPrice = (amount: number, country?: string): string =>
  `${getCurrencySymbol(country)}${amount.toLocaleString()}`;
