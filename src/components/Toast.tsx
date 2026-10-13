export function Toast({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="toast" role="alert">
      <span>!</span>
      {message}
      <button onClick={onRetry}>Retry</button>
    </div>
  );
}
