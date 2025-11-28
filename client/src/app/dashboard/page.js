'use client';

import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';
import Image from 'next/image';
import { getBestCoverUrl } from '@/lib/covers';
import { useLists } from '@/hooks/useLists';
import ListSection from '@/components/dashboard/ListSection';

function BookCard({ book }) {
  const cover = getBestCoverUrl(book, 'small');
  const authors =
    (book?.authors || []).map(a => a.name).join(', ') || 'Unknown author';

  return (
    <Link
      href={`/book/${book.id}/read`}
      className="block rounded-lg border border-neutral-200/60 dark:border-neutral-800 p-3 hover:shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded bg-black/5 dark:bg:white/5">
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

  // Bookmarks state
  const [loading, setLoading] = useState(true);
  const [bookIds, setBookIds] = useState([]); // [{bookId, createdAt}]
  const [books, setBooks] = useState([]);     // hydrated metadata
  const [error, setError] = useState(null);

  // Lists state (from hook)
  const {
    lists,
    loading: listsLoading,
    error: listsError,
    renameList,
    deleteList,
  } = useLists();

  // Shared meta cache for lists (bookId -> meta)
  const [listBookMeta, setListBookMeta] = useState({});

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

  // 3) Hydrate list books into metadata
  useEffect(() => {
    let alive = true;
    if (!authReady || !user) return;
    if (!lists || lists.length === 0) return;

    (async () => {
      try {
        // Get all unique bookIds across all lists
        const allIds = new Set();
        for (const l of lists) {
          for (const item of l.items || []) {
            if (item.bookId) allIds.add(String(item.bookId));
          }
        }

        // Filter out ones we already have in cache
        const toFetch = [...allIds].filter((id) => !listBookMeta[id]);
        if (toFetch.length === 0) return;

        const entries = await Promise.all(
          toFetch.map(async (bookId) => {
            const r = await fetch(`/api/books/${bookId}`, { cache: 'force-cache' });
            if (!r.ok) return [bookId, { id: Number(bookId) }];
            const data = await r.json();
            const meta = data?.results ? data.results[0] : data;
            return [bookId, meta];
          })
        );

        if (!alive) return;

        setListBookMeta((prev) => {
          const next = { ...prev };
          for (const [id, meta] of entries) {
            next[id] = meta;
          }
          return next;
        });
      } catch (e) {
        console.error('Failed to hydrate list books', e);
      }
    })();

    return () => { alive = false; };
  }, [authReady, user, lists, listBookMeta]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 space-y-10">
      <section>
        <div className="text-2xl font-semibold">Your Bookmarks</div>

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
      </section>

      {/* Lists section */}
      {authReady && user && (
        <section>
          <div className="text-2xl font-semibold">Your Lists</div>

          {listsLoading && (
            <p className="mt-4 opacity-70">Loading your lists…</p>
          )}

          {listsError && (
            <p className="mt-4 text-red-600">
              Error loading lists: {listsError.message || String(listsError)}
            </p>
          )}

          {!listsLoading && !listsError && lists.length === 0 && (
            <p className="mt-4 opacity-70">
              You don’t have any lists yet. Use the “Lists” button in the reader to create one.
            </p>
          )}

          {!listsLoading && !listsError && lists.length > 0 && (
            <div className="mt-4 space-y-8">
              {lists.map((list) => {
                const items = list.items || [];
                const booksForList = items
                  .map((item) => listBookMeta[String(item.bookId)])
                  .filter(Boolean);

                return (
                  <ListSection
                    key={list.id}
                    list={list}
                    booksForList={booksForList}
                    onRename={(newName) => renameList(list.id, newName)}
                    onDelete={() => deleteList(list.id)}
                    BookCard={BookCard}
                  />
                );
              })}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
