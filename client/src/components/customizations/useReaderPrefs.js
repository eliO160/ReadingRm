'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { apiAuth } from '@/lib/apiAuth';

const DEFAULTS = { mode: 'light', size: 'md', width: 'normal', font: 'serif' };

export function useReaderPrefs() {
  const [prefs, setPrefs] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);

  const auth = useMemo(() => getAuth(), []);
  const isSaving = useRef(false);
  const lastServerSnapshot = useRef(null);
  const debTimer = useRef(null);

  // Load server prefs when auth state changes
  useEffect(() => {
    setLoading(true);

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // logged out → use defaults (you can also load localStorage here if you want)
        lastServerSnapshot.current = null;
        setPrefs(DEFAULTS);
        setLoading(false);
        return;
      }

      try {
        const server = await apiAuth('/api/prefs');
        lastServerSnapshot.current = server;
        setPrefs((prev) => ({ ...prev, ...server })); // merge server over defaults/current
      } catch (e) {
        console.error('load prefs failed', e);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [auth]);

  // Debounced save to server for authenticated users
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;                // only persist if logged in
    if (isSaving.current) return;

    if (shallowEqual(prefs, lastServerSnapshot.current)) return; // no change vs server

    clearTimeout(debTimer.current);
    debTimer.current = setTimeout(async () => {
      try {
        isSaving.current = true;
        const saved = await apiAuth('/api/prefs', {
          method: 'PATCH',
          body: { prefs },
        });
        lastServerSnapshot.current = saved;
      } catch (e) {
        console.error('save prefs failed', e);
      } finally {
        isSaving.current = false;
      }
    }, 300);

    return () => clearTimeout(debTimer.current);
  }, [prefs, auth]);

  const setPref = useCallback((key, value) => {
    setPrefs((prev) => (prev[key] === value ? prev : { ...prev, [key]: value }));
  }, []);

  return { prefs, setPref, loading };
}

function shallowEqual(a, b) {
  if (!a || !b) return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  for (const k of ka) if (a[k] !== b[k]) return false;
  return true;
}
