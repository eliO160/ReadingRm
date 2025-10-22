import Link from "next/link";
import React from "react";

const cn = (...args) => args.filter(Boolean).join(" ");

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-3 text-lg",
};

const variantStyles = {
  primary: "btn",
  ghost:
    "inline-flex items-center justify-center rounded-xl font-semibold " +
    "text-[color:var(--link)] hover:text-[color:var(--link-hover)] bg-transparent px-3 py-1.5",
  outline:
    "inline-flex items-center justify-center rounded-xl font-semibold border px-4 py-2 " +
    "border-[color:var(--link)] text-[color:var(--link)] hover:bg-[color:var(--link)] hover:text-[color:var(--bg)]",
};

export default function LinkButton({
  children,
  className,
  variant = "primary",
  size = "md",
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
      className={cn(variantStyles[variant], variant !== "primary" && sizeStyles[size], className)}
      role="button"
    >
      {children}
    </Link>
  );
}
