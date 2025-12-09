'use client';
import { ArrowUpToLine } from 'lucide-react';

export default function TopOfPageButton({
  size = 22,
  label = 'Go to top of page',
}) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.replaceState(null, '', '#');
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={label}
      title={label}           // <-- this makes the hover text appear
      className="icon-btn"    // your shared styles
    >
      <ArrowUpToLine size={size} />
    </button>
  );
}
