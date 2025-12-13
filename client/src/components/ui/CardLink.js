'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const cn = (...x) => x.filter(Boolean).join(' ');

export default function CardLink({
  href,
  title,
  children,          // description/content
  external = false,  // open in new tab + icon
  className,
  icon,              
  ...rest
}) {
  const baseCard =
    "group block rounded-2xl border border-black/10 dark:border-white/10 " +
    "p-6 transition-transform duration-150 hover:-translate-y-[2px] " +
    "shadow-sm hover:shadow-md focus:outline-none";

  const tokenColors = "bg-[color:var(--bg)] text-[color:var(--fg)]";

  const content = (
    <div className={cn(baseCard, tokenColors, className)}>
      <div className="flex items-start gap-3">
        {icon && <div className="mt-1">{icon}</div>}
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{title}</h3>
          {children && (
            <p className="mt-2 leading-relaxed opacity-90">{children}</p>
          )}
          <div className="mt-4 inline-flex items-center gap-2 font-semibold text-[color:var(--link)] group-hover:text-[color:var(--link-hover)]">
            <span>Open</span>
            {external ? (
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            ) : (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="no-underline"
        aria-label={`${title} (opens in a new tab)`}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      aria-label={title}
      className="no-underline"
      {...rest}
    >
      {content}
    </Link>
  );
}
