'use client';

import { useEffect, useRef, useState } from 'react';
import { EllipsisVertical } from 'lucide-react';
import ActionRail from './ActionRail';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export default function ReaderActionsDrawer(props) {
  const [open, setOpen] = useState(true); // open by default; user can close
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  const toggle = () => setOpen(o => !o);
  const close = () => setOpen(false);

  // Close on outside click (but not when clicking the trigger)
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event) => {
      const panelEl = panelRef.current;
      const triggerEl = triggerRef.current;
      if (!panelEl || !triggerEl) return;

      const target = event.target;
      if (panelEl.contains(target) || triggerEl.contains(target)) return;

      close();
      // return focus to trigger for accessibility
      triggerEl.focus();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  // Esc to close + basic focus trap inside drawer
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        triggerRef.current?.focus();
        return;
      }

      if (event.key !== 'Tab') return;

      const panelEl = panelRef.current;
      if (!panelEl) return;

      const focusables = Array.from(
        panelEl.querySelectorAll(FOCUSABLE_SELECTOR)
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  // When opened, move focus into drawer
  useEffect(() => {
    if (!open) return;
    const panelEl = panelRef.current;
    if (!panelEl) return;

    const focusables = panelEl.querySelectorAll(FOCUSABLE_SELECTOR);
    if (focusables.length > 0) {
      focusables[0].focus();
    } else {
      panelEl.focus();
    }
  }, [open]);

  return (
    <>
      {/* Toggle button under header, aligned with rail, top-left */}
      <button
        ref={triggerRef}
        type="button"
        className="icon-btn fixed z-50 left-3 bottom-15"
        aria-label={open ? 'Hide reader controls' : 'Show reader controls'}
        title={open ? 'Hide Reader Controls' : 'Show Reader Controls' }
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="reader-actions-drawer"
        onClick={toggle}
      >
        <EllipsisVertical size={22} />
      </button>

      {/* Overlay (like a nav drawer) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 sm:bg-black/20"
          aria-hidden="true"
        />
      )}

      {/* Drawer panel with ActionRail inside */}
      <aside
        id="reader-actions-drawer"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Reader controls"
        tabIndex={-1}
        className={`
          fixed z-50 top-[7.5rem] left-4
          transition-transform duration-200 ease-out
          ${open ? 'translate-x-0' : '-translate-x-[110%]'}
        `}
      >
        <ActionRail
          {...props}
          // The drawer controls layout; ActionRail just draws buttons
          className="
            rounded-2xl border border-neutral-200/80 dark:border-neutral-800
            bg-[color:var(--bg)] shadow-lg
            px-2 py-3 flex flex-col items-center gap-3
          "
        />
      </aside>
    </>
  );
}
