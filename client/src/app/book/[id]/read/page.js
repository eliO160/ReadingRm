// client/src/app/book/[id]/read/page.js
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import DOMPurify from 'isomorphic-dompurify';
import { useReaderPrefs } from '@/components/customizations/useReaderPrefs';
import ReaderSettingsPopover from '@/components/customizations/ReaderSettingsPopover';

export default function BookReaderPage() {
  const { id } = useParams();
  const { prefs, setPref } = useReaderPrefs();
  const { size, mode, width, font } = prefs;

  const [rawHtml, setRawHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // NEW: ref to the scrollable article
  const contentRef = useRef(null);

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
    return () => { alive = false; };
  }, [id]);

  const safeHtml = useMemo(
    () =>
      DOMPurify.sanitize(rawHtml, {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ['script', 'style', 'link'],
      }),
    [rawHtml]
  );

  // Helper: scroll the article container to an element with a given id
  function scrollArticleToId(hash) {
    if (!hash) return;
    const container = contentRef.current;
    if (!container) return;

    const id = hash.startsWith('#') ? hash.slice(1) : hash;
    const el = container.querySelector(`#${CSS.escape(id)}`);
    if (!el) return;

    // Compute position relative to the article (works even with nested elements)
    const cRect = container.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    const offset = eRect.top - cRect.top + container.scrollTop;

    container.scrollTo({ top: offset - 8, behavior: 'smooth' });
  }

  // 1) Intercept in-article clicks on hash links (e.g., Gutenberg TOC)
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const onClick = (e) => {
      // Only care about <a> clicks
      const a = e.target.closest('a');
      if (!a) return;

      // If it has a hash portion (href="#link...") or same-page + hash
      const href = a.getAttribute('href');
      if (!href) return;

      // Normalize to just the hash part if present
      const url = new URL(href, window.location.href);
      if (url.hash) {
        // Prevent full page navigation; do local scroll instead
        e.preventDefault();
        // Update the URL hash for deep-linking/back/forward behavior
        history.pushState(null, '', url.hash);
        scrollArticleToId(url.hash);
      }
    };

    container.addEventListener('click', onClick);
    return () => container.removeEventListener('click', onClick);
  }, [contentRef, safeHtml]); // reattach after content changes

  // 2) Handle initial load with hash and subsequent hash changes (back/forward)
  useEffect(() => {
    const onHashChange = () => scrollArticleToId(window.location.hash);
    // Run once after HTML renders
    const t = setTimeout(() => onHashChange(), 0);

    window.addEventListener('hashchange', onHashChange);
    return () => {
      clearTimeout(t);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [safeHtml]);

  // Map presets → CSS variables
  const vars = {
    '--reader-size': size === 'S' ? '16px' : size === 'M' ? '18px' : '20px',
    ...(mode === 'light' && { '--reader-bg': '#ffffff', '--reader-fg': '#111111' }),
    ...(mode === 'sepia' && { '--reader-bg': '#f4ecd8', '--reader-fg': '#2b2320' }),
    ...(mode === 'dark' && { '--reader-bg': '#0e0e0f', '--reader-fg': '#e8e8e8' }),
    '--reader-max': width === 'S' ? '55ch' : width === 'M' ? '70ch' : '85ch',
    '--reader-font':
      font === 'serif'
        ? 'Georgia, "Times New Roman", serif'
        : font === 'dyslexic'
        ? '"OpenDyslexic", "Atkinson Hyperlegible", system-ui, sans-serif'
        : 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
  };

  return (
    <main
      className="flex min-h-[100dvh] flex-col bg-[var(--reader-bg)] text-[var(--reader-fg)]"
      style={vars}
    >
      {/* Settings gear (you can add a separate TOC button later if you want) */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50">
        <ReaderSettingsPopover
          prefs={prefs}
          setPref={setPref}
          closeOnSelect={false}
        />
      </div>

      {/* 3-column flex: left gutter / reader / right gutter */}
      <section className="flex min-h-0 flex-1">
        <aside className="w-[clamp(0px,8vw,240px)]" aria-hidden="true" />
        <article
          ref={contentRef}
          className="
            mx-auto flex-1 overflow-auto px-4 py-4
            max-w-[var(--reader-max)]
            prose prose-neutral dark:prose-invert
          "
          style={{
            fontFamily: 'var(--reader-font)',
            fontSize: 'var(--reader-size)',
            lineHeight: 1.65,
            textRendering: 'optimizeLegibility',
            // So anchor jumps leave a little headroom
            scrollPaddingTop: '2.5rem',
          }}
          aria-live="polite"
          // IMPORTANT: Gutenberg often uses <a id="link2HCH0001"></a> anchors.
          // DOMPurify allows id attributes by default, so these remain in the DOM.
          dangerouslySetInnerHTML={{ __html: loading ? '' : safeHtml }}
        />
        <div className="w-[clamp(0px,8vw,240px)]" aria-hidden="true" />
      </section>

      {loading && <p className="px-4 py-3 text-center text-neutral-500">Loading…</p>}
      {err && <p className="px-4 py-3 text-center text-red-600">Error: {err}</p>}
    </main>
  );
}
