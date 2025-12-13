'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

import LinkButton from '@/components/ui/LinkButton';
import BookCover from '@/components/books/BookCover';
import { getBestCoverUrl } from '@/lib/covers';
import SearchResultsSkeleton from '@/components/search/SearchResultsSkeleton';
import BookDetailsPopover from '@/components/search/BookDetailsPopover';

const cache = new Map(); 

function buildQueryFromSearchParams(searchParams) {
  const p = new URLSearchParams();

  // Old simple search param
  const qRaw = (searchParams.get('q') || '').trim();
  // Advanced form's explicit `search` param (takes precedence if present)
  const advSearchRaw = (searchParams.get('search') || '').trim();

  const effectiveSearch = advSearchRaw || qRaw;
  if (effectiveSearch) {
    p.set('search', effectiveSearch);
  }

  // Other advanced params from AdvancedSearchForm
  const passthroughKeys = [
    'topic',
    'author_year_start',
    'author_year_end',
    'languages',
    'mime_type',
    'copyright',
    'sort',
    'page', // future work: pagination
  ];

  passthroughKeys.forEach((key) => {
    const value = (searchParams.get(key) || '').trim();
    if (value) p.set(key, value);
  });

  const queryString = p.toString();
  const hasFilters = queryString.length > 0;

  return {
    queryString,
    hasFilters,
    displayQuery: effectiveSearch, // for “No results found for …”
  };
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams();

  const { queryString, hasFilters, displayQuery } =
    buildQueryFromSearchParams(searchParams);

  const [results, setResults] = useState([]); // holds array of books to render
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'error' | 'done'
  const [error, setError] = useState(null); // holds error message string if any

  const [detailsBook, setDetailsBook] = useState(null);

  // Close details popover with Escape key
  useEffect(() => {
    if (!detailsBook) return;

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setDetailsBook(null);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [detailsBook]);

  useEffect(() => {
    // No search or filters yet — stay idle
    if (!hasFilters) {
      setResults([]);
      setStatus('idle');
      setError(null);
      return;
    }

    // Serve instantly from cache if present
    if (cache.has(queryString)) {
      setResults(cache.get(queryString));
      setStatus('done');
      return;
    }

    const ac = new AbortController();

    (async () => {
      try {
        setStatus('loading');
        setError(null);

        const url = `/api/books?${queryString}`;
        const res = await fetch(url, { signal: ac.signal });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const books = data.results ?? [];

        cache.set(queryString, books); // save to cache

        setResults(books);
        setStatus('done');
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('Search error:', err);
        setError('Failed to load results');
        setStatus('error');
        setResults([]);
      }
    })();

    return () => ac.abort();
  }, [queryString, hasFilters]);

  return (
    <main>
      <div className="flex items-baseline justify-between gap-2">
        <h1 className="text-2xl font-bold">Search Results</h1>
        <Link
          href="/search/advanced"
          className="text-sm font-medium text-[color:var(--link)] hover:underline"
        >
          Advanced search
        </Link>
      </div>

      {!hasFilters && (
        <p className="mt-2 opacity-80">
          Type a query in the search bar or use Advanced search to get started.
        </p>
      )}

      {status === 'loading' && hasFilters && <SearchResultsSkeleton />}

      {status === 'error' && (
        <p className="mt-4 text-red-600 text-sm">{error}</p>
      )}

      {status === 'done' && results.length === 0 && (
        <p className="mt-4 text-sm">
          No results found for{' '}
          {displayQuery ? (
            <code className="font-mono">&quot;{displayQuery}&quot;</code>
          ) : (
            'these filters'
          )}
          .
        </p>
      )}

      {status === 'done' && results.length > 0 && (
        <ul className="mt-4 space-y-6">
          {results.map((b) => {
            const coverUrl = getBestCoverUrl(b, 'medium'); // returns a valid URL either way
            return (
              <li
                key={b.id}
                className="flex gap-4 border-b border-black/10 dark:border-white/10 pb-4"
              >
                {/* Cover */}
                <div className="shrink-0">
                  {coverUrl ? (
                    <BookCover
                      src={coverUrl}
                      title={b.title}
                      width={64}
                      height={96}
                    />
                  ) : (
                    <div className="flex h-24 w-16 items-center justify-center rounded-md bg-black/5 text-xs opacity-60 dark:bg-white/5">
                      No cover
                    </div>
                  )}
                </div>

                {/* Meta */}
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-lg line-clamp-2">
                    {b.title}
                  </div>
                  <div className="opacity-80 truncate text-sm">
                    {b.authors?.map((a) => a.name).join(', ') ||
                      'Unknown author'}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <LinkButton
                      href={`/book/${b.id}/read`}
                      className="px-3 py-1.5 text-sm"
                    >
                      Read the book
                    </LinkButton>

                    {/* Read Details button */}
                    <button
                      type="button"
                      onClick={() => setDetailsBook(b)}
                      className="rounded-md border border-black/10 px-3 py-1.5 text-sm font-medium hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
                    >
                      Read Details
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Details popover */}
      {detailsBook && (
        <BookDetailsPopover
          book={detailsBook}
          onClose={() => setDetailsBook(null)}
        />
      )}
    </main>
  );
}
