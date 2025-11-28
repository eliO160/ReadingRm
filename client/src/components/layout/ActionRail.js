'use client';
import { useMemo, useRef, useState } from 'react';
import ReaderSettingsPopover from '@/components/customizations/ReaderSettingsPopover';
import BookmarkButton from '@/components/user_actions/Bookmark';
import AddToListButton from '@/components/user_actions/AddToListButton';
import FullScreenButton from '@/components/user_actions/FullScreenButton';
import TocButton from '@/components/user_actions/TocButton';
import { parseTocFromHtml } from '@/components/toc/parseTocfromHtml';
import { useReaderPrefs as usePrefsHook } from '@/components/customizations/useReaderPrefs';

export default function ActionRail({
  top = '7.5rem',
  left = '1rem',
  className = '',
  ariaLabel = 'Reader quick actions',

  bookId,
  tocHtml,
  tocItems,
  contentRef,

  // from page (optional)
  prefs,
  setPref,
  isBookBookmarked,
  toggleBookmark,
  getLists,
  listsContainingBook,
  addBookToList,
  removeBookFromList,
  createListAndAdd,

  items = ['settings','bookmark','lists','toc','fullscreen'],
  extraBefore = null,
  extraAfter = null,
  onFullscreenChange,
}) {
  // ===== 1) Prefs: allow injection, otherwise fall back to hook =====
  const injectedPrefs = prefs && setPref;
  const prefsHook = usePrefsHook();

  const effectivePrefs = injectedPrefs ? prefs : prefsHook.prefs;
  const effectiveSetPref = injectedPrefs ? setPref : prefsHook.setPref;

  // ===== 2) Do we even have lists wired? =====
  const hasListsApi = Boolean(
    getLists &&
    listsContainingBook &&
    addBookToList &&
    removeBookFromList &&
    createListAndAdd
  );

  // ===== 3) ToC parsing + fullscreen =====
  const [isFullscreen, setIsFullscreen] = useState(false);

  const computedTocItems = useMemo(() => {
    if (tocItems && Array.isArray(tocItems)) return tocItems;
    if (tocHtml) return parseTocFromHtml(tocHtml);
    return [];
  }, [tocHtml, tocItems]);

  const localContentRef = useRef(null);
  const anchorContainerRef = contentRef || localContentRef;

  const scrollToAnchor = (id) => {
    if (!id || !anchorContainerRef?.current) return;
    const el = anchorContainerRef.current.querySelector(`#${CSS.escape(id)}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `#${id}`);
    }
  };

  const handleFullscreen = (val) => {
    setIsFullscreen(val);
    onFullscreenChange?.(val);
  };

  // ===== 4) Renderers =====
  const renderers = {
    settings: () => (
      <div className="relative">
        <ReaderSettingsPopover
          prefs={effectivePrefs}
          setPref={effectiveSetPref}
          closeOnSelect={false}
          panelClassName="z-[60]"
        />
      </div>
    ),

    bookmark: () => {
      if (!bookId || !toggleBookmark) return null;
      const isMarked = !!isBookBookmarked?.(bookId);
      return (
        <BookmarkButton
          isBookmarked={isMarked}
          onToggle={() => toggleBookmark?.(bookId)}
        />
      );
    },

    lists: () => {
      if (!hasListsApi || !bookId) return null;
      const lists = getLists();
      const selected = listsContainingBook(bookId);

      return (
        <AddToListButton
          bookId={bookId}
          lists={lists}
          listsSelected={selected}
          onToggleList={(listId, bId) => {
            const selectedForBook = listsContainingBook(bId);
            const isSelected = Array.isArray(selectedForBook)
              ? selectedForBook.includes(listId)
              : Boolean(selectedForBook?.has?.(listId));

            if (isSelected) removeBookFromList(listId, bId);
            else addBookToList(listId, bId);
          }}
          onCreateList={(name, bId) => createListAndAdd(name, bId)}
        />
      );
    },

    toc: () => (
      <TocButton items={computedTocItems} onNavigate={scrollToAnchor} />
    ),

    fullscreen: () => (
      <FullScreenButton onChange={handleFullscreen} size={22} />
    ),
  };

  return (
    <div
      className={"fixed z-50 flex flex-col items-center gap-3 " + className}
      style={{ top, left }}
      aria-label={ariaLabel}
    >
      {extraBefore}
      {items.map((k) => (
        <div key={k}>{renderers[k]?.()}</div>
      ))}
      {extraAfter}
    </div>
  );
}
