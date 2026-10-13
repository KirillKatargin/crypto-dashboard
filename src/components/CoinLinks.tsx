import { useEffect, useState } from 'react';
import { getCoinLinks } from '../api/coingecko';
type Links = Awaited<ReturnType<typeof getCoinLinks>>;
const cache = new Map<string, Links>();
export function CoinLinks({ id }: { id: string }) {
  const apiId = id.replace(/-\d+$/, '');
  const [links, setLinks] = useState<Links | null>(cache.get(apiId) ?? null);
  const [error, setError] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    if (!cache.has(apiId)) {
      getCoinLinks(apiId, controller.signal)
        .then((result) => {
          if (controller.signal.aborted) return;
          cache.set(apiId, result);
          setLinks(result);
        })
        .catch(() => {
          if (!controller.signal.aborted) setError(true);
        });
    }
    return () => controller.abort();
  }, [apiId]);
  return (
    <div className="modal-links">
      {links?.website && (
        <a href={links.website} target="_blank" rel="noreferrer">
          Official website ↗
        </a>
      )}
      {links?.explorer && (
        <a href={links.explorer} target="_blank" rel="noreferrer">
          Block explorer ↗
        </a>
      )}
      {!links && <span>{error ? 'Asset links unavailable' : 'Loading asset links…'}</span>}
      {links && !links.website && !links.explorer && <span>No links provided for this asset</span>}
    </div>
  );
}
