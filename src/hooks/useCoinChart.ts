import { useEffect, useState } from 'react';
import { getMarketChart } from '../api/coingecko';
const cache = new Map<string, Array<[number, number]>>();
export function useCoinChart(id: string, days: string) {
  const key = `${id}:${days}`;
  const [points, setPoints] = useState(cache.get(key) ?? []);
  const [loading, setLoading] = useState(!cache.has(key));
  const [error, setError] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    const cached = cache.get(key);
    if (cached) {
      setPoints(cached);
      setLoading(false);
      return () => controller.abort();
    }
    setLoading(true);
    setError(false);
    getMarketChart(id.replace(/-\d+$/, ''), days, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        cache.set(key, result);
        setPoints(result);
        setLoading(false);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError(true);
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [id, days, key]);
  return { points, loading, error };
}
