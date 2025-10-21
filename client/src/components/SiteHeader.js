'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import SearchBar from './SearchBar';

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header
      role="banner"
      className="
        sticky top-0 z-40
        border-b border-neutral-200/70 dark:border-neutral-800
        backdrop-blur
      "
      // Use your tokenized background from globals.css
      style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 88%, transparent)' }}
    >
      {/* Skip link for a11y */}
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:m-2 focus:rounded focus:bg-black/10 dark:focus:bg-white/10 focus:px-2 focus:py-1">
        Skip to content
      </a>

      <div className="mx-auto max-w-screen-xl px-3 sm:px-4 md:px-6">
        {/* Top bar */}
        <div className="flex h-14 items-center justify-between gap-3">
          {/* Brand (Header content) */}
          <h1 className="leading-none">
            <Link
              href="/"
              className="block font-extrabold tracking-tight text-[clamp(1.25rem,5vw,1.75rem)] whitespace-nowrap"
            >
              ReadingRm
            </Link>
          </h1>

          {/* Search (hide on very small screens) */}
          <div className="hidden sm:block w-[min(100%,22rem)] md:w-[28rem]">
            <SearchBar />
          </div>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden sm:flex items-center gap-6">
            <Link href="/about">About</Link>
            <Link href="/demo_page">Demo Page</Link>
            <Link href="/search">Advanced Search</Link>
            <Link href="/signIn">Sign In</Link>
            <ThemeToggle />
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="sm:hidden inline-flex items-center justify-center rounded-md p-2 outline-none ring-1 ring-transparent hover:ring-neutral-300 dark:hover:ring-neutral-700"
            aria-label="Toggle menu"
            aria-controls="mobile-menu"
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile panel */}
        <nav
          id="mobile-menu"
          aria-label="Primary (mobile)"
          className={`${open ? 'block' : 'hidden'} sm:hidden pb-3`}
          style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 94%, transparent)' }}
        >
          <div className="space-y-2 pt-1">
            <div className="px-1">
              <SearchBar /* compact */ />
            </div>
            <div className="flex flex-col px-1">
              <Link className="py-2" href="/about" onClick={() => setOpen(false)}>About</Link>
              <Link className="py-2" href="/demo_page" onClick={() => setOpen(false)}>Demo Page</Link>
              <Link className="py-2" href="/search" onClick={() => setOpen(false)}>Advanced Search</Link>
              <Link className="py-2" href="/signIn" onClick={() => setOpen(false)}>Sign In</Link>
              <div className="py-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
