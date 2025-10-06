'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const cache = new Map(); //simple in-memory cache

export default function SearchResultsPage() {
  const q = (useSearchParams().get('q') || '').trim();
  const [results, setResults] = useState([]); //holds array of books to render
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'error' | 'success'
  const [error, setError] = useState(null); //holds error message string if any

  useEffect(() => {
    if (!q) {
      setResults([]);
      setStatus('idle');
      setError(null);
      return;
    }

    // Serve instantly from cache if present
    if (cache.has(q)) {
      setResults(cache.get(q));
      setStatus('done');
      return;
    }

    const ac = new AbortController();

    (async () => {
      try {
        setStatus('loading');
        setError(null);

        const res = await fetch(`/api/books?search=${encodeURIComponent(q)}`, {
          signal: ac.signal,
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        cache.set(q, data.results ?? []); //save to cache

        setResults(data.results ?? []);
        setStatus('done');
        
      } catch (error) {
        if(error.name === 'AbortError') return;
        setError('Failed to load results');
        setStatus('error');
        setResults([]);
      }
    })();

    return () => ac.abort();

  }, [q]);

  return (
    <main>
      <h1>Search Results</h1>
      {!q && (
        <p>Type a query in the search bar and press Enter</p>
      )}

      {status == 'loading' && <p>Searching...</p>}
      {status == 'error' && <p className="text-red-600">{error}</p>}

      {status == 'done' && results.length === 0 && (
        <p>No results found for `${q}`.</p>
      )}

      {results.length > 0 && (
        <ul>
        {results.map(b => (
          <li key={b.id}>
            <div>{b.title}</div>
            <div>{b.authors?.map(a => a.name).join(', ') || 'Unknown author'}</div>

            <div>
              <Link
                href={`/books/${b.id}`}
              >
                View details
              </Link>

              <Link
                href={`/book/${b.id}/read`}
                className="ml-4"
              >
                Read the book
              </Link>
            </div>
          </li>
        ))}
      </ul>
      )}
    </main>
  );
}
