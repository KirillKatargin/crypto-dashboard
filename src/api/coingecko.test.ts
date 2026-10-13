import { afterEach, describe, expect, it, vi } from 'vitest';
import { getMarketChart, getMarkets } from './coingecko';

const market = (id: string) => ({
  id,
  name: id === 'bitcoin' ? 'Bitcoin' : 'Ethereum',
  symbol: id.slice(0, 3),
  image: '',
  current_price: 100,
  market_cap_rank: 1,
  price_change_percentage_24h: 2,
  price_change_percentage_7d_in_currency: 4,
  market_cap: 10_000_000_000,
  total_volume: 100_000_000,
  circulating_supply: 1_000_000,
});

afterEach(() => vi.restoreAllMocks());
describe('CoinGecko API client', () => {
  it('loads both market pages and maps validated records', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => [market('bitcoin')] });
    vi.stubGlobal('fetch', fetchMock);
    const result = await getMarkets(new AbortController().signal);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result[0]).toMatchObject({ id: 'bitcoin', name: 'Bitcoin', price: 100, day: 2 });
  });
  it('rejects malformed chart data instead of rendering invalid points', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ prices: [['bad', 100]] }) }),
    );
    await expect(getMarketChart('bitcoin', '7', new AbortController().signal)).rejects.toThrow();
  });
});
