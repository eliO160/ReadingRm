'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import SearchBar from './SearchBar';
import PrimaryNav from '@/components/PrimaryNav';
import { primaryLinks } from '@/config/navConfig';

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header
      role="banner"
      className="
        sticky top-0 z-40
        border-b border-neutral-200/70 dark:border-neutral-800
        backdrop-blur
        bg-[color:var(--bg)]
      "
    >
      {/* Skip link */}
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:m-2 focus:rounded focus:bg-black/10 dark:focus:bg-white/10 focus:px-2 focus:py-1">
        Skip to content
      </a>

      <div className="mx-auto max-w-screen-xl px-3 sm:px-4 md:px-6">
        {/* Top bar */}
        <div className="flex h-14 items-center justify-between gap-3">
          {/* Brand */}
          <h1 className="leading-none">
            <Link
              href="/"
              className="block font-extrabold tracking-tight text-[clamp(1.25rem,5vw,1.75rem)] whitespace-nowrap"
            >
              ReadingRm
            </Link>
          </h1>

          {/* Search (hide on xs) */}
          <div className="hidden sm:block w-[min(100%,22rem)] md:w-[28rem]">
            <SearchBar />
          </div>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-6">
            <PrimaryNav links={primaryLinks} />
            <ThemeToggle />
          </div>

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
          className={`${open ? 'block' : 'hidden'} sm:hidden pb-3 bg-[color:var(--bg)]`}
        >
          <div className="space-y-2 pt-1">
            <div className="px-1">
              <SearchBar /* compact */ />
            </div>
            <div className="flex flex-col px-1">
              <PrimaryNav
                links={primaryLinks}
                className="flex flex-col"
                onItemClick={() => setOpen(false)}
              />
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
