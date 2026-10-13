export const formatNumber = (n: number, compact = false) =>
  compact
    ? new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(n)
    : new Intl.NumberFormat('en-US', { maximumFractionDigits: n < 1 ? 6 : 2 }).format(n);
export const formatMoney = (n: number) => (n < 1 ? `$${n.toFixed(6)}` : `$${formatNumber(n)}`);
