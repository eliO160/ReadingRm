'use client';

import AdvancedSearchForm from '@/components/AdvancedSearchForm';

export default function AdvancedSearchPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <a href="#adv" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2">
        Skip to content
      </a>

      <h1 id="adv" className="text-3xl font-bold">Advanced Search</h1>
      <p className="mt-2 opacity-80">
        Build a search with keywords, topics, languages, formats, and more.
      </p>

      <AdvancedSearchForm actionHref="/search" className="mt-6" />
    </main>
  );
}
