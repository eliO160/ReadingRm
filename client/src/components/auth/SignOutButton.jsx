'use client';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebaseClient';
import { useRouter } from 'next/navigation';

export default function SignOutButton({ className = '' }) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/'); // send them home after sign out
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <button
    type="button"
      className={className || 'nav-link'}
      onClick={handleSignOut}
    >
      Sign out
    </button>
  );
}
