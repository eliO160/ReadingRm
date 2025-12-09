import Link from "next/link";
import React from "react";

const cn = (...args) => args.filter(Boolean).join(" ");


export default function LinkButton({
  children,
  className,
  size,
  disabled = false,
  href,
  ...rest
}) {
  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <Link
      href={href}
      {...rest}
      aria-disabled={disabled || undefined}
      onClick={handleClick}
      className={cn("btn", className)}
      role="button"
    >
      {children}
    </Link>
  );
}
