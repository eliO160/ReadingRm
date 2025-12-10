// wrapper that injects the Firebase ID token into existing api()
'use client';
import { getAuth } from 'firebase/auth';
import { api } from './api';

export async function apiAuth(path, opts = {}) {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    const err = new Error('Not authenticated');
    err.code = 'auth/no-user';
    throw err;
  }
  const token = await user.getIdToken(false);
  return api(path, { ...opts, token });
}
