'use client';
import { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from "@/components/ThemeToggle";
import SearchBar from './SearchBar';
import { Menu, X } from 'lucide-react';

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <nav 
      role="navigation"
      aria-label="Main navigation"
      className="
        sticky top-0 z-40
        border-b border-neutral-200/70 dark:border-neutral-800
        bg-[color:var(--bg)]
        backdrop-blur supports-[backdrop-filter]:bg-[color:var(--bg)]
      "
    >
      <div className="mx-auto max-w-screen-xl px-3 sm:px-4 md:px-6">
        {/* Top row */}
        <div className="flex h-14 items-center justify-between gap-3">

          {/* Center/left: Search (hidden on very small screens) */}
          <div className="hidden sm:block w-[min(100%,22rem)] md:w-[28rem]">
            <SearchBar />
          </div>

          {/* Right: full menu on sm+ */}
          <div className="hidden sm:flex items-center gap-6">
            <Link href="/about">About</Link>
            <Link href="/demo_page">Demo Page</Link>
            <Link href="/search">Advanced Search</Link>
            <Link href="/signIn">Sign In</Link>
            <ThemeToggle />
          </div>

          {/* Right: hamburger on mobile */}
          <button
            type="button"
            className="sm:hidden inline-flex items-center justify-center rounded-md p-2 outline-none ring-1 ring-transparent hover:ring-neutral-300 dark:hover:ring-neutral-700"
            aria-label="Open menu"
            aria-controls="mobile-menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile panel */}
        <div
          id="mobile-menu"
          className={`${open ? 'block' : 'hidden'} sm:hidden pb-3 bg-[color:var(--bg)]`}
        >
          <div className="space-y-2 pt-1">
            {/* If your SearchBar supports compact mode, pass a prop; otherwise keep as-is */}
            <div className="px-1">
              <SearchBar /* compact */ />
            </div>

            <div className="flex flex-col px-1">
              <Link className="py-2" href="/about" onClick={() => setOpen(false)}>
                About
              </Link>
              <Link className="py-2" href="/demo_page" onClick={() => setOpen(false)}>
                Demo Page
              </Link>
              <Link className="py-2" href="/search" onClick={() => setOpen(false)}>
                Advanced Search
              </Link>
              <Link className="py-2" href="/signIn" onClick={() => setOpen(false)}>
                Sign In
              </Link>
              <div className="py-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );

}