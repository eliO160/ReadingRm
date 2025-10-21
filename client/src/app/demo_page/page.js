'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import DOMPurify from 'isomorphic-dompurify';
import { useReaderPrefs } from '@/components/customizations/useReaderPrefs';
import ReaderSettingsPopover from '@/components/customizations/ReaderSettingsPopover';

const DEMO_PATH = '/demo/pg1661-images.html';

export default function DemoReaderPage() {
  const { prefs, setPref } = useReaderPrefs();
  const { size, mode, width, font } = prefs;

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

  const safeHtml = useMemo(
    () => DOMPurify.sanitize(rawHtml, {
      USE_PROFILES: { html: true },
      FORBID_TAGS: ['script', 'style', 'link'],
    }),
    [rawHtml]
  );

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
    <main className="flex min-h-[100dvh] flex-col bg-[var(--reader-bg)] text-[var(--reader-fg)]" style={vars}>
      {/* Settings gear */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50">
        <ReaderSettingsPopover prefs={prefs} setPref={setPref} closeOnSelect={false} />
      </div>

      <section className="flex min-h-0 flex-1">
        <aside className="w-[clamp(0px,8vw,240px)]" aria-hidden="true" />
        <div className="mx-auto flex-1 overflow-auto px-4 py-4 max-w-[var(--reader-max)]">
          {/* Cover image */}
          <figure className="mb-6">
            <Image
              src="/demo/cover.jpg"
              alt="Cover of The Adventures of Sherlock Holmes"
              width={800}      // pick a reasonable intrinsic size
              height={1200}    // keep the aspect ratio
              priority
              className="mx-auto rounded-xl shadow"
              sizes="(max-width: 900px) 90vw, 800px"
            />
            <figcaption className="mt-2 text-center text-sm opacity-70">
              The Adventures of Sherlock Holmes — Project Gutenberg
            </figcaption>
          </figure>

          {/* Book HTML */}
          <article
            className="prose dark:prose-invert max-w-none"
            style={{
              fontFamily: 'var(--reader-font)',
              fontSize: 'var(--reader-size)',
              lineHeight: 1.65,
              textRendering: 'optimizeLegibility',
            }}
            aria-live="polite"
            dangerouslySetInnerHTML={{ __html: loading ? '' : safeHtml }}
          />
        </div>
        <div className="w-[clamp(0px,8vw,240px)]" aria-hidden="true" />
      </section>

      {loading && <p className="px-4 py-3 text-center text-neutral-500">Loading…</p>}
      {err && <p className="px-4 py-3 text-center text-red-600">Error: {err}</p>}

      <footer className="mt-4 px-4 pb-6 text-xs opacity-70">
        Demo content from Project Gutenberg (Work #1661). Public domain. Please retain the license notice.
      </footer>
    </main>
  );
}
