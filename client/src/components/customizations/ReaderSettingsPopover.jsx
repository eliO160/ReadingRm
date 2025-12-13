'use client';
import { useState } from 'react';
import { Settings } from 'lucide-react';
import ReaderSettings from './ReaderSettings';
import PopoverPanel from '@/components/ui/PopoverPanel';

export default function ReaderSettingsPopover({
  prefs,
  setPref,
  title = 'Reader settings',
  closeOnSelect = false,
  triggerClassName = '',
  panelClassName = '',
  placementClass = 'absolute left-12 top-1', // default anchor next to the button
  showOverlay = false,                        // optional scrim
}) {
  const [open, setOpen] = useState(false);

  const handleSetPref = (key, value) => {
    setPref(key, value);
    if (closeOnSelect) setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        className={triggerClassName || 'icon-btn'}
        title={title}
        aria-label={title}
      >
        <Settings className="h-5 w-5" aria-hidden="true" />
      </button>

      {showOverlay && open && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      <PopoverPanel
        open={open}
        onClose={() => setOpen(false)}
        placementClass={placementClass}
        className={panelClassName}
      >
        <ReaderSettings prefs={prefs} setPref={handleSetPref} />
      </PopoverPanel>
    </div>
  );
}
