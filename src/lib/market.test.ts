import { describe, expect, it } from 'vitest';
import { makeRows } from '../data';
import { filterAndSortCoins, getVisibleRange, toCsv } from './market';

describe('market functionality', () => {
  const rows = makeRows();
  it('creates a 500-row dataset and applies rank/change filters', () => {
    expect(rows).toHaveLength(500);
    expect(
      filterAndSortCoins(
        rows,
        { query: '', category: 'Top 100', change: 'Any change', minCap: '', watch: [] },
        { key: 'rank', dir: 1 },
      ),
    ).toHaveLength(100);
    expect(
      filterAndSortCoins(
        rows,
        { query: '', category: 'Top 500', change: 'Any change', minCap: '', watch: [] },
        { key: 'rank', dir: 1 },
      ),
    ).toHaveLength(500);
    expect(
      filterAndSortCoins(
        rows,
        { query: '', category: 'All assets', change: 'Gainers', minCap: '', watch: [] },
        { key: 'rank', dir: 1 },
      ).every((coin) => coin.day > 0),
    ).toBe(true);
  });
  it('searches by name or symbol, filters watchlist and minimum cap', () => {
    const watch = [rows[0].id];
    expect(
      filterAndSortCoins(
        rows,
        { query: 'BTC', category: 'All assets', change: 'Any change', minCap: '', watch },
        { key: 'rank', dir: 1 },
      )[0].symbol,
    ).toBe('BTC');
    expect(
      filterAndSortCoins(
        rows,
        { query: '', category: 'Watchlist', change: 'Any change', minCap: '', watch },
        { key: 'rank', dir: 1 },
      ),
    ).toHaveLength(1);
    expect(
      filterAndSortCoins(
        rows,
        { query: '', category: 'All assets', change: 'Any change', minCap: '1000', watch },
        { key: 'rank', dir: 1 },
      ).every((coin) => coin.cap >= 1e12),
    ).toBe(true);
  });
  it('sorts descending and exports the filtered rows to CSV', () => {
    const sorted = filterAndSortCoins(
      rows.slice(0, 3),
      { query: '', category: 'All assets', change: 'Any change', minCap: '', watch: [] },
      { key: 'price', dir: -1 },
    );
    expect(sorted[0].price).toBeGreaterThanOrEqual(sorted[1].price);
    const csv = toCsv(sorted.slice(0, 1));
    expect(csv.split('\n')).toHaveLength(2);
    expect(csv).toContain('Rank,Name,Symbol');
    expect(csv).toContain('BTC');
  });
});

describe('virtualized rendering range', () => {
  it('renders a small overscanned window for 500 rows', () => {
    const range = getVisibleRange(500, 0);
    expect(range.start).toBe(0);
    expect(range.end).toBeLessThan(30);
    const scrolled = getVisibleRange(500, 29_000);
    expect(scrolled.start).toBeGreaterThan(490);
    expect(scrolled.end).toBe(500);
  });

  it('calculates filtering and virtualization quickly', () => {
    const rows = makeRows();
    const started = performance.now();
    for (let i = 0; i < 100; i += 1) {
      filterAndSortCoins(
        rows,
        {
          query: i % 2 ? 'btc' : '',
          category: 'Top 500',
          change: 'Any change',
          minCap: '',
          watch: [],
        },
        { key: 'rank', dir: 1 },
      );
      getVisibleRange(rows.length, i * 58);
    }
    expect(performance.now() - started).toBeLessThan(250);
  });
});
