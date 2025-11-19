'use client';

import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';
import Image from 'next/image';
import { getBestCoverUrl } from '@/lib/covers';

function BookCard({ book }) {
  const cover = getBestCoverUrl(book, 'small');
  const authors =
    (book?.authors || []).map(a => a.name).join(', ') || 'Unknown author';

  return (
    <Link
      href={`/book/${book.id}/read`}
      className="block rounded-lg border border-neutral-200/60 dark:border-neutral-800 p-3 hover:shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded bg-black/5 dark:bg-white/5">
        {cover && (
          <Image
            src={cover}
            alt={`Cover of ${book.title || `Book #${book.id}`}`}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover"
            priority={false}
          />
        )}
      </div>
      <h3 className="mt-2 line-clamp-2 font-medium">
        {book.title || `Gutenberg #${book.id}`}
      </h3>
      <p className="text-sm opacity-70 line-clamp-1">{authors}</p>
    </Link>
  );
}

export default function DashboardPage() {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [bookIds, setBookIds] = useState([]); // [{bookId, createdAt}]
  const [books, setBooks] = useState([]);     // hydrated metadata
  const [error, setError] = useState(null);

  // 1) Wait for Firebase auth to resolve (signed in or not)
  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(), (u) => {
      setUser(u || null);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  // 2) When signed in, fetch /api/bookmarks then hydrate via /api/books/:id
  useEffect(() => {
    let alive = true;
    if (!authReady) return;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user) {
          // Not signed in: show a gentle prompt
          setBookIds([]);
          setBooks([]);
          return;
        }

        const token = await getAuth().currentUser.getIdToken();

        // GET /api/bookmarks -> [{ bookId, createdAt }]
        const res = await fetch('/api/bookmarks', {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });
        if (!res.ok) {
          const msg = await res.text().catch(() => '');
          throw new Error(msg || `Failed to fetch bookmarks (${res.status})`);
        }
        const list = await res.json();
        if (!alive) return;
        setBookIds(list);

        // Hydrate each with /api/books/:id
        const metas = await Promise.all(
          list.map(async (b) => {
            const r = await fetch(`/api/books/${b.bookId}`, { cache: 'force-cache' });
            if (!r.ok) return { id: Number(b.bookId) };
            const data = await r.json();
            return data?.results ? data.results[0] : data;
          })
        );
        if (alive) setBooks(metas.filter(Boolean));
      } catch (e) {
        if (alive) setError(e.message || 'Failed to load bookmarks');
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [authReady, user]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-semibold">Your Bookmarks</h1>

      {/* States: not ready / signed out / loading / error / empty / results */}
      {!authReady && (
        <p className="mt-6 opacity-70">Checking your session…</p>
      )}

      {authReady && !user && (
        <div className="mt-6">
          <p className="opacity-80">
            You’re not signed in. <Link href="/auth" className="underline">Sign in</Link> to see your bookmarks.
          </p>
        </div>
      )}

      {authReady && user && loading && (
        <p className="mt-6 opacity-70">Loading your bookmarks…</p>
      )}

      {authReady && user && error && (
        <p className="mt-6 text-red-600">Error: {error}</p>
      )}

      {authReady && user && !loading && !error && books.length === 0 && (
        <p className="mt-6 opacity-70">No bookmarks yet.</p>
      )}

      {authReady && user && !loading && !error && books.length > 0 && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {books.map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
        </div>
      )}
    </main>
  );
}
