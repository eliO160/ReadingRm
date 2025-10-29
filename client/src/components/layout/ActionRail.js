'use client';

export default function ActionRail({
  children,
  top = '7.5rem',       // accepts CSS length (e.g. '6rem', '120px')
  left = '1rem',         // keep aligned with your gear
  className = '',
  ariaLabel = 'Reader quick actions',
}) {
  return (
    <div
      className={
        "fixed z-50 flex flex-col items-center gap-3 " + className
      }
      style={{ top, left }}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}
