'use client';
import { createContext, useContext, useMemo } from 'react';
import { useReaderPrefs } from './useReaderPrefs';

const ReaderPrefsCtx = createContext(null);
export const useReaderPrefsContext = () => useContext(ReaderPrefsCtx);

export function ReaderPrefsProvider({ children }) {
  const api = useReaderPrefs(); // { prefs, setPref, ...helpers }
  const value = useMemo(() => api, [api.prefs]); // memoize on prefs changes
  return <ReaderPrefsCtx.Provider value={value}>{children}</ReaderPrefsCtx.Provider>;
}
