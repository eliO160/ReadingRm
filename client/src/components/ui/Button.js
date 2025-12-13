import React from "react";

/* simple class combiner so you don't need clsx */
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

const Spinner = () => (
  <span
    aria-hidden="true"
    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
  />
);

export default function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  type = "button",
  loading = false,
  disabled,
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={cn(variantStyles[variant], variant !== "primary" && sizeStyles[size], className)}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      aria-disabled={isDisabled || undefined}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <Spinner />
          <span>Loading…</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
