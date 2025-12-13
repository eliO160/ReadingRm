// reader page
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import DOMPurify from 'isomorphic-dompurify';
import Image from 'next/image';

import { getBestCoverUrl } from '@/lib/covers';
import { useReaderPrefs } from '@/components/customizations/useReaderPrefs';
import ReaderActionsDrawer from '@/components/reader/ReaderActionsDrawer';
import MobileNavRailButton from '@/components/reader/user_actions/MobileNavRailButton';
import { useBookmark } from '@/hooks/useBookmark';
import { useLists } from '@/hooks/useLists';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import ReaderSkeleton from '@/components/reader/ReaderSkeleton';


const cx = (...x) => x.filter(Boolean).join(' ');

export default function BookReaderPage() {
  const { id } = useParams();
  const bookId = String(id);

  // 1) Reader prefs -- persisted via /api/prefs
  const { prefs, setPref, loading: prefsLoading } = useReaderPrefs();
  const { size, mode, width, font } = prefs;

  // 2) Bookmark and lists hooks per book
  const {
    bookmarked,
    toggle,
    loading: bmLoading,
    error: bmError,
  } = useBookmark(bookId);

  const {
    getLists, 
    listsContainingBook,
    addBookToList,
    removeBookFromList,
    createListAndAdd,
  } = useLists();

  // 3) Reader content state
  const [rawHtml, setRawHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [book, setBook] = useState(null);
  const [metaError, setMetaError] = useState(null);

  // 4) Fullscreen + ToC scrolling
  const [isFullscreen, setIsFullscreen] = useState(false);
  const contentRef = useRef(null);

    // Fetch book HTML and metadata
  useEffect(() => {
    let alive = true;

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

    (async () => {
      try {
        setMetaError(null);
        const res = await fetch(`/api/books/${id}`, { cache: 'force-cache' });
        if (!res.ok) throw new Error(`Meta fetch failed: ${res.status}`);
        const data = await res.json();
        const item = data?.results ? data.results[0] : data;
        if (alive) setBook(item || null);
      } catch (e) {
        if (alive) {
          setMetaError(e.message || 'Failed to load metadata');
          setBook({ id: Number(id) });
        }
      }
    })();

    return () => { 
      alive = false; 
    };
  }, [id]);

  const safeHtml = useMemo(
    () => 
      DOMPurify.sanitize(rawHtml, {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ['script', 'style', 'link'],
      }),
    [rawHtml]
  );

  const title = book?.title || `Gutenberg #${id}`;
  const authors = 
    book?.authors?.map(a => a.name).join(', ') || 'Unknown author';
  const coverUrl = getBestCoverUrl(book || { id: Number(id) }, 'medium');

  // 5) Map prefs -> CSS classes (globals.css)
  const readerClasses = cx(
    'reader flex min-h-[100dvh] flex-col',
  
    // Only apply per-mode classes once prefs are loaded
    // Color modes
    !prefsLoading && (!mode || mode === 'light') && 'reader--light reader--use-site-bg',
    !prefsLoading && mode === 'sepia' && 'reader--sepia',
    !prefsLoading && mode === 'dark' && 'reader--dark',
    !prefsLoading && mode === 'paper' && 'reader--paper',
    
    // Sizes (ReaderSettings uses S / M / L)
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
  //hook that handles restoring and saving scroll progress
  useReadingProgress({ bookId, rawHtml });


  const mainClass = cx(
    readerClasses,
    isFullscreen ? '' : 'sm:ml-15',
    'bg-[color:var(--bg)]'
  );

  return (
    <main className={mainClass}>
      {/* Reusable Action Rail */}
      <ReaderActionsDrawer
        bookId={bookId}
        tocHtml={rawHtml}
        contentRef={contentRef}
        onFullscreenChange={setIsFullscreen}
        // Reader prefs
        prefs={prefs}
        setPref={setPref}
        // Bookmarks
        isBookBookmarked={(id) => (id === bookId ? bookmarked : false)}
        toggleBookmark={(id) => {
          if (id === bookId) return toggle();
        }}
        // Lists
        getLists={getLists}
        listsContainingBook={listsContainingBook}
        addBookToList={addBookToList}
        removeBookFromList={removeBookFromList}
        createListAndAdd={createListAndAdd}
        extraBefore={<MobileNavRailButton />}
      />

      {/* While loading HTML, show reader skeleton instead of real content */}
      {loading ? (
        <ReaderSkeleton isFullscreen={isFullscreen} />
      ) : (
        <>
          {/* Header with cover/title/author (hidden in fullscreen) */}
          <header 
            className={cx(
              "mx-auto w-full max-w-[var(--reader-max)] px-4 pt-6 text-center",
              isFullscreen && "hidden"
            )}
          >
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
            <h1 className="mt-4 text-2xl sm:text-3xl font-bold leading-tight">
              {title}
            </h1>
            <p className="mt-1 text-base sm:text-lg opacity-80">
              {authors}
            </p>
          </header>

          {/* 3-column layout: gutter | content | gutter */}
          <section className="flex min-h-0 flex-1">
            <aside 
              className={cx(
                "w-[clamp(0px,8vw,240px)]",
                isFullscreen && "hidden"
              )} 
              aria-hidden="true" 
            />

            <article
              ref={contentRef}
              className={cx(
                "reader-content mx-auto overflow-auto",
                isFullscreen
                  ? "w-screen max-w-none px-6 sm:px-10 py-6 min-h-[100dvh]"
                  : "w-full max-w-[var(--reader-max)] px-4 py-4"
              )}
              aria-live="polite"
              dangerouslySetInnerHTML={{ __html: loading ? '' : safeHtml }}
            />

            <div 
              className={cx(
                "w-[clamp(0px,8vw,240px)]",
                isFullscreen && "hidden"
              )} 
              aria-hidden="true" 
            />
          </section>
        </>
      )}

      {/* Errors */}
      {err && (
        <p className="px-4 py-3 text-center text-red-600">
          Error: {err}
        </p>
      )}
      {metaError && !book?.title && (
        <p className="px-4 py-3 text-center text-yellow-700">
          Metadata error: {metaError}
        </p>
      )}

      {/* UX for bookmark state/errors */}
      {bmLoading && (
        <div className="fixed bottom-4 left-4 text-xs bg-neutral-100 dark:bg-neutral-800 px-3 py-2 rounded">
          Checking bookmark…
        </div>
      )}
      {bmError?.code === 'auth/no-user' ? (
        <div className="fixed bottom-4 left-4 text-xs bg-yellow-100 text-yellow-900 px-3 py-2 rounded">
          Sign in to use bookmarks.
        </div>
      ) : bmError ? (
        <div className="fixed bottom-4 left-4 text-xs bg-red-100 text-red-900 px-3 py-2 rounded">
          Bookmark error: {bmError.message}
        </div>
      ) : null}
    </main>
  );
}
