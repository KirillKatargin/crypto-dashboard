import type { Coin } from '../types';
export function Logo({ coin }: { coin: Coin }) {
  return (
    <span className="coin-logo" style={{ background: coin.color }}>
      {coin.symbol.slice(0, 1)}
    </span>
  );
}
export function Sparkline({ positive = true, values }: { positive?: boolean; values?: number[] }) {
  const fallback = Array.from(
    { length: 34 },
    (_, i) => `${i * 10},${34 - (Math.sin(i / 3) * 7 + (positive ? i * 0.65 : -i * 0.48) + 13)}`,
  ).join(' ');
  const plotted = values?.length
    ? (() => {
        const min = Math.min(...values),
          max = Math.max(...values),
          span = max - min || 1;
        return values
          .map(
            (value, index) =>
              `${(index / (values.length - 1 || 1)) * 330},${36 - ((value - min) / span) * 30}`,
          )
          .join(' ');
      })()
    : fallback;
  return (
    <svg className="sparkline" viewBox="0 0 330 40" preserveAspectRatio="none" aria-hidden="true">
      <polyline
        points={plotted}
        fill="none"
        stroke={positive ? '#40d9a1' : '#ff6b7d'}
        strokeWidth="2"
      />
    </svg>
  );
}
