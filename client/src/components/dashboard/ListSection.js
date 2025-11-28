'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

export default function ListSection({
  list,
  booksForList,
  onRename,  // (newName) => Promise | void
  onDelete,  // () => Promise | void
  BookCard,  // component to render each book
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(list.name);

  // Keep local draft in sync if list name changes from outside
  useEffect(() => {
    setDraftName(list.name);
  }, [list.name]);

  const handleSave = async () => {
    const trimmed = draftName.trim();
    // If nothing changed, just exit edit mode
    if (!trimmed || trimmed === list.name) {
      setIsEditing(false);
      return;
    }
    await onRename?.(trimmed);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const ok = window.confirm(
      `Remove the list "${list.name}"?\n\nThis action is permanent and will remove the list from your account (books themselves will not be affected).`
    );
    if (!ok) return;
    await onDelete?.();
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <input
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              className="
                rounded-lg px-2 py-1 text-sm
                border border-neutral-300 dark:border-neutral-700
                bg-transparent
                focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]
              "
            />
            <button
              type="button"
              onClick={handleSave}
              className="text-xs px-2 py-1 rounded bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => { setIsEditing(false); setDraftName(list.name); }}
              className="text-xs px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <h3 className="text-lg font-medium">{list.name}</h3>

            {/* Edit button with Pencil icon */}
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              aria-label={`Rename list ${list.name}`}
              className="
                inline-flex items-center justify-center
                rounded-full p-1
                border border-neutral-300 dark:border-neutral-700
                hover:bg-neutral-100 dark:hover:bg-neutral-800
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-[color:var(--ring)]
              "
            >
              <Pencil size={16} />
            </button>

            {/* Delete button with Trash2 icon */}
            <button
              type="button"
              onClick={handleDelete}
              aria-label={`Remove list ${list.name}`}
              className="
                inline-flex items-center justify-center
                rounded-full p-1
                border border-red-300 text-red-700 dark:border-red-700
                hover:bg-red-50 dark:hover:bg-red-950
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-red-500
              "
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>

      {booksForList.length === 0 ? (
        <p className="mt-2 text-sm opacity-70">This list is empty.</p>
      ) : (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {booksForList.map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
        </div>
      )}
    </div>
  );
}
