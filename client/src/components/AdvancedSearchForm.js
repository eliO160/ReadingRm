'use client';

import React, { useMemo, useState } from 'react';
import LinkButton from '@/components/ui/LinkButton'; // adjust path if yours differs

const cn = (...x) => x.filter(Boolean).join(' ');

// Common language choices (add more anytime)
const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'French' },
  { code: 'es', label: 'Spanish' },
  { code: 'de', label: 'German' },
  { code: 'it', label: 'Italian' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'fi', label: 'Finnish' },
  { code: 'la', label: 'Latin' },
];

// Popular mime types for Gutenberg
const MIME_OPTIONS = [
  { value: '', label: 'Any' },
  { value: 'text/', label: 'Text (any)' },
  { value: 'text/plain', label: 'Text (Plain)' },
  { value: 'text/html', label: 'Text (HTML)' },
  { value: 'application/epub+zip', label: 'EPUB' },
  { value: 'application/x-mobipocket-ebook', label: 'Kindle/MOBI' },
  { value: 'application/pdf', label: 'PDF' },
];

// copyright can be true,false,null (multi-select allowed)
const COPYRIGHT_OPTIONS = [
  { value: 'false', label: 'Public domain (USA)' },
  { value: 'true', label: 'Has copyright' },
  { value: 'null', label: 'Unknown' },
];

// sort options
const SORT_OPTIONS = [
  { value: 'popular', label: 'Popularity (default)' },
  { value: 'ascending', label: 'Gutenberg ID: Low → High' },
  { value: 'descending', label: 'Gutenberg ID: High → Low' },
];

export default function AdvancedSearchForm({
  /** Where should the query be sent in your app?
   *  For *front-end only* testing, send users to your existing /search page.
   *  Your /search page can later read these params and call your API.
   */
  actionHref = '/search',
  className,
}) {
  const [keywords, setKeywords] = useState('');
  const [topic, setTopic] = useState('');
  const [authorStart, setAuthorStart] = useState('');
  const [authorEnd, setAuthorEnd] = useState('');
  const [languages, setLanguages] = useState(['en']);    // default English
  const [mime, setMime] = useState('');                  // any
  const [copyright, setCopyright] = useState([]);        // none selected
  const [sort, setSort] = useState('popular');

  // Build URLSearchParams compatible with Gutendex
  const queryString = useMemo(() => {
    const p = new URLSearchParams();

    if (keywords.trim()) p.set('search', keywords.trim());
    if (topic.trim()) p.set('topic', topic.trim());

    if (authorStart) p.set('author_year_start', authorStart);
    if (authorEnd) p.set('author_year_end', authorEnd);

    if (languages.length > 0) p.set('languages', languages.join(','));

    if (mime) p.set('mime_type', mime);

    if (copyright.length > 0) p.set('copyright', copyright.join(','));

    if (sort && sort !== 'popular') p.set('sort', sort);
    // Note: 'popular' is default on the API, so omit it unless changed.

    return p.toString();
  }, [keywords, topic, authorStart, authorEnd, languages, mime, copyright, sort]);

  // Where the LinkButton should navigate (your app’s search route)
  const href = `${actionHref}?${queryString}`;

  const resetAll = () => {
    setKeywords('');
    setTopic('');
    setAuthorStart('');
    setAuthorEnd('');
    setLanguages(['en']);
    setMime('');
    setCopyright([]);
    setSort('popular');
  };

  const toggleLanguage = (code) => {
    setLanguages((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const toggleCopyright = (value) => {
    setCopyright((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <form
      aria-labelledby="adv-search-title"
      className={cn(
        "rounded-2xl border border-black/10 dark:border-white/10 p-6 bg-[color:var(--bg)] text-[color:var(--fg)] shadow-sm",
        className
      )}
      onSubmit={(e) => e.preventDefault()} // front-end only for now
    >
      <h2 id="adv-search-title" className="text-2xl font-bold">Advanced Search</h2>
      <p className="mt-1 opacity-80 text-sm">Build a query using Gutendex parameters.</p>

      {/* Keywords + Topic */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="kw" className="font-semibold">Keywords (author or title)</label>
          <input
            id="kw"
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="mt-2 w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-3 py-2"
            placeholder="e.g., dickens great"
          />
          <p className="mt-1 text-sm opacity-70">
            Matches words in author names and book titles.
          </p>
        </div>

        <div>
          <label htmlFor="topic" className="font-semibold">Topic</label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-2 w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-3 py-2"
            placeholder="e.g., children, science, mystery"
          />
          <p className="mt-1 text-sm opacity-70">
            Searches subjects & bookshelves for a key phrase.
          </p>
        </div>
      </div>

      {/* Author year range */}
      <fieldset className="mt-6">
        <legend className="font-semibold">Author lived between years (BCE negative)</legend>
        <div className="mt-2 grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="start" className="block text-sm opacity-80">Start year</label>
            <input
              id="start"
              type="number"
              inputMode="numeric"
              value={authorStart}
              onChange={(e) => setAuthorStart(e.target.value)}
              className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-3 py-2"
              placeholder="e.g., 1800"
            />
          </div>
          <div>
            <label htmlFor="end" className="block text-sm opacity-80">End year</label>
            <input
              id="end"
              type="number"
              inputMode="numeric"
              value={authorEnd}
              onChange={(e) => setAuthorEnd(e.target.value)}
              className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-3 py-2"
              placeholder="e.g., 1899"
            />
          </div>
        </div>
      </fieldset>

      {/* Languages */}
      <fieldset className="mt-6">
        <legend className="font-semibold">Languages</legend>
        <p className="text-sm opacity-70">Choose one or more.</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {LANGUAGE_OPTIONS.map((opt) => (
            <label
              key={opt.code}
              className={cn(
                "cursor-pointer select-none rounded-xl border px-3 py-1.5",
                languages.includes(opt.code)
                  ? "border-[color:var(--link)] bg-[color:var(--link)] text-[color:var(--bg)]"
                  : "border-black/10 dark:border-white/10"
              )}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={languages.includes(opt.code)}
                onChange={() => toggleLanguage(opt.code)}
                aria-label={opt.label}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Mime type + Sort */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="mime" className="font-semibold">Format (MIME)</label>
          <select
            id="mime"
            className="mt-2 w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-3 py-2"
            value={mime}
            onChange={(e) => setMime(e.target.value)}
          >
            {MIME_OPTIONS.map((m) => (
              <option key={m.value || 'any'} value={m.value}>{m.label}</option>
            ))}
          </select>
          <p className="mt-1 text-sm opacity-70">Tip: choose “Text (any)” to include HTML & Plain.</p>
        </div>

        <fieldset>
          <legend className="font-semibold">Sort</legend>
          <div className="mt-2 grid gap-2">
            {SORT_OPTIONS.map((s) => (
              <label key={s.value} className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="sort"
                  value={s.value}
                  checked={sort === s.value}
                  onChange={() => setSort(s.value)}
                />
                <span>{s.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Copyright */}
      <fieldset className="mt-6">
        <legend className="font-semibold">Copyright status</legend>
        <p className="text-sm opacity-70">Multi-select allowed.</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {COPYRIGHT_OPTIONS.map((opt) => (
            <label key={opt.value} className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={copyright.includes(opt.value)}
                onChange={() => toggleCopyright(opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <LinkButton href={href} variant="primary">
          Search
        </LinkButton>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl border px-4 py-2 border-black/10 dark:border-white/10"
          onClick={resetAll}
        >
          Reset
        </button>

        {/* tiny live preview of the URL you’ll navigate to */}
        <div className="mt-2 w-full text-sm opacity-70 break-all">
          <span className="font-semibold">Preview:</span> {actionHref}?{queryString || '(no params)'}
        </div>
      </div>
    </form>
  );
}
