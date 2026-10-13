import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Coin, SortKey } from './types';
import { useMarkets } from './hooks/useMarkets';
import { Toast } from './components/Toast';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { Filters } from './components/Filters';
import { MarketTable } from './components/MarketTable';
import { CoinModal } from './components/CoinModal';
import { filterAndSortCoins, toCsv } from './lib/market';
const readParam = (name: string, fallback: string) =>
  new URLSearchParams(location.search).get(name) || fallback;
export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(
    () => (localStorage.getItem('pulse-theme') as 'dark' | 'light') || 'dark',
  );
  const [query, setQuery] = useState(readParam('q', ''));
  const [queryInput, setQueryInput] = useState(query);
  const [category, setCategory] = useState(readParam('category', 'All assets'));
  const [change, setChange] = useState(readParam('change', 'Any change'));
  const [minCap, setMinCap] = useState(readParam('cap', ''));
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: 'rank', dir: 1 });
  const [selected, setSelected] = useState<Coin | null>(null);
  const [watch, setWatch] = useState<string[]>(
    () => JSON.parse(localStorage.getItem('pulse-watch') || '[]') as string[],
  );
  const { rows, loading, error, loadData, updated, lastUpdated } = useMarkets();
  useEffect(() => {
    const timer = setTimeout(() => setQuery(queryInput), 300);
    return () => clearTimeout(timer);
  }, [queryInput]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('pulse-theme', theme);
  }, [theme]);
  useEffect(() => {
    localStorage.setItem('pulse-watch', JSON.stringify(watch));
  }, [watch]);
  const sync = useCallback((next: Record<string, string>) => {
    const p = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => v && p.set(k, v));
    history.replaceState(null, '', p.toString() ? `?${p}` : location.pathname);
  }, []);
  useEffect(
    () =>
      sync({
        q: query,
        category: category === 'All assets' ? '' : category,
        change: change === 'Any change' ? '' : change,
        cap: minCap,
      }),
    [query, category, change, minCap, sync],
  );
  const view = useMemo(
    () => filterAndSortCoins(rows, { query, category, change, minCap, watch }, sort),
    [rows, query, category, change, minCap, sort, watch],
  );
  const toggleSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { ...s, dir: s.dir === 1 ? -1 : 1 } : { key, dir: 1 }));
  const exportCsv = () => {
    const csv = toCsv(view);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'pulseboard-assets.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const reset = () => {
    setQueryInput('');
    setQuery('');
    setCategory('All assets');
    setChange('Any change');
    setMinCap('');
  };
  return (
    <div className="app-shell">
      <Header
        theme={theme}
        updated={updated}
        onTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />
      <main className="content">
        <section className="intro">
          <div>
            <p className="eyebrow">OVERVIEW / MARKET</p>
            <h1>Market overview</h1>
            <p className="muted">Track the pulse of digital assets in one focused workspace.</p>
          </div>
          <div className="intro-actions">
            <span className="api-status">
              <i />{' '}
              {loading ? 'Loading market data' : lastUpdated ? 'CoinGecko API' : 'Demo market data'}
            </span>
            <button className="primary" onClick={exportCsv}>
              ⇩ Export CSV
            </button>
          </div>
        </section>
        <StatsCards />
        <section className="workspace">
          <Filters
            query={queryInput}
            category={category}
            change={change}
            minCap={minCap}
            onQuery={setQueryInput}
            onCategory={setCategory}
            onChange={setChange}
            onMinCap={setMinCap}
            onReset={reset}
          />
          <MarketTable
            rows={view}
            loading={loading}
            sort={sort}
            onSort={toggleSort}
            onSelect={setSelected}
            watch={watch}
            toggleWatch={(id) =>
              setWatch((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]))
            }
          />
        </section>
      </main>
      {selected && <CoinModal coin={selected} close={() => setSelected(null)} />}{' '}
      {error && (
        <Toast
          message={`${error} Showing ${lastUpdated ? 'previously loaded' : 'demo'} data.`}
          onRetry={() => void loadData()}
        />
      )}
    </div>
  );
}
