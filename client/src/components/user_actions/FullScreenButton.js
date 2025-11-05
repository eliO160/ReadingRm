// components/user_actions/FullscreenToggleButton.jsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

export default function FullScreenButton({
  targetRef,                 // optional: fullscreen just this element
  className = 'icon-btn',    // match other buttons by default
  size = 22,                 // same default as AddToListButton
  withHotkey = true,
  hotkey = 'f',
  requestNavigationUI = 'hide',
  titleEnter = 'Enter fullscreen',
  titleExit = 'Exit fullscreen (Esc)',
  onChange,
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getTarget = useCallback(
    () => (targetRef?.current ?? document.documentElement),
    [targetRef]
  );

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await getTarget().requestFullscreen({ navigationUI: requestNavigationUI });
      } else {
        await document.exitFullscreen();
      }
    } catch (e) {
      console.warn('Fullscreen failed:', e);
    }
  }, [getTarget, requestNavigationUI]);

  useEffect(() => {
    const onFsChange = () => {
      const active = Boolean(document.fullscreenElement);
      setIsFullscreen(active);
      onChange?.(active);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, [onChange]);

  useEffect(() => {
    if (!withHotkey) return;
    const onKey = (e) => {
      if (
        e.key.toLowerCase() === hotkey.toLowerCase() &&
        !e.metaKey && !e.ctrlKey && !e.altKey
      ) {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [withHotkey, hotkey, toggleFullscreen]);

  return (
    <button
      type="button"
      onClick={toggleFullscreen}
      aria-pressed={isFullscreen}
      aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      title={isFullscreen ? titleExit : titleEnter}
      className={[
        className,
        // subtle pressed/active styling to match your hover chips
        isFullscreen && 'bg-neutral-100/60 dark:bg-neutral-900/60 border-neutral-300 dark:border-neutral-700'
      ].filter(Boolean).join(' ')}
    >
      {isFullscreen ? <Minimize2 size={size} /> : <Maximize2 size={size} />}
    </button>
  );
}
