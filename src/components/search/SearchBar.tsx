import { useState, useEffect, useRef } from 'react';
import { geocode } from '../../services/search/geocode';
import { useAddressStore } from '../../store/address-store';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setLocation = useAddressStore((s) => s.setLocation);
  const clearLocation = useAddressStore((s) => s.clear);
  const coordinates = useAddressStore((s) => s.coordinates);
  const label = useAddressStore((s) => s.label);

  const isOwnSearch = useRef(false);
  const searchIdRef = useRef(0);

  useEffect(() => {
    if (isOwnSearch.current) {
      isOwnSearch.current = false;
      return;
    }
    if (coordinates) {
      setQuery('');
      setError('');
    }
  }, [coordinates, label]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    const mySearchId = ++searchIdRef.current;
    setLoading(true);
    setError('');

    try {
      const result = await geocode(trimmed);
      if (mySearchId !== searchIdRef.current) return;
      if (result) {
        isOwnSearch.current = true;
        setLocation(result.coordinates, result.label || trimmed);
      } else {
        clearLocation();
        setError('Address not found. Try a different address or click the map.');
      }
    } catch {
      if (mySearchId !== searchIdRef.current) return;
      clearLocation();
      setError('Search failed. Please try again.');
    } finally {
      if (mySearchId === searchIdRef.current) setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-start w-full flex-wrap sm:flex-nowrap">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter a Montgomery address"
        aria-label="Address search"
        className="flex-1 min-w-0 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm shadow-sm transition placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <button
        type="submit"
        disabled={!query.trim()}
        aria-label="Search address"
        className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
      {error && (
        <p className="w-full rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 ring-1 ring-red-100 sm:w-auto sm:self-center">{error}</p>
      )}
    </form>
  );
}
