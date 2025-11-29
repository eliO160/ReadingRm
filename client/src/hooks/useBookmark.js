'use client';
import { useCallback, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import { api } from '@/lib/api';      // ❌ no longer needed
import { apiAuth } from '@/lib/apiAuth';

export function useBookmark(bookId) {
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [error, setError] = useState(null);

  // Know when auth is initialized (so we know whether to call the API)
  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(), () => setAuthReady(true));
    return unsub;
  }, []);

  // Initial load of bookmark status (only call server if logged in)
  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!bookId) return;
      setLoading(true);
      setError(null);

      try {
        const user = getAuth().currentUser;
        if (!user) {
          if (!cancelled) {
            setBookmarked(false);
            setLoading(false);
          }
          return;
        }

        // 🔹 Use apiAuth so token + headers are consistent with your other calls
        const data = await apiAuth(
          `/api/bookmarks/${encodeURIComponent(bookId)}`,
          { method: 'GET' }
        );

        if (!cancelled) {
          setBookmarked(Boolean(data?.bookmarked));
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e);
          setLoading(false);
        }
      }
    }

    if (authReady) run();
    return () => {
      cancelled = true;
    };
  }, [bookId, authReady]);

  const toggle = useCallback(async () => {
    const user = getAuth().currentUser;
    if (!user) {
      const err = new Error('Please sign in to bookmark');
      err.code = 'auth/no-user';
      setError(err);
      return;
    }

    setError(null);
    setBookmarked((prev) => !prev); // optimistic

    try {
      if (!bookmarked) {
        // add
        await apiAuth('/api/bookmarks', {
          method: 'POST',
          body: { bookId: String(bookId) },
        });
      } else {
        // remove
        await apiAuth(`/api/bookmarks/${encodeURIComponent(bookId)}`, {
          method: 'DELETE',
        });
      }
    } catch (e) {
      // revert optimism
      setBookmarked((prev) => !prev);
      setError(e);
    }
  }, [bookId, bookmarked]);

  return { bookmarked, toggle, loading, error };
}
