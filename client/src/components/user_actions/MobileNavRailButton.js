'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { primaryLinks } from '@/config/navConfig';
import { useAuth } from '@/components/auth/AuthProvider';

export default function MobileNavRailButton({
  className = 'icon-btn',
  size = 22,
  titleClosed = 'Open navigation',
  titleOpen = 'Close navigation',
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const isAuthed = !!user;
  const rootRef = useRef(null);

  const links = useMemo(
    () => (isAuthed ? primaryLinks.filter(l => l.href !== '/auth') : primaryLinks),
    [isAuthed]
  );

  const toggle = () => setOpen(o => !o);
  const close = () => setOpen(false);

  // Close when clicking/tapping outside
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event) => {
      if (!rootRef.current) return;
      if (rootRef.current.contains(event.target)) return; // click inside -> ignore
      close();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className="relative lg:hidden">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={open ? titleOpen : titleClosed}
        title={open ? titleOpen : titleClosed}
        aria-pressed={open}
        className={className}
      >
        <Menu size={size} />
      </button>

      {open && (
        <nav
          aria-label="Primary navigation (mobile)"
          className="
            absolute left-full top-0 ml-2 z-50
            rounded-xl border border-neutral-200/80 dark:border-neutral-800
            bg-[color:var(--bg)] shadow-lg
            p-2 min-w-[11rem]
          "
        >
          <ul className="flex flex-col gap-1 text-sm">
            {links.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={close}
                    aria-current={isActive ? 'page' : undefined}
                    className={`
                      block w-full text-left rounded-lg px-3 py-1.5
                      hover:bg-neutral-100/80 dark:hover:bg-neutral-800/70
                      ${isActive ? 'font-semibold underline' : ''}
                    `}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}
