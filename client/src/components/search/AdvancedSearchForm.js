'use client';

import React, { useMemo, useState } from 'react';
import LinkButton from '@/components/ui/LinkButton';

const cn = (...x) => x.filter(Boolean).join(' ');

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

const MIME_OPTIONS = [
  { value: '', label: 'Any' },
  { value: 'text/', label: 'Text (any)' },
  { value: 'text/plain', label: 'Text (Plain)' },
  { value: 'text/html', label: 'Text (HTML)' },
  { value: 'application/epub+zip', label: 'EPUB' },
  { value: 'application/x-mobipocket-ebook', label: 'Kindle/MOBI' },
  { value: 'application/pdf', label: 'PDF' },
];

const COPYRIGHT_OPTIONS = [
  { value: 'false', label: 'Public domain (USA)' },
  { value: 'true', label: 'Has copyright' },
  { value: 'null', label: 'Unknown' },
];

const SORT_OPTIONS = [
  { value: 'popular', label: 'Popularity (default)' },
  { value: 'ascending', label: 'Gutenberg ID: Low → High' },
  { value: 'descending', label: 'Gutenberg ID: High → Low' },
];

function baseInputClasses(extra = '') {
  return cn(
    'mt-1 block w-full rounded-xl border border-black/10 dark:border-white/10',
    'bg-transparent px-3 py-2 text-sm',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--link)]',
    'focus-visible:ring-offset-1 focus-visible:ring-offset-[color:var(--bg)]',
    extra
  );
}

export default function AdvancedSearchForm({
  actionHref = '/search',
  className,
}) {
  const [keywords, setKeywords] = useState('');
  const [topic, setTopic] = useState('');
  const [authorStart, setAuthorStart] = useState('');
  const [authorEnd, setAuthorEnd] = useState('');
  const [languages, setLanguages] = useState(['en']);
  const [mime, setMime] = useState('');
  const [copyright, setCopyright] = useState([]);
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

    return p.toString();
  }, [keywords, topic, authorStart, authorEnd, languages, mime, copyright, sort]);

  const href = queryString ? `${actionHref}?${queryString}` : actionHref;

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
        'rounded-2xl border border-black/10 dark:border-white/10',
        'bg-[color:var(--bg)] text-[color:var(--fg)] shadow-sm',
        'p-6 md:p-8 space-y-6',
        className
      )}
      onSubmit={(e) => e.preventDefault()} // front-end only for now
    >
      {/* <header className="space-y-1">
        <h2 id="adv-search-title" className="text-2xl font-semibold">
          Advanced Search
        </h2>
        <p className="text-sm opacity-80">
          Combine keywords, topics, languages, formats, and more using Gutendex parameters.
        </p>
      </header> */}

      {/* Keywords + Topic */}
      <section className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="kw" className="text-sm font-medium">
            Keywords (author or title)
          </label>
          <input
            id="kw"
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className={baseInputClasses()}
            placeholder="e.g., dickens great"
          />
          <p className="mt-1 text-xs opacity-70">
            Matches words in author names and book titles.
          </p>
        </div>

        <div>
          <label htmlFor="topic" className="text-sm font-medium">
            Topic
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className={baseInputClasses()}
            placeholder="e.g., children, science, mystery"
          />
          <p className="mt-1 text-xs opacity-70">
            Searches subjects &amp; bookshelves for a key phrase.
          </p>
        </div>
      </section>

      {/* Author year range */}
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">
          Author lived between years <span className="opacity-70">(BCE as negative)</span>
        </legend>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="start" className="block text-xs opacity-80">
              Start year
            </label>
            <input
              id="start"
              type="number"
              inputMode="numeric"
              value={authorStart}
              onChange={(e) => setAuthorStart(e.target.value)}
              className={baseInputClasses()}
              placeholder="e.g., 1800"
            />
          </div>
          <div>
            <label htmlFor="end" className="block text-xs opacity-80">
              End year
            </label>
            <input
              id="end"
              type="number"
              inputMode="numeric"
              value={authorEnd}
              onChange={(e) => setAuthorEnd(e.target.value)}
              className={baseInputClasses()}
              placeholder="e.g., 1899"
            />
          </div>
        </div>
      </fieldset>

      {/* Languages */}
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Languages</legend>
        <p className="text-xs opacity-70">Choose one or more.</p>
        <div className="mt-1 flex flex-wrap gap-2">
          {LANGUAGE_OPTIONS.map((opt) => {
            const active = languages.includes(opt.code);
            return (
              <label
                key={opt.code}
                className={cn(
                  'cursor-pointer select-none rounded-full px-3 py-1.5 text-sm inline-flex items-center',
                  'border transition',
                  active
                    ? 'border-[color:var(--link)] bg-[color:var(--link)] text-[color:var(--bg)]'
                    : 'border-black/10 dark:border-white/10 hover:border-[color:var(--link)]/60'
                )}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={active}
                  onChange={() => toggleLanguage(opt.code)}
                  aria-label={opt.label}
                />
                {opt.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Mime type + Sort */}
      <section className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="mime" className="text-sm font-medium">
            Format (MIME)
          </label>
          <select
            id="mime"
            className={baseInputClasses()}
            value={mime}
            onChange={(e) => setMime(e.target.value)}
          >
            {MIME_OPTIONS.map((m) => (
              <option key={m.value || 'any'} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs opacity-70">
            Tip: use “Text (any)” to include HTML &amp; Plain.
          </p>
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Sort</legend>
          <div className="space-y-1">
            {SORT_OPTIONS.map((s) => (
              <label
                key={s.value}
                className="inline-flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="radio"
                  name="sort"
                  value={s.value}
                  checked={sort === s.value}
                  onChange={() => setSort(s.value)}
                  className="h-4 w-4"
                />
                <span>{s.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      {/* Copyright */}
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Copyright status</legend>
        <p className="text-xs opacity-70">Multi-select allowed.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {COPYRIGHT_OPTIONS.map((opt) => {
            const active = copyright.includes(opt.value);
            return (
              <label
                key={opt.value}
                className="inline-flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={active}
                  onChange={() => toggleCopyright(opt.value)}
                />
                <span>{opt.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Actions */}
      <section className="pt-2 border-t border-black/5 dark:border-white/5 space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <LinkButton 
            href={href} 
          >
            Search
          </LinkButton>
          <button
            type="button"
            onClick={resetAll}
            className="btn"
          >
            Reset
          </button>
        </div>
        <p className="text-xs opacity-70 break-all">
          <span className="font-medium">Preview:</span>{' '}
          <code className="font-mono">
            {actionHref}
            {queryString ? `?${queryString}` : ' (no params)'}
          </code>
        </p>
      </section>
    </form>
  );
}
