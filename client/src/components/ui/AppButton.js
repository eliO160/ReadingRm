'use client';

import { Button as AriaButton } from 'react-aria-components';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

const cn = (...x) => x.filter(Boolean).join(' ');

/* Shared style tokens pulled from your globals.css vars */
const base =
  "inline-flex items-center gap-2 rounded-xl font-medium no-underline transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] " +
  "focus-visible:ring-offset-2 dark:focus-visible:ring-offset-0 shadow-sm";

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

const variants = {
  /* Purple background using your tokens; black text in light, white in dark */
  primary:
    "bg-[color:var(--link)] text-black dark:text-white hover:bg-[color:var(--link-hover)]",
  outline:
    "border border-[color:var(--link)] text-[color:var(--link)] " +
    "hover:bg-[color:var(--link)] hover:text-white dark:hover:text-black",
  ghost:
    "text-[color:var(--link)] hover:bg-black/5 dark:hover:bg-white/10",
};

/** For real button actions (submit, open modal, etc.) */
export function Button({ variant = 'primary', size = 'md', className, ...props }) {
  return (
    <AriaButton
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
    />
  );
}

/** For navigation styled like a button (internal + external) */
export function LinkButton({
  href,
  external = false,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) {
  const cls = cn(base, sizes[size], variants[variant], className);

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        {...props}
      >
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
        <ExternalLink aria-hidden className="size-4" />
      </a>
    );
  }

  // Internal navigation keeps Next.js prefetching
  return (
    <Link href={href} className={cls} {...props}>
      {children}
    </Link>
  );
}
