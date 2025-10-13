//reader page
'use client';

import { useEffect, useMemo, useState } from 'react';
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

  // Map presets → CSS variables (used in inline style below)
  const vars = {
    // font size
    '--reader-size': size === 'S' ? '16px' : size === 'M' ? '18px' : '20px',
    // color mode
    ...(mode === 'light' && { '--reader-bg': '#ffffff', '--reader-fg': '#111111' }),
    ...(mode === 'sepia' && { '--reader-bg': '#f4ecd8', '--reader-fg': '#2b2320' }),
    ...(mode === 'dark' && { '--reader-bg': '#0e0e0f', '--reader-fg': '#e8e8e8' }),
    // reader width
    '--reader-max': width === 'S' ? '55ch' : width === 'M' ? '70ch' : '85ch',
    // font family
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
      {/* Settings gear */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50">
        <ReaderSettingsPopover
          prefs={prefs}
          setPref={setPref}
          closeOnSelect={false}  // set true to auto-close after each click
        />
      </div>

      {/* 3-column flex: left gutter / reader / right gutter */}
      <section className="flex min-h-0 flex-1">
        <aside className="w-[clamp(0px,8vw,240px)]" aria-hidden="true" />
        <article
          className="
            mx-auto flex-1 overflow-auto px-4 py-4
            max-w-[var(--reader-max)]
          "
          style={{
            fontFamily: 'var(--reader-font)',
            fontSize: 'var(--reader-size)',
            lineHeight: 1.65,
            textRendering: 'optimizeLegibility',
          }}
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
