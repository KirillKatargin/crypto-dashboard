export function TableSkeleton() {
  return (
    <div className="skeleton-list" aria-label="Loading market data">
      {Array.from({ length: 8 }, (_, i) => (
        <div className="skeleton-row" key={i}>
          <i />
          <i />
          <i />
          <i />
        </div>
      ))}
    </div>
  );
}
