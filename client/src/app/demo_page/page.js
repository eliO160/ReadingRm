'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import DOMPurify from 'isomorphic-dompurify';
import { useReaderPrefs } from '@/components/customizations/useReaderPrefs';
import ActionRail from '@/components/layout/ActionRail';

const DEMO_PATH = '/demo/pg1661-images.html';
const cx = (...x) => x.filter(Boolean).join(' ');

export default function DemoReaderPage() {
  const { 
    prefs, setPref, 
    isBookBookmarked, toggleBookmark,
    getLists, listsContainingBook,
    addBookToList, removeBookFromList, createListAndAdd, 
  } = useReaderPrefs();
  const { size, mode, width, font } = prefs;

  const [rawHtml, setRawHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const contentRef = useRef(null);
  
  // Load demo HTML from /public
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

  const safeHtml = useMemo(
    () => DOMPurify.sanitize(rawHtml, {
      USE_PROFILES: { html: true },
      FORBID_TAGS: ['script', 'style', 'link'],
    }),
    [rawHtml]
  );


  const mainClass = cx(
    "reader flex min-h-[100dvh] flex-col",
    mode === 'light' && "reader--light",
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
      className={cx(
        mainClass,
        isFullscreen ? "" : "m/-16 sm:ml-15",
        "bg-[color:var(--bg)]"
        )}>
      {/* Settings */}
      <ActionRail
        top="7.5rem"
        left="1rem"
        bookId="demo-pg1661"
        tocHtml={rawHtml}
        contentRef={contentRef}
        onFullscreenChange={setIsFullscreen}
        // Inject the page’s single source of truth:
        prefs={prefs}
        setPref={setPref}
        isBookBookmarked={isBookBookmarked}
        toggleBookmark={toggleBookmark}
        getLists={getLists}
        listsContainingBook={listsContainingBook}
        addBookToList={addBookToList}
        removeBookFromList={removeBookFromList}
        createListAndAdd={createListAndAdd}
      />

      <header className={cx("mx-auto w-full max-w-[var(--reader-max)] px-4 pt-6 text-center", isFullscreen && "hidden")}>
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

      {/* 3-column layout */}
      <section className="flex min-h-0 flex-1">
        <aside className={cx("w-[clamp(0px,8vw,240px)]", isFullscreen && "hidden")} aria-hidden="true" />
        <article
          className={cx(
            "reader-content mx-auto overflow-auto",
            isFullscreen
              ? "w-screen max-w-none px-6 sm:px-10 py-6 min-h-[100dvh]"
              : "w-full max-w-[var(--reader-max)] px-4 py-4"
          )}
          ref={contentRef}
          aria-live="polite"
          // The CSS in globals.css neutralizes PG inline black/white colors
          dangerouslySetInnerHTML={{ __html: loading ? '' : safeHtml }}
        />
        <div className={cx("w-[clamp(0px,8vw,240px)]", isFullscreen && "hidden")} aria-hidden="true" />
      </section>

      {loading && <p className="px-4 py-3 text-center text-neutral-500">Loading…</p>}
      {err && <p className="px-4 py-3 text-center text-red-600">Error: {err}</p>}
    </main>
  );

}
