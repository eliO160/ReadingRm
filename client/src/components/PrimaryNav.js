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
            className={`nav-link ${isActive ? 'nav-link--active' : ''}`} 
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
