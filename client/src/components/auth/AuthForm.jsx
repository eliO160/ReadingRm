'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebaseClient';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { useAuth } from './AuthProvider';
import { api } from '@/lib/api';
import { EyeOff, Eye } from 'lucide-react';

export default function AuthForm({ defaultMode = 'signin', onSuccess }) {
  const [mode, setMode] = useState(defaultMode); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { refreshToken } = useAuth(); // from AuthProvider

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const cred =
        mode === 'signup'
          ? await createUserWithEmailAndPassword(auth, email, password)
          : await signInWithEmailAndPassword(auth, email, password);

      // ensure we have a fresh ID token for the API call
      await refreshToken?.(cred.user);

      // call backend to upsert the user (creates User doc in Mongo)
      const token = await cred.user.getIdToken();
      await api('/api/me', { token });

      onSuccess?.(cred.user);
    } catch (err) {
      setError(err?.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-xl font-semibold mb-4">
        {mode === 'signup' ? 'Create an account' : 'Sign in'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          className="w-full rounded border px-3 py-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            className="w-full rounded border px-3 pr-10 py-2"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            required
            aria-label="Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 
            rounded hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none 
            focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <Eye size={18} aria-hidden="true" /> : <EyeOff size={18} aria-hidden="true" />}
          </button>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded bg-black text-white py-2 disabled:opacity-60 dark:bg-white dark:text-black"
        >
          {busy ? 'Please wait…' : mode === 'signup' ? 'Sign up' : 'Sign in'}
        </button>
      </form>

      {error && <p className="mt-3 text-red-600 text-sm">{error}</p>}

      <button
        className="mt-4 text-sm underline"
        onClick={() => setMode((m) => (m === 'signup' ? 'signin' : 'signup'))}
      >
        {mode === 'signup'
          ? 'Have an account? Sign in'
          : "New here? Create an account"}
      </button>
    </div>
  );
}
