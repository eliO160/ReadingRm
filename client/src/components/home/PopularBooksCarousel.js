'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import BookCover from '@/components/books/BookCover';
import { getBestCoverUrl } from '@/lib/covers';
import LinkButton from '@/components/ui/LinkButton';
import BookDetailsPopover from '@/components/search/BookDetailsPopover';

function PopularBooksCarouselSkeleton({ title }) {
  const skeletonItems = Array.from({ length: 5 });

  return (
    <section className="mt-6">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="h-4 w-16 rounded bg-black/5 dark:bg-white/10" />
      </div>

      <div className="relative">
        <div
          className="
            flex gap-4 overflow-x-auto pb-2
            px-2 sm:px-4
          "
        >
          {skeletonItems.map((_, idx) => (
            <div
              key={idx}
              className="
                min-w-[260px] max-w-[260px] flex-shrink-0
                rounded-2xl border border-black/10 bg-white p-4
                shadow-sm dark:border-white/10 dark:bg-slate-900
                animate-pulse
              "
            >
              <div className="flex flex-col items-center gap-3">
                <div className="h-64 w-40 rounded-lg bg-black/5 dark:bg-white/10" />
                <div className="w-full space-y-2">
                  <div className="h-3 w-full rounded bg-black/5 dark:bg-white/10" />
                  <div className="h-3 w-3/4 rounded bg-black/5 dark:bg-white/10" />
                  <div className="h-3 w-2/3 rounded bg-black/5 dark:bg-white/10" />
                </div>
                <div className="mt-2 h-8 w-full rounded bg-black/5 dark:bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function PopularBooksCarousel({
  title = 'Trending',
  limit = 10,
}) {
  const [popular, setPopular] = useState([]);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'error' | 'success'
  const [error, setError] = useState(null);
  const [detailsBook, setDetailsBook] = useState(null);

  const scrollRef = useRef(null);

  // Close popover on Escape
  useEffect(() => {
    if (!detailsBook) return;
    const handler = (e) => {
      if (e.key === 'Escape') setDetailsBook(null);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [detailsBook]);

  useEffect(() => {
    let cancelled = false;

    async function loadPopular() {
      try {
        setStatus('loading');
        setError(null);

        const res = await fetch('/api/books?sort=popular&page=1');
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(
            text || `Popular books request failed with ${res.status}`
          );
        }

        const data = await res.json();
        const books = data.results ?? [];

        const top = [...books]
          .sort(
            (a, b) =>
              (b.download_count || 0) - (a.download_count || 0)
          )
          .slice(0, limit);

        if (!cancelled) {
          setPopular(top);
          setStatus('success');
        }
      } catch (err) {
        if (cancelled) return;
        console.error('Trending books error:', err);
        setError(err.message || 'Could not load trending books');
        setStatus('error');
      }
    }

    loadPopular();
    return () => {
      cancelled = true;
    };
  }, [limit]);

  const scrollByCard = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    const firstCard = container.querySelector('[data-card]');
    const cardWidth = firstCard ? firstCard.offsetWidth : 280;
    const distance = cardWidth * 1.1;

    container.scrollBy({
      left: direction === 'next' ? distance : -distance,
      behavior: 'smooth',
    });
  };

  // Loading state: skeleton only
  if (status === 'loading') {
    return <PopularBooksCarouselSkeleton title={title} />;
  }

  // Error state: skeleton + API-down message
  if (status === 'error') {
    return (
      <div className="mt-6">
        <PopularBooksCarouselSkeleton title={title} />
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
          Trending books are temporarily unavailable. ({error})
        </p>
      </div>
    );
  }

  // Success state but no data
  if (status === 'success' && popular.length === 0) {
    return (
      <section className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Link
            href="/search?sort=popular"
            className="text-xs font-medium text-[color:var(--link)] hover:underline"
          >
            See more
          </Link>
        </div>
        <p className="text-sm opacity-70">
          Trending books could not be loaded right now.
        </p>
      </section>
    );
  }

  if (status !== 'success') {
    return null;
  }

  return (
    <>
      <section className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Link
            href="/search?sort=popular"
            className="text-xs font-medium text-[color:var(--link)] hover:underline"
          >
            See more
          </Link>
        </div>

        <div className="relative">
          {/* Left chevron (desktop) */}
          <button
            type="button"
            onClick={() => scrollByCard('prev')}
            aria-label="Scroll previous"
            className="
              icon-circle-btn
              absolute left-0 top-1/2 z-10 hidden -translate-y-1/2
              md:flex
            "
          >
            ‹
          </button>

          {/* Right chevron (desktop) */}
          <button
            type="button"
            onClick={() => scrollByCard('next')}
            aria-label="Scroll next"
            className="
              icon-circle-btn
              absolute right-0 top-1/2 z-10 hidden -translate-y-1/2
              md:flex
            "
          >
            ›
          </button>

          {/* Scrollable row: mouse + touch */}
          <div
            ref={scrollRef}
            className="
              flex gap-4 overflow-x-auto pb-2
              px-2 sm:px-4
              scroll-smooth
            "
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // This line controls the left/right padding:
            // increase `px-2 sm:px-4` to push cards farther from the edges
          >
            {popular.map((book) => {
              const coverUrl = getBestCoverUrl(book, 'medium');

              return (
                <div
                  key={book.id}
                  data-card
                  className="
                    min-w-[260px] max-w-[260px] flex-shrink-0
                    rounded-2xl border border-black/10 bg-white p-4
                    shadow-sm
                    transition-transform transition-shadow duration-300 ease-out
                    hover:-translate-y-1 hover:shadow-lg
                    dark:border-white/10 dark:bg-[color:var(--surface-elevated-dark)]
                  "
                >
                  <div className="flex flex-col items-center gap-3">
                    {/* Cover */}
                    {coverUrl ? (
                      <BookCover
                        src={coverUrl}
                        title={book.title}
                        width={180}
                        height={270}
                        className="h-64 w-40 rounded-lg shadow-sm"
                      />
                    ) : (
                      <div className="flex h-64 w-40 items-center justify-center rounded-lg bg-black/5 text-xs opacity-60 dark:bg-white/10">
                        No cover
                      </div>
                    )}

                    {/* Title: assume 2 lines, fix height for uniform buttons */}
                    <div className="w-full text-left">
                      <div className="line-clamp-2 text-sm font-semibold leading-snug min-h-[3.25rem]">
                        {book.title}
                      </div>
                    </div>

                    {/* Buttons inline, uniform across cards */}
                    <div className="mt-2 flex w-full gap-2">
                      <LinkButton
                        href={`/book/${book.id}/read`}
                        className="flex-1 justify-center px-2 py-1.5 text-xs"
                      >
                        Read
                      </LinkButton>

                      <button
                        type="button"
                        onClick={() => setDetailsBook(book)}
                        className="btn flex-1"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {detailsBook && (
        <BookDetailsPopover
          book={detailsBook}
          onClose={() => setDetailsBook(null)}
        />
      )}

      

    </>
  );
}
