//state manager for reader's UI settings. Persisted in localStorage.
"use client";
import { useEffect, useState } from 'react';

const DEFAULTS = {
  size: 'M',       // S | M | L
  mode: 'light',   // light | sepia | dark
  width: 'M',      // S | M | L  (reader max width)
  font: 'serif',   // serif | sans | dyslexic
  bookmarks: {},
  lists: {},
  listOrder: [],
};

export function useReaderPrefs() {
  const [prefs, setPrefs] = useState(DEFAULTS);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('reader:prefs') || '{}');
      setPrefs({ 
        ...DEFAULTS, 
        ...saved, 
        bookmarks: saved.bookmarks || {},
        lists: saved.lists || {},
        listOrder: saved.listOrder || [],
      });
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('reader:prefs', JSON.stringify(prefs));
  }, [prefs]);

  const setPref = (key, value) => setPrefs(p => ({ ...p, [key]: value }));

  const isBookBookmarked = (bookId) => {
    if (!bookId) return false;
    return !!prefs.bookmarks?.[bookId];
  };

  const toggleBookmark = (bookId) => {
    if (!bookId) return;
    setPrefs(prev => {
      const next = { ...prev, bookmarks: { ...(prev.bookmarks || {}) } };
      if (next.bookmarks[bookId]) {
        delete next.bookmarks[bookId];
      } else {
        next.bookmarks[bookId] = true;
      }
      return next;
    });
  };

  const getLists = () => (prefs.listOrder || []).map(id => prefs.lists[id]).filter(Boolean);

  const isInList = (listId, bookId) => {
    const list = prefs.lists[listId];
    if (!list) return false;
    return list.items.includes(bookId);
  };

  const addList = (name) => {
    const id = `list:${Date.now().toString(36)}:${Math.random().toString(36).slice(2,6)}`;
    const entry = { id, name: name?.trim() || 'Untitled', items: [], createdAt: Date.now() };
    setPrefs(prev => ({
      ...prev,
      lists: { ...prev.lists, [id]: entry },
      listOrder: [...(prev.listOrder || []), id],
    }));
    return id;
  };

  const renameList = (listId, nextName) => {
    setPrefs(prev => {
      const list = prev.lists[listId];
      if (!list) return prev;
      return {
        ...prev,
        lists: { ...prev.lists, [listId]: { ...list, name: nextName?.trim() || list.name } },
      };
    });
  };

  const deleteList = (listId) => {
    setPrefs(prev => {
      if (!prev.lists[listId]) return prev;
      const { [listId]: _, ...rest } = prev.lists;
      return {
        ...prev,
        lists: rest,
        listOrder: (prev.listOrder || []).filter(id => id !== listId),
      };
    });
  };

  const addBookToList = (listId, bookId) => {
    setPrefs(prev => {
      const list = prev.lists[listId];
      if (!list || list.items.includes(bookId)) return prev;
      return {
        ...prev,
        lists: {
          ...prev.lists,
          [listId]: { ...list, items: [...list.items, bookId] },
        },
      };
    });
  };

  const removeBookFromList = (listId, bookId) => {
    setPrefs(prev => {
      const list = prev.lists[listId];
      if (!list || !list.items.includes(bookId)) return prev;
      return {
        ...prev,
        lists: {
          ...prev.lists,
          [listId]: { ...list, items: list.items.filter(id => id !== bookId) },
        },
      };
    });
  };

  const createListAndAdd = (name, bookId) => {
    const id = addList(name);
    addBookToList(id, bookId);
    return id;
  };

  const listsContainingBook = (bookId) => {
    const out = new Set();
    for (const id of prefs.listOrder || []) {
      const l = prefs.lists[id];
      if (l?.items?.includes(bookId)) out.add(id);
    }
    return out;
  };

  return { 
    prefs, setPref, 
    isBookBookmarked, toggleBookmark,
    getLists, isInList, addList, renameList, deleteList,
    addBookToList, removeBookFromList, createListAndAdd, listsContainingBook,
  };
}
