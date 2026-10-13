import { mapApiCoin } from '../data';
import { z } from 'zod';

const baseUrl = 'https://api.coingecko.com/api/v3';
const marketSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    symbol: z.string(),
    image: z.string().optional(),
    current_price: z.number().nullable(),
    market_cap_rank: z.number().nullable(),
    price_change_percentage_24h: z.number().nullable(),
    price_change_percentage_7d_in_currency: z.number().nullable(),
    market_cap: z.number().nullable(),
    total_volume: z.number().nullable(),
    circulating_supply: z.number().nullable(),
  }),
);
const chartSchema = z.object({ prices: z.array(z.tuple([z.number(), z.number()])) });
export async function getMarkets(signal: AbortSignal) {
  const result = [];
  for (const page of [1, 2]) {
    const response = await fetch(
      `${baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=${page}&sparkline=false&price_change_percentage=24h,7d`,
      { signal },
    );
    if (!response.ok) throw new Error(`CoinGecko: HTTP ${response.status}`);
    const data = marketSchema.parse(await response.json());
    if (!data.length) throw new Error('Empty market response');
    result.push(
      ...data.map((value: unknown, index: number) => {
        if (typeof value !== 'object' || value === null || !('id' in value))
          throw new Error('Invalid market response');
        return mapApiCoin(value as Record<string, unknown>, (page - 1) * 250 + index);
      }),
    );
  }
  return result;
}

export async function getMarketChart(id: string, days: string, signal: AbortSignal) {
  const response = await fetch(
    `${baseUrl}/coins/${encodeURIComponent(id)}/market_chart?vs_currency=usd&days=${days}`,
    { signal },
  );
  if (!response.ok) throw new Error(`CoinGecko chart: HTTP ${response.status}`);
  return chartSchema.parse(await response.json()).prices;
}

export async function getCoinLinks(id: string, signal: AbortSignal) {
  const response = await fetch(
    `${baseUrl}/coins/${encodeURIComponent(id)}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false`,
    { signal },
  );
  if (!response.ok) throw new Error('Could not load asset links');
  const data: unknown = await response.json();
  const links =
    typeof data === 'object' && data !== null && 'links' in data ? data.links : undefined;
  const validUrl = (values: unknown) =>
    Array.isArray(values)
      ? values.find(
          (value: unknown): value is string =>
            typeof value === 'string' && /^https?:\/\//.test(value),
        )
      : undefined;
  if (typeof links !== 'object' || links === null) return {};
  return {
    website: validUrl('homepage' in links ? links.homepage : undefined),
    explorer: validUrl('blockchain_site' in links ? links.blockchain_site : undefined),
  };
}
