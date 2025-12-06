'use client';

import BookCover from '@/components/BookCover';
import { getBestCoverUrl } from '@/lib/covers';

import { useBookmark } from '@/hooks/useBookmark';
import { useLists } from '@/hooks/useLists';
import BookmarkButton from '@/components/user_actions/Bookmark';
import AddToListButton from '@/components/user_actions/AddToListButton';

export default function BookDetailsPopover({ book, onClose }) {
  // We only render this component when `book` is set from SearchResultsPage,
  // so we can safely assume book is defined.
  const bookId = String(book.id);
  const coverUrl = getBestCoverUrl(book, 'medium');

  // ===== Bookmark hook (same as reader/demo reader) =====
  const { bookmarked, toggle: toggleBookmark } = useBookmark(bookId);

  // ===== Lists hook (same API you use with ActionRail) =====
  const {
    getLists,
    listsContainingBook,
    addBookToList,
    removeBookFromList,
    createListAndAdd,
  } = useLists();

  const lists = getLists ? getLists() : [];
  const selectedLists = listsContainingBook
    ? listsContainingBook(bookId)
    : [];

  const hasListsApi =
    Boolean(
      getLists &&
      listsContainingBook &&
      addBookToList &&
      removeBookFromList &&
      createListAndAdd
    ) && lists.length > 0;

  const authors =
    book.authors && book.authors.length
      ? book.authors.map((a) => a.name).join(', ')
      : 'Unknown author';

  const languages = book.languages?.join(', ') || 'Unknown';
  const subjects = book.subjects?.slice(0, 10) || [];
  const bookshelves = book.bookshelves || [];
  const summaries = Array.isArray(book.summaries) ? book.summaries : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:items-center sm:px-0"
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-details-title"
    >
      {/* Backdrop – click anywhere to close */}
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close book details"
      />

      {/* Popover card */}
      <div className="
        relative z-10 max-auto w-full max-w-2xl 
        max-h-[90vh] overflow-hidden 
        rounded-2xl bg-white shadow-2xl dark:bg-slate-900
        flex flex-col
        "
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="
            absolute right-3 top-3 rounded-full border 
            border-slate-200 bg-white px-2.5 py-1 text-sm font-medium 
            text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 
            dark:bg-slate-800 dark:text-slate-100"
          aria-label="Close details"
        >
          ✕
        </button>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-4 md:grid-cols-[160px,1fr]">
            {/* LEFT: Cover */}
            <div className="flex items-start justify-center">
              {coverUrl ? (
                <BookCover
                  src={coverUrl}
                  title={book.title}
                  width={160}
                  height={240}
                  className="h-60 w-40 rounded-lg shadow-md"
                />
              ) : (
                <div className="flex h-60 w-40 items-center justify-center rounded-lg bg-black/5 text-xs opacity-60 dark:bg-white/10">
                  No cover
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: metadata + actions */}
          <div className="flex min-w-0 flex-col gap-2">
            {/* Icons row at top-right */}
            <div className="mb-1 flex justify-right gap-2">
              {/* Bookmark */}
              <BookmarkButton
                isBookmarked={!!bookmarked}
                onToggle={toggleBookmark}
                size={22}
              />

              {/* Add to lists (only if lists API is ready) */}
              {hasListsApi && (
                <AddToListButton
                  bookId={bookId}
                  lists={lists}
                  listsSelected={selectedLists}
                  onToggleList={(listId, bId) => {
                    const selectedForBook = listsContainingBook(bId);
                    const isSelected = Array.isArray(selectedForBook)
                      ? selectedForBook.includes(listId)
                      : Boolean(selectedForBook?.has?.(listId));

                    if (isSelected) removeBookFromList(listId, bId);
                    else addBookToList(listId, bId);
                  }}
                  onCreateList={(name, bId) => createListAndAdd(name, bId)}
                  size={22}
                />
              )}
            </div>

            <h2
              id="book-details-title"
              className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
            >
              {book.title}
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-300">
              <span className="font-medium">Author:</span> {authors}
            </p>

            <div className="flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-300">
              <span>
                <span className="font-medium">Languages:</span> {languages}
              </span>
            </div>

            {/* Summary */}
            {summaries.length > 0 && (
              <div className="mt-3 space-y-1">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Summary
                </h3>
                {summaries.map((s, idx) => (
                  <p
                    key={idx}
                    className="text-sm text-slate-700 dark:text-slate-300"
                  >
                    {s}
                  </p>
                ))}
              </div>
            )}

            {/* Subjects */}
            {subjects.length > 0 && (
              <div className="mt-3 space-y-1">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Subjects
                </h3>
                <div className="flex flex-wrap gap-1">
                  {subjects.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bookshelves */}
            {bookshelves.length > 0 && (
              <div className="mt-3 space-y-1">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Bookshelves
                </h3>
                <div className="flex flex-wrap gap-1">
                  {bookshelves.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
