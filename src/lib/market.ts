import type { Coin, SortKey } from '../types';

export type MarketFilters = {
  query: string;
  category: string;
  change: string;
  minCap: string;
  watch: string[];
};
export function filterAndSortCoins(
  rows: Coin[],
  filters: MarketFilters,
  sort: { key: SortKey; dir: 1 | -1 },
) {
  const query = filters.query.trim().toLowerCase();
  return rows
    .filter((coin) => {
      const matchesQuery = !query || `${coin.name} ${coin.symbol}`.toLowerCase().includes(query);
      const matchesCategory =
        filters.category === 'All assets' ||
        (filters.category === 'Top 100' && coin.rank <= 100) ||
        (filters.category === 'Top 500' && coin.rank <= 500) ||
        (filters.category === 'Watchlist' && filters.watch.includes(coin.id));
      const matchesChange =
        filters.change === 'Any change' ||
        (filters.change === '+5% or more' && coin.day >= 5) ||
        (filters.change === 'Gainers' && coin.day > 0) ||
        (filters.change === 'Losers' && coin.day < 0);
      return (
        matchesQuery &&
        matchesCategory &&
        matchesChange &&
        (!filters.minCap || coin.cap >= Number(filters.minCap) * 1e9)
      );
    })
    .sort((a, b) => {
      const av = a[sort.key],
        bv = b[sort.key];
      const result =
        typeof av === 'string' ? av.localeCompare(bv as string) : (av as number) - (bv as number);
      return result * sort.dir;
    });
}
export function getVisibleRange(
  total: number,
  scrollTop: number,
  rowHeight = 58,
  viewportHeight = 500,
  overscan = 3,
) {
  const start = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  return {
    start,
    end: Math.min(total, start + Math.ceil(viewportHeight / rowHeight) + overscan * 2),
  };
}
export function toCsv(rows: Coin[]) {
  return [
    'Rank,Name,Symbol,Price,24h %,7d %,Market Cap,Volume 24h,Circulating Supply',
    ...rows.map((coin) =>
      [
        coin.rank,
        coin.name,
        coin.symbol,
        coin.price,
        coin.day,
        coin.week,
        coin.cap,
        coin.volume,
        coin.supply,
      ]
        .map(String)
        .join(','),
    ),
  ].join('\n');
}
