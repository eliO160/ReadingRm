// Heuristic parser for Project Gutenberg-style HTML and demo file.
// Returns [{ id, title, level }] where id is the in-page anchor.
export function parseTocFromHtml(rawHtml) {
  if (!rawHtml) return [];

  const doc = new DOMParser().parseFromString(rawHtml, 'text/html');
  const items = [];

  // -----------------------------
  // 0) Build a map from *any* internal href "#id" -> text
  //    This covers both old PG ("#link2HCH0001") and newer ones ("#scandal-in-bohemia").
  // -----------------------------
  const tocAnchorTitleMap = new Map();

  doc.querySelectorAll('a[href^="#"]').forEach((a) => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;

    const id = href.slice(1); // strip leading '#'
    let t = (a.textContent || '').replace(/\s+/g, ' ').trim();
    if (!t) return;

    if (!tocAnchorTitleMap.has(id)) {
      tocAnchorTitleMap.set(id, t);
    }
  });

  // -----------------------------
  // Helper: very light noise filter
  // -----------------------------
  const isNoiseTitle = (t) => {
    if (!t) return true;
    const title = t.toLowerCase().trim();

    if (
      title.includes('project gutenberg') ||
      title.includes('gutenberg-tm license') ||
      title.includes('full license') ||
      title.includes('end of the project gutenberg')
    ) {
      return true;
    }

    if (title.length < 2) return true;

    return false;
  };

  // -----------------------------
  // Helper: normalize (but not over-aggressively)
  // -----------------------------
  const normalizeTitle = (raw) => {
    let t = (raw || '').replace(/\s+/g, ' ').trim();
    if (!t) return '';

    // Keep full story titles like "I. A Scandal in Bohemia" as-is.
    if (t.length > 140) {
      t = t.slice(0, 137) + '…';
    }
    return t;
  };

  const pushItem = (id, rawTitle, level, allowFallback = true) => {
    if (!id) return;

    let title = normalizeTitle(rawTitle);

    if (!title && allowFallback) {
      title = `Section ${id}`;
    }

    if (!title || isNoiseTitle(title)) return;

    items.push({ id, title, level });
  };

  // Track seen ids to avoid duplicates
  const seenIds = new Set();
  const pushOnce = (id, rawTitle, level, allowFallback) => {
    if (!id || seenIds.has(id)) return;
    seenIds.add(id);
    pushItem(id, rawTitle, level, allowFallback);
  };

  // -----------------------------
  // 1) Old PG pattern: anchors with id^="link2H"
  //    (Moby Dick and many others)
  // -----------------------------
  doc.querySelectorAll('a[id^="link2H"]').forEach((a) => {
    const id = a.id;
    if (!id) return;

    // Prefer label from Contents map; fall back to local text / heading
    let rawTitle = tocAnchorTitleMap.get(id) || a.textContent?.trim() || '';

    if (!rawTitle) {
      const parent = a.parentElement;
      if (parent && /^H[1-6]$/.test(parent.tagName)) {
        rawTitle = parent.textContent?.trim() || '';
      } else {
        const nextH =
          (a.nextElementSibling &&
            /^H[1-6]$/.test(a.nextElementSibling.tagName) &&
            a.nextElementSibling) ||
          a.closest('h1,h2,h3,h4,h5,h6');
        rawTitle = nextH?.textContent?.trim() || '';
      }
    }

    pushOnce(id, rawTitle, 2, true);
  });

  // -----------------------------
  // 2) Generic anchors with ANY id (for newer PG HTML)
  //    Example: <a id="i-a-scandal-in-bohemia"></a>
  // -----------------------------
  doc.querySelectorAll('a[id]').forEach((a) => {
    const id = a.id;
    if (!id || seenIds.has(id)) return;

    let rawTitle = tocAnchorTitleMap.get(id) || a.textContent?.trim() || '';

    if (!rawTitle) {
      const parent = a.parentElement;
      if (parent && /^H[1-6]$/.test(parent.tagName)) {
        rawTitle = parent.textContent?.trim() || '';
      } else {
        const nextH =
          (a.nextElementSibling &&
            /^H[1-6]$/.test(a.nextElementSibling.tagName) &&
            a.nextElementSibling) ||
          a.closest('h1,h2,h3,h4,h5,h6');
        rawTitle = nextH?.textContent?.trim() || '';
      }
    }

    // These are often "real" anchors, so allow fallback
    pushOnce(id, rawTitle, 2, true);
  });

  // -----------------------------
  // 3) Headings with ids (h1/h2/h3 id="...").
  //    This covers semantic PG output where the id is on the heading itself.
  // -----------------------------
  doc.querySelectorAll('h1[id],h2[id],h3[id]').forEach((h) => {
    const id = h.id;
    if (!id || seenIds.has(id)) return;

    // Prefer label from Contents map if present, otherwise use heading text.
    const rawFromMap = tocAnchorTitleMap.get(id);
    const rawHeading = h.textContent?.trim() || '';
    const rawTitle = rawFromMap || rawHeading;

    const level = h.tagName === 'H1' ? 1 : h.tagName === 'H2' ? 2 : 3;
    // No fallback needed; headings already have text
    pushOnce(id, rawTitle, level, false);
  });

  // items are already in DOM order because querySelectorAll preserves order
  return items;
}
