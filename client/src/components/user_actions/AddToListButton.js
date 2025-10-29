'use client';

import { useState } from 'react';
import { ListPlus, Check } from 'lucide-react';
import PopoverPanel from '../ui/PopoverPanel';

export default function AddToListButton({
  bookId,
  lists = [],                          // [{id,name,items}]
  listsSelected = new Set(),           // Set(listId) containing this book
  onToggleList,                        // (listId, bookId) => void (toggle add/remove)
  onCreateList,                        // (name, bookId) => void (create + add)
  size = 22,
}) {
  const [open, setOpen] = useState(false);
  const [newListName, setNewListName] = useState('');

  const handleCreate = () => {
    const name = newListName.trim();
    if (!name) return;
    onCreateList?.(name, bookId);
    setNewListName('');
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="add-to-list-popover"
        aria-label="Add to lists"
        title="Add to lists"
        onClick={() => setOpen(o => !o)}
        className="icon-btn"
      >
        <ListPlus size={size} />
      </button>

      <PopoverPanel
        open={open}
        onClose={() => setOpen(false)}
        placementClass="absolute left-12 top-1"
        className="w-72"
      >
        <div className="mb-2">
          <h3 className="text-sm font-semibold opacity-80">Add to lists</h3>
        </div>

        {/* Existing lists */}
        <ul className="max-h-56 overflow-auto pr-1 -mr-1">
          {lists.length === 0 && (
            <li className="text-sm opacity-70 py-2">You don’t have any lists yet.</li>
          )}
          {lists.map((l) => {
            const checked = listsSelected.has(l.id);
            return (
              <li key={l.id} className="py-1">
                <button
                  type="button"
                  onClick={() => onToggleList?.(l.id, bookId)}
                  className="
                    w-full flex items-center justify-between
                    rounded-lg px-2 py-2
                    hover:bg-neutral-100/60 dark:hover:bg-neutral-900/60
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-[color:var(--ring)]
                  "
                  aria-pressed={checked}
                  aria-label={checked ? `Remove from ${l.name}` : `Add to ${l.name}`}
                  title={checked ? `Remove from ${l.name}` : `Add to ${l.name}`}
                >
                  <span className="text-sm">{l.name}</span>
                  <span
                    className="
                      inline-flex items-center justify-center
                      h-5 w-5 rounded
                      border border-neutral-300 dark:border-neutral-700
                    "
                    aria-hidden
                  >
                    {checked ? <Check size={16} /> : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Divider */}
        <div className="my-2 h-px bg-neutral-200 dark:bg-neutral-800" />

        {/* New list input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="New list name"
            className="
              flex-1 rounded-lg px-3 py-2 text-sm
              bg-transparent border
              border-neutral-300 dark:border-neutral-700
              focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]
            "
          />
          <button
            type="button"
            onClick={handleCreate}
            className="
              rounded-lg px-3 py-2 text-sm font-medium
              border border-neutral-200/70 dark:border-neutral-800
              bg-[color:var(--bg)]/80 hover:bg-neutral-100/60 dark:hover:bg-neutral-900/60
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-[color:var(--ring)]
            "
          >
            Create & Add
          </button>
        </div>
    </PopoverPanel>
    </div>
  );
}
