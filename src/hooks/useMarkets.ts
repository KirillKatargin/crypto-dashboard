import { useCallback, useEffect, useRef, useState } from 'react';
import { getMarkets } from '../api/coingecko';
import { makeRows } from '../data';

export function useMarkets() {
  const cacheKey = 'pulse-markets-v1';
  const [rows, setRows] = useState(makeRows);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now);
  const request = useRef<AbortController | null>(null);
  const loadData = useCallback(async (force = false) => {
    if (!force) {
      try {
        const cached = JSON.parse(sessionStorage.getItem(cacheKey) || 'null') as {
          rows: ReturnType<typeof makeRows>;
          timestamp: number;
        } | null;
        if (cached && Date.now() - cached.timestamp < 60_000) {
          setRows(cached.rows);
          setLastUpdated(cached.timestamp);
          setNow(Date.now());
          setLoading(false);
          return;
        }
      } catch {
        /* Ignore malformed browser cache and fetch fresh data. */
      }
    }
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    setError(null);
    try {
      const nextRows = await getMarkets(controller.signal);
      if (controller.signal.aborted) return;
      setRows(nextRows);
      const timestamp = Date.now();
      setLastUpdated(timestamp);
      sessionStorage.setItem(cacheKey, JSON.stringify({ rows: nextRows, timestamp }));
      setNow(Date.now());
    } catch {
      if (!controller.signal.aborted) setError('CoinGecko is unavailable. Try again shortly.');
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);
  useEffect(() => {
    void loadData();
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      request.current?.abort();
      clearInterval(timer);
    };
  }, [loadData]);
  return {
    rows,
    loading,
    error,
    loadData,
    lastUpdated,
    updated: lastUpdated === null ? null : Math.max(0, Math.floor((now - lastUpdated) / 1000)),
  };
}
