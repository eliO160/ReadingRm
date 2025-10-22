//reader page
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import DOMPurify from 'isomorphic-dompurify';
import Image from 'next/image';
import { getBestCoverUrl } from '@/lib/covers';
import { useReaderPrefs } from '@/components/customizations/useReaderPrefs';
import ReaderSettingsPopover from '@/components/customizations/ReaderSettingsPopover';

const cx = (...x) => x.filter(Boolean).join(' ');

export default function BookReaderPage() {
  const { id } = useParams();
  const { prefs, setPref } = useReaderPrefs();
  const { size, mode, width, font } = prefs;

  const [rawHtml, setRawHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  //hold book metadata for title/author/cover
  const [book, setBook] = useState(null);
  const [metaError, setMetaError] = useState(null);

  useEffect(() => {
    let alive = true;
    //Fetch html
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch(`/api/books/html/${id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const html = await res.text();
        if (alive) setRawHtml(html);
      } catch (e) {
        if (alive) setErr(e.message || 'Failed to load');
      } finally {
        if (alive) setLoading(false);
      }
    })();

    // Fetch book metadata (Gutendex details) — used for title/author/cover
    (async () => {
      try {
        setMetaError(null);
        const res = await fetch(`/api/books/${id}`, { cache: 'force-cache' });
        if (!res.ok) throw new Error(`Meta fetch failed: ${res.status}`);
        const data = await res.json();
        // Gutendex returns { results: [...] } for searches and { ... } for detail.
        const item = data?.results ? data.results[0] : data;
        if (alive) setBook(item || null);
      } catch (e) {
        if (alive) setMetaError(e.message || 'Failed to load metadata');
        if (alive) setBook({ id: Number(id) }); // minimal fallback so PG cover still works
      }
    })();

    return () => { alive = false; };
  }, [id]);

  const safeHtml = useMemo(
    () => DOMPurify.sanitize(rawHtml, {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ['script', 'style', 'link'],
      }),
    [rawHtml]
  );

  const title = book?.title || `Gutenberg #${id}`;
  const authors = book?.authors?.map(a => a.name).join(', ') || 'Unknown author';
  const coverUrl = getBestCoverUrl(book || { id: Number(id) }, 'medium');

  const mainClass = cx(
    "reader flex min-h-[100dvh] flex-col",
    mode === 'light' && "reader--light reader--use-site-bg",
    mode === 'sepia' && "reader--sepia",
    mode === 'dark'  && "reader--dark",
    mode === 'paper' && 'reader--paper',
    size === 'S' && "reader--size-s",
    size === 'M' && "reader--size-m",
    size === 'L' && "reader--size-l",
    width === 'S' && "reader--width-s",
    width === 'M' && "reader--width-m",
    width === 'L' && "reader--width-l",
    font === 'serif'    && "reader--font-serif",
    font === 'sans'     && "reader--font-sans",
    font === 'dyslexic' && "reader--font-dyslexic",
  );

  return (
    <main
      className={mainClass}>
      {/* Settings gear */}
      <div className="fixed top-25 left-4 -translate-y-1/2 z-50">
        <ReaderSettingsPopover
          prefs={prefs}
          setPref={setPref}
          closeOnSelect={false}  // set true to auto-close after each click
        />
      </div>

      {/* Reader header with cover */}
      <header className="mx-auto w-full max-w-[var(--reader-max)] px-4 pt-6 text-center">

        {/* COVER — size controlled by this container */}
        <div className="relative mx-auto aspect-[2/3] w-40 sm:w-48 md:w-56 lg:w-64 xl:w-72 overflow-hidden rounded-md bg-black/5 dark:bg-white/5">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={`Cover of ${title}`}
              fill
              sizes="(max-width: 640px) 10rem, (max-width: 768px) 12rem, (max-width: 1024px) 14rem, 16rem"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs opacity-60">
              No cover
            </div>
          )}
        </div>

        {/* TITLE + AUTHOR */}
        <h1 className="mt-4 text-2xl sm:text-3xl font-bold leading-tight">{title}</h1>
        <p className="mt-1 text-base sm:text-lg opacity-80">{authors}</p>
      </header>


      {/* 3-column flex: left gutter / reader / right gutter */}
      <section className="flex min-h-0 flex-1">
        <aside className="w-[clamp(0px,8vw,240px)]" aria-hidden="true" />
        <article
          className="reader-content mx-auto flex-1 overflow-auto px-4 py-4"
          aria-live="polite"
          dangerouslySetInnerHTML={{ __html: loading ? '' : safeHtml }}
        />
        <div className="w-[clamp(0px,8vw,240px)]" aria-hidden="true" />
      </section>

      {loading && <p className="px-4 py-3 text-center text-neutral-500">Loading…</p>}
      {err && <p className="px-4 py-3 text-center text-red-600">Error: {err}</p>}
    </main>
  );
}
