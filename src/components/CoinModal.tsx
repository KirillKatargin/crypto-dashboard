import { useState } from 'react';
import { CoinLinks } from './CoinLinks';
import type { Coin } from '../types';
import { formatMoney, formatNumber } from '../lib/format';
import { Logo, Sparkline } from './CoinVisuals';
import { useCoinChart } from '../hooks/useCoinChart';
export function CoinModal({ coin, close }: { coin: Coin; close: () => void }) {
  const [period, setPeriod] = useState('1');
  const chart = useCoinChart(coin.id, period);
  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" aria-label="Close details" onClick={close}>
          ×
        </button>
        <div className="modal-title">
          <Logo coin={coin} />
          <div>
            <h2>
              {coin.name} <span>{coin.symbol}</span>
            </h2>
            <p>Rank #{coin.rank} · Digital asset</p>
          </div>
          <div className="modal-price">
            <strong>{formatMoney(coin.price)}</strong>
            <em className={coin.day >= 0 ? 'up' : 'down'}>
              {coin.day >= 0 ? '+' : ''}
              {coin.day.toFixed(2)}% today
            </em>
          </div>
        </div>
        <div className="chart-tabs">
          {[
            ['1', '1D'],
            ['7', '7D'],
            ['30', '30D'],
            ['365', '1Y'],
          ].map(([value, label]) => (
            <button
              key={value}
              className={period === value ? 'active' : ''}
              onClick={() => setPeriod(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="chart">
          {chart.loading ? (
            <div className="chart-loading">Loading chart…</div>
          ) : (
            <Sparkline positive={coin.day >= 0} values={chart.points.map((point) => point[1])} />
          )}
          <div className="chart-labels">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>Now</span>
          </div>
        </div>
        <div className="metrics">
          <div>
            <span>Market cap</span>
            <b>{formatNumber(coin.cap, true)}</b>
          </div>
          <div>
            <span>24h volume</span>
            <b>{formatNumber(coin.volume, true)}</b>
          </div>
          <div>
            <span>Circulating supply</span>
            <b>
              {formatNumber(coin.supply, true)} {coin.symbol}
            </b>
          </div>
          <div>
            <span>Market dominance</span>
            <b>5.4%</b>
          </div>
        </div>
        <CoinLinks key={coin.id} id={coin.id} />
      </div>
    </div>
  );
}
