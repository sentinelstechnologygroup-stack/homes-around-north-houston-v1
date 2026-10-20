import { useEffect, useState } from 'react';

export default function PropertySearchPreview() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/idx', { signal: controller.signal }).then(async response => {
      const result = await response.json();
      if (!response.ok) throw new Error('Property preview is temporarily unavailable.');
      setData(result);
    }).catch(reason => { if (reason.name !== 'AbortError') setError(reason.message); });
    return () => controller.abort();
  }, []);
  return <section aria-label="Property connection review" className="mb-8 rounded-xl border bg-white p-6">
    <h2 className="font-display text-2xl">Property connection review</h2>
    <p className="mt-2">Protected review of two selected properties. Full map search and listing alerts are still being prepared.</p>
    <p role="status" className="my-4">{error || (!data ? 'Loading properties…' : `${data.listings.length} properties available for review.`)}</p>
    <div className="grid gap-6 md:grid-cols-2">{data?.listings.map(listing => <article key={`${listing.boardId}:${listing.mlsNumber}`} className="rounded-lg border p-4">
      {listing.images[0] && <img src={listing.images[0]} alt={listing.address} className="h-56 w-full rounded object-cover" loading="lazy" />}
      <h3 className="mt-3 font-display text-xl">{listing.address}</h3>
      <p>{listing.city} · {Number.isFinite(Number(listing.price)) ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(listing.price)) : 'Price on request'}</p>
      <p>{listing.beds ?? '—'} beds · {listing.baths ?? '—'} baths</p>
      <p className="mt-2">Listed by {listing.brokerage || 'Listing brokerage unavailable'} · MLS #{listing.mlsNumber}</p>
    </article>)}</div>
    {data && <p className="mt-5 text-sm">{data.disclosure}</p>}
  </section>;
}
