import { useRef, useState } from 'react';
import type { Coin, SortKey } from '../types';
import { formatMoney, formatNumber } from '../lib/format';
import { Logo } from './CoinVisuals';
import { TableSkeleton } from './Skeleton';
import { getVisibleRange } from '../lib/market';
type Props = {
  rows: Coin[];
  sort: { key: SortKey; dir: 1 | -1 };
  onSort: (key: SortKey) => void;
  onSelect: (coin: Coin) => void;
  watch: string[];
  toggleWatch: (id: string) => void;
  loading?: boolean;
};
export function MarketTable({
  rows,
  sort,
  onSort,
  onSelect,
  watch,
  toggleWatch,
  loading = false,
}: Props) {
  const columns: [SortKey, string][] = [
    ['rank', '#'],
    ['name', 'Asset'],
    ['price', 'Price'],
    ['day', '24h %'],
    ['week', '7d %'],
    ['cap', 'Market cap'],
    ['volume', 'Volume (24h)'],
    ['supply', 'Circulating supply'],
  ];
  return (
    <div className="table-card">
      <div className="table-toolbar">
        <div>
          <strong>Assets</strong>
          <span className="result-count">{rows.length} visible</span>
        </div>
        <div className="table-legend">
          <span>
            <i className="green-dot" /> Gainers
          </span>
          <span>
            <i className="red-dot" /> Losers
          </span>
        </div>
      </div>
      <div className="table-head">
        {columns.map(([key, label], index) => (
          <button className={index === 1 ? 'name-col' : ''} key={key} onClick={() => onSort(key)}>
            {label} {sort.key === key && (sort.dir === 1 ? '↑' : '↓')}
          </button>
        ))}
      </div>
      {loading ? (
        <TableSkeleton />
      ) : (
        <VirtualList rows={rows} onSelect={onSelect} watch={watch} toggleWatch={toggleWatch} />
      )}
      <div className="table-footer">
        <span>Showing {rows.length} assets</span>
        <span>
          Scroll to explore <b>↓</b>
        </span>
      </div>
    </div>
  );
}
function VirtualList({
  rows,
  onSelect,
  watch,
  toggleWatch,
}: {
  rows: Coin[];
  onSelect: (c: Coin) => void;
  watch: string[];
  toggleWatch: (id: string) => void;
}) {
  const [scroll, setScroll] = useState(0);
  const h = 58;
  const { start, end } = getVisibleRange(rows.length, scroll, h);
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="virtual-wrap" ref={ref} onScroll={(e) => setScroll(e.currentTarget.scrollTop)}>
      <div style={{ height: rows.length * h, position: 'relative' }}>
        {rows.slice(start, end).map((c, i) => (
          <button
            className="table-row"
            style={{ top: (start + i) * h }}
            key={c.id}
            onClick={() => onSelect(c)}
          >
            <span className="rank">{c.rank}</span>
            <span className="asset">
              <Logo coin={c} />
              <span>
                <b>{c.name}</b>
                <small>{c.symbol}</small>
              </span>
            </span>
            <span className="price">{formatMoney(c.price)}</span>
            <span className={c.day >= 0 ? 'up' : 'down'}>
              {c.day >= 0 ? '+' : ''}
              {c.day.toFixed(2)}%
            </span>
            <span className={c.week >= 0 ? 'up' : 'down'}>
              {c.week >= 0 ? '+' : ''}
              {c.week.toFixed(2)}%
            </span>
            <span>{formatNumber(c.cap, true)}</span>
            <span className="volume">{formatNumber(c.volume, true)}</span>
            <span className="supply">{formatNumber(c.supply, true)}</span>
            <span
              className={'star ' + (watch.includes(c.id) ? 'active' : '')}
              role="button"
              aria-label="Toggle watchlist"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                toggleWatch(c.id);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.stopPropagation();
                  toggleWatch(c.id);
                }
              }}
            >
              ★
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
