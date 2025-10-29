'use client';
import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from "lucide-react";

export default function BookmarkButton({ isBookmarked, onToggle, size=20 }) {

  const [pressed, setPressed] = useState(!!isBookmarked);

  useEffect(() => setPressed(!!isBookmarked), [isBookmarked]);

  return (
    <button
        type="button"
        aria-pressed={pressed}
        aria-label={pressed ? "Remove bookmark" : "Add bookmark"}
        title={pressed ? "Remove bookmark" : "Add bookmark"}
        onClick={() =>{
          setPressed(p => !p);
          onToggle?.();
        }}
        className="icon-btn"
      >
        {pressed ? <BookmarkCheck size={size} /> : <Bookmark size={size} />} 
        {/* default size = 22 */}
    </button>
  );
}