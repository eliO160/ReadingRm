'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import DOMPurify from 'isomorphic-dompurify';
import ReaderActionRail from '@/components/rails/ReaderActionRail';
import { ReaderPrefsProvider, useReaderPrefsContext } from '@/components/customizations/ReaderPrefsProvider';
import { parseTocFromHtml } from '@/components/toc/parseTocfromHtml';

const DEMO_PATH = '/demo/pg1661-images.html';
const DEMO_BOOK_ID = 'demo:pg1661:sherlock';
const cx = (...x) => x.filter(Boolean).join(' ');

// --- Outer wrapper: provides shared prefs to the entire page (rail + content) ---
export default function DemoReaderPage() {
  return (
    <ReaderPrefsProvider>
      <PageBody />
    </ReaderPrefsProvider>
  );
}

// --- Inner: the actual page content/layout that consumes prefs from context ---
function PageBody() {
  const contentRef = useRef(null);

  // Fetch demo HTML from /public
  const [rawHtml, setRawHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setErr(null);
        setLoading(true);
        const res = await fetch(DEMO_PATH, { cache: 'force-cache' });
        if (!res.ok) throw new Error(`Local demo fetch failed: ${res.status}`);
        const html = await res.text();
        if (alive) setRawHtml(html);
      } catch (e) {
        if (alive) setErr(e.message || 'Failed to load');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // Sanitize for render
  const safeHtml = useMemo(
    () =>
      DOMPurify.sanitize(rawHtml, {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ['script', 'style', 'link'],
      }),
    [rawHtml]
  );

  // Build TOC items from the raw HTML (IDs must remain intact)
  const tocItems = useMemo(() => parseTocFromHtml(rawHtml), [rawHtml]);

  // Read live prefs from shared context (keeps Settings popover functional)
  const { prefs } = useReaderPrefsContext();
  const { mode, size, width, font } = prefs;

  // Reader classnames derived from prefs
  const mainClass = cx(
    'reader flex min-h-[100dvh] flex-col',
    mode === 'light' && 'reader--light reader--use-site-bg',
    mode === 'sepia' && 'reader--sepia',
    mode === 'dark' && 'reader--dark',
    mode === 'paper' && 'reader--paper',
    size === 'S' && 'reader--size-s',
    size === 'M' && 'reader--size-m',
    size === 'L' && 'reader--size-l',
    width === 'S' && 'reader--width-s',
    width === 'M' && 'reader--width-m',
    width === 'L' && 'reader--width-l',
    font === 'serif' && 'reader--font-serif',
    font === 'sans' && 'reader--font-sans',
    font === 'dyslexic' && 'reader--font-dyslexic'
  );

  return (
    <main className={mainClass}>
      {/* Action rail: controller handles all button wiring via shared prefs */}
      <ReaderActionRail
        bookId={DEMO_BOOK_ID}
        tocItems={tocItems}
        contentRef={contentRef}
        top="7.5rem"
        left="1rem"
      />

      {/* Header / hero */}
      <header className="mx-auto w-full max-w-[var(--reader-max)] px-4 pt-6 text-center">
        <div className="relative mx-auto aspect-[2/3] w-40 sm:w-48 md:w-56 lg:w-64 xl:w-72 overflow-hidden rounded-md bg-black/5 dark:bg-white/5">
          <Image
            src="/demo/cover.jpg"
            alt="Cover of The Adventures of Sherlock Holmes"
            fill
            sizes="(max-width: 640px) 10rem, (max-width: 768px) 12rem, (max-width: 1024px) 14rem, 16rem"
            className="object-cover"
            priority
          />
        </div>
        <h1 className="mt-4 text-2xl sm:text-3xl font-bold leading-tight">
          The Adventures of Sherlock Holmes (Demo)
        </h1>
        <p className="mt-1 text-base sm:text-lg opacity-80">Project Gutenberg</p>
      </header>

      {/* 3-column reader layout */}
      <section className="flex min-h-0 flex-1">
        <aside className="w-[clamp(0px,8vw,240px)]" aria-hidden="true" />
        <article
          ref={contentRef}
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
