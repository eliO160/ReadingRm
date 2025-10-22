'use client';

import { useEffect, useRef, useState } from 'react';
import { Settings } from 'lucide-react';
import ReaderSettings from './ReaderSettings';

export default function ReaderSettingsPopover({
  prefs,
  setPref,
  title = 'Reader settings',
  closeOnSelect = false,
  buttonClassName = '',
  panelClassName = '',
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const panelRef = useRef(null);

  // Close on Esc
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) {
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }
  }, [open]);

  // Click outside to close
  useEffect(() => {
    function onDocClick(e) {
      if (!open) return;
      const t = e.target;
      if (panelRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  // Wrap setPref so we can optionally close after a selection
  const handleSetPref = (key, value) => {
    setPref(key, value);
    if (closeOnSelect) setOpen(false);
  };

  return (
    <>
      {/* Gear button */}
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="reader-settings-popover"
        onClick={() => setOpen(v => !v)}
        className={[
          // size & layout
          "inline-flex h-9 w-9 items-center justify-center rounded-full",
          // surfaces + borders
          "border border-neutral-300 dark:border-neutral-700",
          "bg-white text-neutral-800",         // explicit icon/text color (light)
          "dark:bg-neutral-900 dark:text-neutral-100", // explicit icon/text (dark)
          "hover:bg-neutral-100 dark:hover:bg-neutral-800",
          // focus
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400",
          // motion
          "transition",
          buttonClassName
        ].join(' ')}
        title={title}
      >
        <Settings className="h-5 w-5 text-inherit" strokeWidth={2.25} aria-hidden="true" />
      </button>

      {/* Overlay (improves contrast in dark/paper modes) */}
      <div
        aria-hidden="true"
        className={[
          "fixed inset-0 z-40 transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0",
          // Use semi-opaque in dark, lighter in light
          "bg-black/20 dark:bg-black/40"
        ].join(' ')}
        onClick={() => setOpen(false)}
      />

      {/* Popover panel (anchored near the button) */}
      <div
        id="reader-settings-popover"
        ref={panelRef}
        role="dialog"
        aria-modal="false"
        aria-label={title}
        className={[
          "fixed z-50 w-80 max-w-[92vw] rounded-xl",
          // OPAQUE surfaces — do NOT inherit reader vars here
          "bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100",
          // clearer border + stronger shadow in dark
          "border border-neutral-200 dark:border-neutral-700",
          "shadow-xl shadow-black/10 dark:shadow-black/50",
          // spacing
          "p-3",
          // open/close animation (opacity + slight scale)
          "transition-all duration-150",
          open
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 pointer-events-none -translate-y-1 scale-95",
          // default placement (to the right of a left-side button); override via prop if needed
          panelClassName || "left-16 top-1/2 -translate-y-1/2"
        ].join(' ')}
      >
        <ReaderSettings prefs={prefs} setPref={handleSetPref} />
      </div>
    </>
  );
}
