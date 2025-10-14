import {useEffect, useMemo, useRef, useState} from "react";
import {
  DialogTrigger,
  Popover,
  Dialog,
  Button,
  SearchField,
  Input,
  ListBox,
  ListBoxItem,
  Heading,
  Text
} from "react-aria-components";

/**
 * Table of Contents (React Aria Components version)
 * --------------------------------------------------
 * Accessible TOC popover that either parses headings (h1–h4) from a container
 * or accepts a manual `items` list. Uses RAC primitives for keyboard and screen
 * reader support out of the box.
 *
 * Props:
 * - containerRef?: React.RefObject<HTMLElement>
 * - items?: Array<{ id: string; text: string; level?: number }>
 * - includeLevels?: number[] (default [1,2,3])
 * - title?: string (default "Table of Contents")
 * - className?: string
 */

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function ensureId(el) {
  if (!el.id || el.id.trim() === "") {
    el.id = slugify(el.textContent || "section");
  }
  return el.id;
}

function useHeadings(containerRef, includeLevels = [1, 2, 3]) {
  const [headings, setHeadings] = useState([]);
  useEffect(() => {
    const root = containerRef?.current;
    if (!root) return;
    const selector = includeLevels.map((lvl) => `h${lvl}`).join(",");
    const els = Array.from(root.querySelectorAll(selector));
    const next = els.map((el) => ({
      id: ensureId(el),
      text: el.textContent || "Untitled",
      level: Number(el.tagName.slice(1)) || 1,
    }));
    setHeadings(next);
  }, [containerRef, includeLevels.join(",")]);
  return headings;
}

function useActiveHeading(ids) {
  const [activeId, setActiveId] = useState(null);
  useEffect(() => {
    if (!ids?.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0, 1] }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids?.join(",")]);
  return [activeId, setActiveId];
}

function indentClass(level = 1) {
  switch (level) {
    case 2: return "pl-3";
    case 3: return "pl-6";
    case 4: return "pl-9";
    default: return "";
  }
}

export default function TocPopoverRAC({
  containerRef,
  items,
  includeLevels = [1, 2, 3],
  title = "Table of Contents",
  className = "",
}) {
  const parsed = useHeadings(containerRef, includeLevels);
  const effectiveItems = useMemo(() => (items && items.length ? items : parsed), [items, parsed]);
  const ids = useMemo(() => effectiveItems.map((i) => i.id), [effectiveItems]);
  const [activeId] = useActiveHeading(ids);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);

  const filtered = useMemo(() => {
    if (!query) return effectiveItems;
    return effectiveItems.filter((i) => i.text.toLowerCase().includes(query.toLowerCase()));
  }, [effectiveItems, query]);

  function scrollToId(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <DialogTrigger isOpen={open} onOpenChange={(v) => {
      setOpen(v);
      // Focus the search when opening for quick filtering
      if (v) setTimeout(() => searchRef.current?.focus(), 0);
    }}>
      <Button aria-label="Open table of contents" className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-1.5 ${className}`}>
        {/* Using an inline SVG for a list/tree icon to avoid extra deps */}
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h10M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        <span className="hidden sm:inline">Contents</span>
      </Button>

      <Popover placement="bottom start" offset={8} className="rounded-xl border shadow-lg bg-white dark:bg-zinc-900 w-80">
        <Dialog className="outline-none">
          <div className="p-3 border-b">
            <Heading slot="title" className="sr-only">{title}</Heading>
            <SearchField aria-label="Filter chapters" onChange={setQuery} className="flex items-center gap-2">
              {/* Optional visible label for a11y; using sr-only to keep UI compact */}
              <span className="sr-only">Search chapters</span>
              <Input ref={searchRef} placeholder={`${title}…`} className="flex-1 h-8 rounded-md border px-2" />
            </SearchField>
          </div>

          <div className="max-h-80 overflow-auto p-1">
            {filtered.length === 0 ? (
              <Text className="block text-sm text-zinc-500 p-3">No matches</Text>
            ) : (
              <ListBox
                aria-label={title}
                selectionMode="single"
                // onAction fires on Enter/click/press — perfect for TOC selection
                onAction={(key) => {
                  scrollToId(String(key));
                  setOpen(false);
                }}
                className="outline-none"
              >
                {filtered.map((item) => (
                  <ListBoxItem
                    id={item.id}
                    key={item.id}
                    textValue={item.text}
                    className={({ isFocused, isSelected }) =>
                      [
                        "cursor-pointer rounded-md px-2 py-1.5 text-sm",
                        indentClass(item.level),
                        isSelected || item.id === activeId ? "bg-zinc-200/60 dark:bg-zinc-700/60" : "",
                        isFocused ? "ring-2 ring-indigo-500" : "",
                      ].join(" ")
                    }
                  >
                    {item.text}
                  </ListBoxItem>
                ))}
              </ListBox>
            )}
          </div>

          <div className="flex items-center justify-between px-3 py-2 border-t text-xs text-zinc-500">
            <span>H1–H{Math.max(...includeLevels)}</span>
            <span>Enter to jump</span>
          </div>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}

/**
 * Optional: tiny anchors appended to headings for deep links.
 */
export function AnchorHeadingsRAC({ containerRef, includeLevels = [1,2,3], icon = "#" }) {
  useEffect(() => {
    const root = containerRef?.current;
    if (!root) return;
    const selector = includeLevels.map((lvl) => `h${lvl}`).join(",");
    const els = Array.from(root.querySelectorAll(selector));
    els.forEach((el) => {
      const id = ensureId(el);
      if (!el.querySelector("a.__anchor")) {
        const a = document.createElement("a");
        a.href = `#${id}`;
        a.className = "__anchor opacity-0 group-hover:opacity-100 transition ml-2 text-zinc-400 no-underline";
        a.textContent = icon;
        el.classList.add("group");
        el.appendChild(a);
      }
    });
  }, [containerRef, includeLevels.join(","), icon]);
  return null;
}

/** Example wiring
 *
 * import TocPopoverRAC, { AnchorHeadingsRAC } from "./TocPopoverRAC";
 *
 * export default function ReaderPage() {
 *   const contentRef = useRef(null);
 *   return (
 *     <div className="min-h-screen grid grid-cols-[auto_1fr]">
 *       <div className="p-3">
 *         <TocPopoverRAC containerRef={contentRef} />
 *       </div>
 *       <main className="p-6">
 *         <article ref={contentRef} className="prose max-w-3xl mx-auto">
 *           <h1>Chapter 1: Beginnings</h1>
 *           <p>…</p>
 *           <h2>The Letter</h2>
 *           <p>…</p>
 *           <h1>Chapter 2: The Journey</h1>
 *           <p>…</p>
 *         </article>
 *         <AnchorHeadingsRAC containerRef={contentRef} />
 *       </main>
 *     </div>
 *   );
 * }
 */
