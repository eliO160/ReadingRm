'use client';

import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { apiAuth } from '@/lib/apiAuth';

export function useReadingProgress({ bookId, rawHtml }) {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState(null);

  // 1) Track auth state (same pattern as useBookmark)
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return unsub;
  }, []);

  // 2) Restore progress once auth + HTML + bookId are ready
  useEffect(() => {
    if (!authReady) return;
    if (!bookId || !rawHtml) return;
    if (!user) return; // not signed in → nothing to restore

    let cancelled = false;

    const restore = async () => {
      try {
        const data = await apiAuth(`/api/progress/${bookId}`, { method: 'GET' });

        // Nothing saved yet → do nothing
        if (!data || typeof data.scrollPercent !== 'number') return;

        requestAnimationFrame(() => {
          if (cancelled) return;

          const doc = document.documentElement;
          const scrollHeight = doc.scrollHeight;
          const clientHeight = window.innerHeight;
          const maxScroll = scrollHeight - clientHeight;
          if (maxScroll <= 0) return;

          const targetY = maxScroll * data.scrollPercent;
          window.scrollTo(0, targetY);
        });
      } catch (e) {
        if (e.code === 'auth/no-user') return;
        console.error('Error restoring reading progress', e);
      }
    };

    restore();

    return () => {
      cancelled = true;
    };
  }, [authReady, user, bookId, rawHtml]);

  // 3) Save progress while the user scrolls
  useEffect(() => {
    if (!authReady) return;
    if (!bookId) return;
    if (!user) return; // no user → don't save

    let lastSent = 0;
    let queuedPercent = null;
    const SAVE_INTERVAL = 5000;

    const saveProgress = async (scrollPercent) => {
      try {
        console.log('Saving progress', { bookId, scrollPercent }); // remove after confirming
        await apiAuth(`/api/progress/${bookId}`, {
          method: 'PUT',
          body: { scrollPercent }, // api() will JSON.stringify this
        });
      } catch (e) {
        if (e.code === 'auth/no-user') return;
        console.error('Error saving reading progress', e);
      }
    };

    const handleScroll = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop || 0; //how far down the user has scrolled (pixels).
      const scrollHeight = doc.scrollHeight; //total document height
      const clientHeight = window.innerHeight; //viewport height
      const maxScroll = scrollHeight - clientHeight || 1;
      const percent = scrollTop / maxScroll;
      const now = Date.now();

      console.log('Scroll progress', { bookId, percent }); 

      if (now - lastSent > SAVE_INTERVAL) {
        lastSent = now;
        queuedPercent = null;
        saveProgress(percent);
      } else {
        queuedPercent = percent;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (queuedPercent != null) {
        saveProgress(queuedPercent);
      }
    };
  }, [authReady, user, bookId, rawHtml]);
}
