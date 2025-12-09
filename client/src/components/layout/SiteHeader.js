'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import ThemeToggle from '@/components/layout/ThemeToggle';
import SearchBar from '@/components/search/SearchBar';
import PrimaryNav from '@/components/layout/PrimaryNav';
import { primaryLinks } from '@/config/navConfig';
import { useAuth } from '@/components/auth/AuthProvider';
import SignOutButton from '../auth/SignOutButton';

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [showDesktopHeader, setShowDesktopHeader] = useState(true);
  const { user } = useAuth();
  const pathname = usePathname();
  const isAuthed = !!user;

  // Define where we want the "hover at top to reveal" behavior
  const isReaderExperience =
    (pathname?.startsWith('/book/') && pathname.includes('/read')) ||
    pathname === '/demo';

  // Hide the /auth link when signed in
  const linksWithoutAuth = useMemo(
    () => primaryLinks.filter((l) => l.href !== '/auth'),
    []
  );

  // Desktop: only on reader/demo pages, reveal header when mouse is near the top
  useEffect(() => {
    if (!isReaderExperience) {
      // On all other pages, keep header visible and skip mouse tracking
      setShowDesktopHeader(true);
      return;
    }

    const handleMouseMove = (e) => {
      // Only do this on desktop widths
      if (window.innerWidth < 1024) return; // lg breakpoint-ish

      const y = e.clientY;
      // If cursor is within 48px of the top, show the header
      setShowDesktopHeader(y <= 64);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isReaderExperience]);

  // Only apply slide-in/out classes on desktop AND on reader/demo pages
  const desktopVisibilityClasses = isReaderExperience
    ? showDesktopHeader
      ? 'lg:translate-y-0 lg:opacity-100 lg:shadow-sm'
      : 'lg:-translate-y-full lg:opacity-0'
    : '';

  return (
    <header
      role="banner"
      className={`
        z-40
        border-b border-neutral-200/70 dark:border-neutral-800
        backdrop-blur
        bg-[color:var(--bg)]

        /* Default behavior: sticky header everywhere */
        sticky top-0

        /* On reader/demo pages, enhance desktop: fixed + slide-down on hover */
        ${
          isReaderExperience
            ? `
          lg:fixed lg:top-0 lg:left-0 lg:right-0
          lg:transition-all lg:transition-opacity lg:duration-300 lg:ease-in-out
          ${desktopVisibilityClasses}
        `
            : ''
        }
      `}
    >
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:m-2 focus:rounded focus:bg-black/10 dark:focus:bg-white/10 focus:px-2 focus:py-1"
      >
        Skip to content
      </a>

      <div className="mx-auto max-w-screen-xl px-3 sm:px-4 md:px-6">
        {/* Top bar */}
        <div className="flex h-14 items-center gap-3">
          {/* Left: brand */}
          <div className="flex-1 min-w-0">
            <h1 className="leading-none">
              <Link
                href="/"
                className="block font-extrabold tracking-tight text-[clamp(1.25rem,5vw,1.75rem)] whitespace-nowrap"
              >
                ReadingRm
              </Link>
            </h1>
          </div>

          {/* Center: search */}
          <div className="hidden sm:flex flex-1 justify-center">
            <div className="w-[min(100%,22rem)] md:w-[28rem]">
              <SearchBar />
            </div>
          </div>

          {/* Right: desktop nav + theme + mobile menu */}
          <div className="flex items-center justify-end gap-3">
            {/* Desktop nav group */}
            <div className="hidden sm:flex items-center gap-4">
              <PrimaryNav
                links={isAuthed ? linksWithoutAuth : primaryLinks}
              />
              {isAuthed ? <SignOutButton className="nav-link" /> : null}
              <ThemeToggle />
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="sm:hidden inline-flex items-center justify-center rounded-md p-2 outline-none ring-1 ring-transparent hover:ring-neutral-300 dark:hover:ring-neutral-700"
              aria-label="Toggle menu"
              aria-controls="mobile-menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>


        {/* Mobile panel */}
        <nav
          id="mobile-menu"
          aria-label="Primary (mobile)"
          className={`${open ? 'block' : 'hidden'} sm:hidden pb-3 bg-[color:var(--bg)]`}
        >
          <div className="space-y-3 pt-2">
            <div className="px-1">
              <SearchBar /* compact */ />
            </div>
            <div className="flex flex-col px-1 items-end gap-3">
              <PrimaryNav
                links={isAuthed ? linksWithoutAuth : primaryLinks}
                className="flex flex-col items-end gap-2 text-right"
                onItemClick={() => setOpen(false)}
              />
              <div className="flex flex-col items-end gap-2">
                {isAuthed ? <SignOutButton className="nav-link" /> : null}
                <ThemeToggle />
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
