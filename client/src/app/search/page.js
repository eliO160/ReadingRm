'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import LinkButton from '@/components/ui/LinkButton';
import BookCover from '@/components/BookCover';
import { getBestCoverUrl } from '@/lib/covers';
import SearchResultsSkeleton from '@/components/search/SearchResultsSkeleton';


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

      {!q && <p>Type a query in the search bar and press Enter</p>}

      {status === 'loading' && q && <SearchResultsSkeleton />}

      {status === 'error' && <p className="mt-4 text-red-600">{error}</p>}

      {status === 'done' && results.length === 0 && <p className="mt-4">No results found for `{q}`.</p>}

      {status === 'done' && results.length > 0 && (
        <ul className="mt-4 space-y-6">
          {results.map((b) => {
            const coverUrl = getBestCoverUrl(b, 'medium'); // returns a valid URL either way
            return (
              <li key={b.id} className="flex gap-4 border-b border-black/10 dark:border-white/10 pb-4">
                {/* Cover */}
                <div className="shrink-0">
                  {coverUrl ? (
                    <BookCover src={coverUrl} title={b.title} width={64} height={96} />
                  ) : (
                    <div className="flex h-24 w-16 items-center justify-center rounded-md bg-black/5 text-xs opacity-60 dark:bg-white/5">
                      No cover
                    </div>
                  )}
                </div>

                {/* Meta */}
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-lg">{b.title}</div>
                  <div className="opacity-80 truncate">
                    {b.authors?.map((a) => a.name).join(', ') || 'Unknown author'}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <LinkButton 
                      href={`/book/${b.id}/read`} 
                      className="btn px-3 py-1.5 text-sm"
                    >
                      Read the book
                    </LinkButton>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}