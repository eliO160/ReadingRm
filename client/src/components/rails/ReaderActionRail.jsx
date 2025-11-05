'use client';

import ActionRail from '@/components/layout/ActionRail';
import ReaderSettingsPopover from '@/components/customizations/ReaderSettingsPopover';
import Bookmark from '@/components/user_actions/Bookmark';
import AddToListButton from '@/components/user_actions/AddToListButton';
import TocButton from '@/components/user_actions/TocButton';
import { useReaderPrefs } from '@/components/customizations/useReaderPrefs';

export default function ReaderActionRail({
  bookId,
  tocItems = [],
  contentRef,              // article ref for scrolling (optional if your TocButton calls onNavigate)
  top = '7.5rem',
  left = '1rem',
}) {
  const {
    prefs, setPref,
    isBookBookmarked, toggleBookmark,
    getLists, listsContainingBook,
    addBookToList, removeBookFromList, createListAndAdd,
  } = useReaderPrefs();

  const scrollToAnchor = (id) => {
    if (!id || !contentRef?.current) return;
    const target = contentRef.current.querySelector(`#${CSS.escape(id)}`);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <ActionRail top={top} left={left}>
      <div className="relative">
        <ReaderSettingsPopover
          prefs={prefs}
          setPref={setPref}
          closeOnSelect={false}
        />
      </div>

      <Bookmark
        isBookmarked={!!isBookBookmarked?.(bookId)}
        onToggle={() => toggleBookmark?.(bookId)}
      />

      <AddToListButton
        bookId={bookId}
        lists={getLists()}
        listsSelected={listsContainingBook(bookId)}
        onToggleList={(listId, bId) => {
          const selected = listsContainingBook(bId);
          const isSelected = Array.isArray(selected)
            ? selected.includes(listId)
            : Boolean(selected?.has?.(listId));
          if (isSelected) removeBookFromList(listId, bId);
          else addBookToList(listId, bId);
        }}
        onCreateList={(name, bId) => createListAndAdd(name, bId)}
      />

      <TocButton items={tocItems} onNavigate={scrollToAnchor} />
    </ActionRail>
  );
}
