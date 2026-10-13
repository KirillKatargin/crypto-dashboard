type Props = { theme: 'dark' | 'light'; updated: number | null; onTheme: () => void };
export function Header({ theme, updated, onTheme }: Props) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark">✦</span>
        <span>
          pulse<span>board</span>
        </span>
        <small>MARKET INTELLIGENCE</small>
      </div>
      <div className="top-actions">
        <span className="live-dot" />
        <span className="updated">
          {updated === null ? 'Demo data · not yet updated' : `Last updated: ${updated}s ago`}
        </span>
        <button className="icon-button" aria-label="Toggle theme" onClick={onTheme}>
          {theme === 'dark' ? '☼' : '☾'}
        </button>
        <div className="avatar">AM</div>
      </div>
    </header>
  );
}
