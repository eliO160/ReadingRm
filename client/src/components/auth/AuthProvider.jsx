'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, getIdToken } from 'firebase/auth';
import { auth } from '@/lib/firebaseClient';

const Ctx = createContext({ user: null, token: null, loading: true, refreshToken: async () => {} });

export function AuthProvider({ children }) {
  const [state, setState] = useState({ user: null, token: null, loading: true });

  const refreshToken = useCallback(async (user) => {
    const token = user ? await getIdToken(user, true) : null;
    setState((s) => ({ ...s, token }));
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      const token = user ? await getIdToken(user) : null;
      setState({ user, token, loading: false });
    });
    return () => unsub();
  }, []);

  return <Ctx.Provider value={{ ...state, refreshToken }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
