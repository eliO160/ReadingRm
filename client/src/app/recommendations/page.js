'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

import LinkButton from '@/components/ui/LinkButton';
import BookCover from '@/components/books/BookCover';
import { getBestCoverUrl } from '@/lib/covers';
import SearchResultsSkeleton from '@/components/search/SearchResultsSkeleton';
import BookDetailsPopover from '@/components/search/BookDetailsPopover';

const cache = new Map(); // simple in-memory cache

// Build a query string for /api/books based on URL search params
function buildQueryFromSearchParams(searchParams) {
  const p = new URLSearchParams();

  // Required: topic (subject/bookshelf/category)
  const topicRaw = (searchParams.get('topic') || '').trim();
  const topic = topicRaw || '';

  if (topic) {
    p.set('topic', topic);
  }

  // Optional: allow a couple of extra filters to be forwarded
  const passthroughKeys = [
    'languages',
    'mime_type',
    'sort',
    'page', // if you add pagination later
  ];

  passthroughKeys.forEach((key) => {
    const value = (searchParams.get(key) || '').trim();
    if (value) p.set(key, value);
  });

  const queryString = p.toString();
  const hasTopic = Boolean(topic);

  return {
    queryString,
    hasTopic,
    topic,
  };
}

export default function RecommendationsPage() {
  const searchParams = useSearchParams();

  const { queryString, hasTopic, topic } =
    buildQueryFromSearchParams(searchParams);

  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'error' | 'done'
  const [error, setError] = useState(null);

  // If you want to reuse the details popover here later:
  const [detailsBook, setDetailsBook] = useState(null);

  useEffect(() => {
    // No topic selected yet — don't fetch
    if (!hasTopic) {
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

        cache.set(queryString, books);
        setResults(books);
        setStatus('done');
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('Recommendations error:', err);
        setError('Failed to load recommendations');
        setStatus('error');
        setResults([]);
      }
    })();

    return () => ac.abort();
  }, [queryString, hasTopic]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-baseline justify-between gap-2">
        <div>
          {hasTopic && (
            <h1 className="text-2xl font-bold">
              Books in {' '}
              <span className="font-semibold">
                “{topic}”
              </span>
            </h1>
          )}
        </div>

        <Link
          href="/search"
          className="text-sm font-medium text-[color:var(--link)] hover:underline"
        >
          Back to search
        </Link>
      </div>

      {!hasTopic && (
        <p className="mt-4 text-sm opacity-80">
          Choose a category (like a Subject or Bookshelf tag) from a book’s
          details to see recommendations here.
        </p>
      )}

      {status === 'loading' && hasTopic && <SearchResultsSkeleton />}

      {status === 'error' && (
        <p className="mt-4 text-sm text-red-600">{error}</p>
      )}

      {status === 'done' && results.length === 0 && hasTopic && (
        <p className="mt-4 text-sm">
          No books found for category{' '}
          <code className="font-mono">&quot;{topic}&quot;</code>.
        </p>
      )}

      {status === 'done' && results.length > 0 && (
        <ul className="mt-4 space-y-6">
          {results.map((b) => {
            const coverUrl = getBestCoverUrl(b, 'medium');
            return (
              <li
                key={b.id}
                className="flex gap-4 border-b border-black/10 pb-4 dark:border-white/10"
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
                  <div className="line-clamp-2 text-lg font-semibold">
                    {b.title}
                  </div>
                  <div className="truncate text-sm opacity-80">
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

      {detailsBook && (
        <BookDetailsPopover
          book={detailsBook}
          onClose={() => setDetailsBook(null)}
        />
      )}
    </main>
  );
}
