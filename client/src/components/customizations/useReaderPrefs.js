"use client";
import { useEffect, useState } from 'react';

const DEFAULTS = {
  size: 'M',       // S | M | L
  mode: 'light',   // light | sepia | dark
  width: 'M',      // S | M | L  (reader max width)
  font: 'serif',   // serif | sans | dyslexic
};

export function useReaderPrefs() {
  const [prefs, setPrefs] = useState(DEFAULTS);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('reader:prefs') || '{}');
      setPrefs({ ...DEFAULTS, ...saved });
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('reader:prefs', JSON.stringify(prefs));
  }, [prefs]);

  const setPref = (key, value) => setPrefs(p => ({ ...p, [key]: value }));

  return { prefs, setPref };
}
