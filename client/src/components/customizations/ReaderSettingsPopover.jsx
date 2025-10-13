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
      {/* Gear button (position it wherever you like) */}
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="reader-settings-popover"
        onClick={() => setOpen(v => !v)}
        className={[
          "rounded-full border border-neutral-300 bg-white/90 p-3 shadow hover:bg-white",
          "focus:outline-none focus:ring-2 focus:ring-neutral-400",
          buttonClassName
        ].join(' ')}
        title={title}
      >
        <Settings className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* Popover panel (anchored near the button) */}
      <div
        id="reader-settings-popover"
        ref={panelRef}
        role="dialog"
        aria-modal="false"
        aria-label={title}
        className={[
          "fixed z-50 w-72 max-w-[90vw] rounded-lg border border-neutral-200",
          "bg-[var(--reader-bg)] text-[var(--reader-fg)] shadow-xl",
          "transition-opacity duration-150",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
          panelClassName || "left-16 top-1/2 -translate-y-1/2" // default placement (to the right of a left-side button)
        ].join(' ')}
      >
        <div className="p-3">
          <ReaderSettings prefs={prefs} setPref={handleSetPref} />
        </div>
      </div>
    </>
  );
}
