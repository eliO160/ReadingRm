'use client';

import { useCallback, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { apiAuth } from '@/lib/apiAuth';

function normalizeList(doc) {
  if (!doc) return null;
  return {
    id: doc._id,
    name: doc.name,
    items: doc.items || [],   // [{ bookId, ... }]
  };
}

export function useLists() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  // Watch Firebase auth state
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  const fetchLists = useCallback(async () => {
    // If there is no user, don't call the API at all
    if (!user) {
      setLists([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiAuth('/api/lists'); // GET /api/lists
      const normalized = Array.isArray(data)
        ? data.map(normalizeList).filter(Boolean)
        : [];
      setLists(normalized);
    } catch (e) {
      // If the hook somehow runs before auth is really ready, don't treat "no user" as an error
      if (e.code === 'auth/no-user' || e.message === 'Not authenticated') {
        setLists([]);
        setError(null);
      } else {
        setError(e);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch lists whenever we have a user
  useEffect(() => {
    if (!authReady) return;
    if (!user) {
      // signed out
      setLists([]);
      setError(null);
      setLoading(false);
      return;
    }
    fetchLists();
  }, [authReady, user, fetchLists]);

  const getLists = useCallback(() => lists, [lists]);

  const listsContainingBook = useCallback((bookId) => {
    const selected = new Set();
    if (!bookId) return selected;
    for (const l of lists) {
      if (l.items?.some((it) => it.bookId === String(bookId))) {
        selected.add(l.id);
      }
    }
    return selected;
  }, [lists]);

  const addBookToList = useCallback(async (listId, bookId) => {
    if (!user) return;
    try {
      const updated = await apiAuth(`/api/lists/${listId}/items`, {
        method: 'POST',
        body: { bookId: String(bookId) },
      });
      const norm = normalizeList(updated);
      setLists((prev) => prev.map((l) => (l.id === norm.id ? norm : l)));
    } catch (e) {
      console.error('addBookToList failed', e);
      setError(e);
    }
  }, [user]);

  const removeBookFromList = useCallback(async (listId, bookId) => {
    if (!user) return;
    try {
      const updated = await apiAuth(`/api/lists/${listId}/items`, {
        method: 'DELETE',
        body: { bookId: String(bookId) },
      });
      const norm = normalizeList(updated);
      setLists((prev) => prev.map((l) => (l.id === norm.id ? norm : l)));
    } catch (e) {
      console.error('removeBookFromList failed', e);
      setError(e);
    }
  }, [user]);

  const createListAndAdd = useCallback(async (name, bookId) => {
    if (!user) return;
    try {
      const created = await apiAuth('/api/lists', {
        method: 'POST',
        body: { name },
      });
      const createdNorm = normalizeList(created);

      let finalList = createdNorm;
      if (bookId) {
        const updated = await apiAuth(`/api/lists/${createdNorm.id}/items`, {
          method: 'POST',
          body: { bookId: String(bookId) },
        });
        finalList = normalizeList(updated);
      }

      setLists((prev) => [...prev, finalList]);
    } catch (e) {
      console.error('createListAndAdd failed', e);
      setError(e);
    }
  }, [user]);

  // 🔹 NEW: rename list
  const renameList = useCallback(async (listId, name) => {
    if (!user) return;
    const trimmed = name.trim();
    if (!trimmed) return;

    try {
      const updated = await apiAuth(`/api/lists/${listId}`, {
        method: 'PATCH',
        body: { name: trimmed },
      });
      const norm = normalizeList(updated);
      setLists((prev) => prev.map((l) => (l.id === norm.id ? norm : l)));
    } catch (e) {
      console.error('renameList failed', e);
      setError(e);
    }
  }, [user]);

  // 🔹 NEW: delete list
  const deleteList = useCallback(async (listId) => {
    if (!user) return;
    try {
      await apiAuth(`/api/lists/${listId}`, {
        method: 'DELETE',
      });
      setLists((prev) => prev.filter((l) => l.id !== listId));
    } catch (e) {
      console.error('deleteList failed', e);
      setError(e);
    }
  }, [user]);

  return {
    lists,
    loading,
    error,
    getLists,
    listsContainingBook,
    addBookToList,
    removeBookFromList,
    createListAndAdd,
    renameList,
    deleteList,
    refresh: fetchLists,
  };
}
