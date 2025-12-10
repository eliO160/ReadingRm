'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import AuthForm from '@/components/auth/AuthForm';

export default function AuthPage() {
  const { user, loading } = useAuth(); 
  const router = useRouter();

  // Redirect after render when user becomes truthy
  useEffect(() => {
    if (user) 
      router.replace('/dashboard'); 
  }, [user, router]);

  if (loading) return null; //While auth state is still being determined, the page renders nothing
  if (user) return null; //user already logged in, don't render auth form

  // Not logged in -> show the form; also redirect after successful sign-in
  return <AuthForm onSuccess={() => router.replace('/dashboard')} />;
}
