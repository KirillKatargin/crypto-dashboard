type Props = {
  query: string;
  category: string;
  change: string;
  minCap: string;
  onQuery: (v: string) => void;
  onCategory: (v: string) => void;
  onChange: (v: string) => void;
  onMinCap: (v: string) => void;
  onReset: () => void;
};
export function Filters({
  query,
  category,
  change,
  minCap,
  onQuery,
  onCategory,
  onChange,
  onMinCap,
  onReset,
}: Props) {
  return (
    <aside className="filters">
      <div className="section-label">
        FILTERS{' '}
        <button className="reset" onClick={onReset}>
          Reset
        </button>
      </div>
      <label className="search">
        <span>⌕</span>
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search assets…"
        />
        <kbd>⌘ K</kbd>
      </label>
      <label>
        Category
        <select value={category} onChange={(e) => onCategory(e.target.value)}>
          <option>All assets</option>
          <option>Top 100</option>
          <option>Top 500</option>
          <option>Watchlist</option>
        </select>
      </label>
      <label>
        24h performance
        <select value={change} onChange={(e) => onChange(e.target.value)}>
          <option>Any change</option>
          <option>+5% or more</option>
          <option>Gainers</option>
          <option>Losers</option>
        </select>
      </label>
      <label>
        Min. market cap
        <div className="input-unit">
          <input
            type="number"
            value={minCap}
            onChange={(e) => onMinCap(e.target.value)}
            placeholder="0"
          />
          <span>USD</span>
        </div>
      </label>
      <div className="filter-note">
        <span>⌁</span>
        <p>
          Filters are shareable
          <br />
          <small>Changes sync to the URL</small>
        </p>
      </div>
    </aside>
  );
}
