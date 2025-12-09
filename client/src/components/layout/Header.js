'use client';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-3 py-2 sm:px-4 md:px-6">
      <h1 className="font-bold leading-none">
        <Link 
          href="/"
          className="            
            block
            text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl
            tracking-tight whitespace-nowrap
          "
        >
          ReadingRm
        </Link>
      </h1>
    </header>
  );
}

