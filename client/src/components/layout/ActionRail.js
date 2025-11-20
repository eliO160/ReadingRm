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

  // NEW: allow state injection from the page
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
  // If not injected, fall back to internal hook (useful for simple pages)
  const injected = prefs && setPref;
  const hook = usePrefsHook();
  const api = {
    prefs: injected ? prefs : hook.prefs,
    setPref: injected ? setPref : hook.setPref,
    isBookBookmarked: injected ? isBookBookmarked : hook.isBookBookmarked,
    toggleBookmark: injected ? toggleBookmark : hook.toggleBookmark,
    getLists: injected ? getLists : hook.getLists,
    listsContainingBook: injected ? listsContainingBook : hook.listsContainingBook,
    addBookToList: injected ? addBookToList : hook.addBookToList,
    removeBookFromList: injected ? removeBookFromList : hook.removeBookFromList,
    createListAndAdd: injected ? createListAndAdd : hook.createListAndAdd,
  };

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

  const renderers = {
    settings: () => (
      <div className="relative">
        <ReaderSettingsPopover
          prefs={api.prefs}
          setPref={api.setPref}
          closeOnSelect={false}
          // Ensure panel sits above page content
          panelClassName="z-[60]"
        />
      </div>
    ),
    bookmark: () => (
      <BookmarkButton
        isBookmarked={!!api.isBookBookmarked?.(bookId)}
        onToggle={() => api.toggleBookmark?.(bookId)}
      />
    ),
    lists: () => (
      <AddToListButton
        bookId={bookId}
        lists={api.getLists()}
        listsSelected={api.listsContainingBook(bookId)}
        onToggleList={(listId, bId) => {
          const selected = api.listsContainingBook(bId);
          const isSelected = Array.isArray(selected)
            ? selected.includes(listId)
            : Boolean(selected?.has?.(listId));
          if (isSelected) api.removeBookFromList(listId, bId);
          else api.addBookToList(listId, bId);
        }}
        onCreateList={(name, bId) => api.createListAndAdd(name, bId)}
      />
    ),
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
      {items.map(k => <div key={k}>{renderers[k]?.()}</div>)}
      {extraAfter}
    </div>
  );
}
