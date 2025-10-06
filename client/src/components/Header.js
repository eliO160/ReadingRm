'use client';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex justify-between items-center p-3">
      <h1 className="text-9xl font-bold">
        <Link href="/">ReadingRm</Link>
      </h1>
    </header>
  );
}

