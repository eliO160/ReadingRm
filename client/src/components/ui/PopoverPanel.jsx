'use client';
import { useEffect, useRef } from 'react';

export default function PopoverPanel({
  open,
  onClose,
  className = '',
  children,
  // default anchor: to the right of the trigger wrapper
  placementClass = 'absolute left-12 top-1',
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    const onClick = (e) => {
      if (ref.current?.contains(e.target)) return;
      onClose?.();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="false"
      className={[
        placementClass,
        // shared chrome
        "z-[60] w-80 max-w-[92vw] p-3 transition-all duration-150 backdrop-blur",
        "popover-surface",
        className
      ].join(' ')}
    >
      {children}
    </div>
  );
}
