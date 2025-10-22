'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function PrimaryNav({ links, className = '', onItemClick }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className={className}>
      {links.map(({ href, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            onClick={onItemClick}
            className={
              "px-0.5 " +
              (isActive
                ? "font-semibold text-[color:var(--link)] underline underline-offset-4"
                : "hover:text-[color:var(--link-hover)]")
            }
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
