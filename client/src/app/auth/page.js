'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import AuthForm from '@/components/auth/AuthForm';

export default function AuthPage() {
  const { user, loading } = useAuth(); // expose `loading` in your provider if you don't already
  const router = useRouter();

  // Redirect after render when user becomes truthy
  useEffect(() => {
    if (user) router.replace('/dashboard'); // or '/'
  }, [user, router]);

  // Optionally show nothing or a loader while checking auth
  if (loading) return null; // or <Spinner />

  // If logged in, we'll redirect via the effect; render nothing here
  if (user) return null;

  // Not logged in -> show the form; also redirect after successful sign-in
  return <AuthForm onSuccess={() => router.replace('/dashboard')} />;
}
