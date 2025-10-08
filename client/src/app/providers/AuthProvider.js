"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebaseClient";

// Create a Context to hold auth state for the whole app.
const AuthCtx = createContext({ user: null, loading: true });

export function AuthProvider({ children }) {
  const [state, setState] = useState({ user: null, loading: true });

  useEffect(() => {
    // Subscribe once to auth changes (login, logout, token refresh).
    const unsub = auth.onAuthStateChanged((user) => {
      // When Firebase finishes its initial check, we set loading=false.
      setState({ user, loading: false });
    });
    // Clean up the subscription on unmount (important in dev/HMR).

    return () => unsub();
  }, []);

  // Make {user, loading} available to every descendant.
  return <AuthCtx.Provider value={state}>{children}</AuthCtx.Provider>;
}

// Small convenience hook so components can do: const { user, loading } = useAuth()
export function useAuth() {
  return useContext(AuthCtx);
}
