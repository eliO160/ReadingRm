'use client';

import { useState } from 'react';
import { TableOfContents as TocIcon, ListTree } from 'lucide-react';
import PopoverPanel from '../../ui/PopoverPanel';

export default function TocButton({
  items = [],                   // [{id,title,level}]
  onNavigate,                   // (id) => void (scroll to)
  size = 22,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = query
    ? items.filter(i => i.title.toLowerCase().includes(query.toLowerCase()))
    : items;

  const Icon = TocIcon ?? ListTree; // fallback if your Lucide version lacks TableOfContents

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="toc-popover"
        aria-label="Table of contents"
        title="Table of contents"
        onClick={() => setOpen(o => !o)}
        className="icon-btn"
      >
        <Icon size={size} />
      </button>

      <PopoverPanel
        open={open}
        onClose={() => setOpen(false)}
        placementClass="absolute left-12 top-1"
        className="w-72"
      >
          <div className="mb-2 flex items-center gap-2">
            <h3 className="text-sm font-semibold opacity-80 flex-1">Contents</h3>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter chapters…"
              className="
                w-40 rounded-lg px-2 py-1 text-sm
                bg-transparent border
                border-neutral-300 dark:border-neutral-700
                focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]
              "
            />
          </div>

          <ul className="max-h-72 overflow-auto pr-1 -mr-1">
            {filtered.length === 0 && (
              <li className="text-sm opacity-70 py-2">No chapters found.</li>
            )}
            {filtered.map((it) => (
              <li key={it.id}>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate?.(it.id);
                    setOpen(false);
                  }}
                  className={`
                    w-full text-left rounded-lg px-2 py-2
                    hover:bg-neutral-100/60 dark:hover:bg-neutral-900/60
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-[color:var(--ring)]
                    ${it.level === 1 ? 'pl-2 font-semibold'
                      : it.level === 2 ? 'pl-4'
                      : 'pl-6 opacity-90'}
                  `}
                >
                  <span className="text-sm">{it.title}</span>
                </button>
              </li>
            ))}
          </ul>
      </PopoverPanel>
    </div>
  );
}
