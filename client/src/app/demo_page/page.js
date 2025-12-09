// app/demo/page.js (or wherever your demo reader lives)
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import DOMPurify from 'isomorphic-dompurify';

import { useReaderPrefs } from '@/components/customizations/useReaderPrefs';
import { useBookmark } from '@/hooks/useBookmark';
import { useLists } from '@/hooks/useLists';
import { useReadingProgress } from '@/hooks/useReadingProgress';

import ReaderActionsDrawer from '@/components/reader/ReaderActionsDrawer';
import MobileNavRailButton from '@/components/reader/user_actions/MobileNavRailButton';
import ReaderSkeleton from '@/components/reader/ReaderSkeleton';

const DEMO_BOOK_ID = '1661';
const DEMO_PATH = '/demo/pg1661-images.html';

const cx = (...x) => x.filter(Boolean).join(' ');

export default function DemoReaderPage() {
  // 1) Reader visual prefs (same hook as real reader)
  const { prefs, setPref, loading: prefsLoading } = useReaderPrefs();
  const { size, mode, width, font } = prefs;

  // 2) Bookmark hook for the demo book
  const { bookmarked, toggle: toggleDemoBookmark } = useBookmark(DEMO_BOOK_ID);

  const isBookBookmarked = (bookId) =>
    bookId === DEMO_BOOK_ID ? Boolean(bookmarked) : false;

  const toggleBookmark = (bookId) => {
    if (bookId === DEMO_BOOK_ID) toggleDemoBookmark();
  };

  // 3) Lists hook (same behavior as real reader)
  const {
    getLists,
    listsContainingBook,
    addBookToList,
    removeBookFromList,
    createListAndAdd,
  } = useLists();

  // 4) Demo HTML loading from /public
  const [rawHtml, setRawHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const contentRef = useRef(null);

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

    return () => {
      alive = false;
    };
  }, []);

  const safeHtml = useMemo(
    () =>
      DOMPurify.sanitize(rawHtml, {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ['script', 'style', 'link'],
      }),
    [rawHtml]
  );

  // 5) Scroll progress (uses Firebase/Mongo just like real reader)
  useReadingProgress({ bookId: DEMO_BOOK_ID, rawHtml });

  // 6) Map prefs → CSS classes (same as real reader)
  const readerClasses = cx(
    'reader flex min-h-[100dvh] flex-col',

    // Color modes
    !prefsLoading &&
      (!mode || mode === 'light') &&
      'reader--light reader--use-site-bg',
    !prefsLoading && mode === 'sepia' && 'reader--sepia',
    !prefsLoading && mode === 'dark' && 'reader--dark',
    !prefsLoading && mode === 'paper' && 'reader--paper',

    // Sizes (S / M / L)
    !prefsLoading && size === 'S' && 'reader--size-s',
    !prefsLoading && size === 'M' && 'reader--size-m',
    !prefsLoading && size === 'L' && 'reader--size-l',

    // Widths (S / M / L)
    !prefsLoading && width === 'S' && 'reader--width-s',
    !prefsLoading && width === 'M' && 'reader--width-m',
    !prefsLoading && width === 'L' && 'reader--width-l',

    // Fonts
    !prefsLoading && font === 'serif' && 'reader--font-serif',
    !prefsLoading && font === 'sans' && 'reader--font-sans',
    !prefsLoading && font === 'dyslexic' && 'reader--font-dyslexic'
  );

  const mainClass = cx(
    readerClasses,
    !isFullscreen && 'sm:ml-15',
    'bg-[color:var(--bg)]'
  );

  return (
    <main className={mainClass}>
      {/* NEW: Drawer-style action rail, same as real reader */}
      <ReaderActionsDrawer
        bookId={DEMO_BOOK_ID}
        tocHtml={rawHtml}
        contentRef={contentRef}
        onFullscreenChange={setIsFullscreen}
        // Reader prefs
        prefs={prefs}
        setPref={setPref}
        // Bookmarks
        isBookBookmarked={isBookBookmarked}
        toggleBookmark={toggleBookmark}
        // Lists
        getLists={getLists}
        listsContainingBook={listsContainingBook}
        addBookToList={addBookToList}
        removeBookFromList={removeBookFromList}
        createListAndAdd={createListAndAdd}
        // Mobile rail toggle in the drawer header
        extraBefore={<MobileNavRailButton />}
      />

      {/* While loading, show the same skeleton layout as the real reader */}
      {loading ? (
        <ReaderSkeleton isFullscreen={isFullscreen} />
      ) : (
        <>
          {/* Header / metadata (fixed demo metadata) */}
          <header
            className={cx(
              'mx-auto w-full max-w-[var(--reader-max)] px-4 pt-6 text-center',
              isFullscreen && 'hidden'
            )}
          >
            <div className="relative mx-auto aspect-[2/3] w-40 sm:w-48 md:w-56 lg:w-64 xl:w-72 overflow-hidden rounded-md bg-black/5 dark:bg-white/5">
              <Image
                src="/demo/cover.jpg"
                alt="Cover of The Adventures of Sherlock Holmes (Demo)"
                fill
                sizes="(max-width: 640px) 10rem, (max-width: 768px) 12rem, (max-width: 1024px) 14rem, 16rem"
                className="object-cover"
                priority
              />
            </div>
            <h1 className="mt-4 text-2xl sm:text-3xl font-bold leading-tight">
              The Adventures of Sherlock Holmes (Demo)
            </h1>
            <p className="mt-1 text-base sm:text-lg opacity-80">
              Project Gutenberg
            </p>
          </header>

          {/* 3-column layout (same structure as real reader) */}
          <section className="flex min-h-0 flex-1">
            <aside
              className={cx(
                'w-[clamp(0px,8vw,240px)]',
                isFullscreen && 'hidden'
              )}
              aria-hidden="true"
            />
            <article
              ref={contentRef}
              className={cx(
                'reader-content mx-auto overflow-auto',
                isFullscreen
                  ? 'w-screen max-w-none px-6 sm:px-10 py-6 min-h-[100dvh]'
                  : 'w-full max-w-[var(--reader-max)] px-4 py-4'
              )}
              aria-live="polite"
              dangerouslySetInnerHTML={{ __html: safeHtml }}
            />
            <div
              className={cx(
                'w-[clamp(0px,8vw,240px)]',
                isFullscreen && 'hidden'
              )}
              aria-hidden="true"
            />
          </section>
        </>
      )}

      {/* Error state (shown on top of skeleton or content) */}
      {err && (
        <p className="px-4 py-3 text-center text-red-600">Error: {err}</p>
      )}
    </main>
  );
}
