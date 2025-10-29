// Heuristic parser for Project Gutenberg-style HTML and your demo file.
// Returns [{ id, title, level }] where id is the in-page anchor.
export function parseTocFromHtml(rawHtml) {
  if (!rawHtml) return [];
  const doc = new DOMParser().parseFromString(rawHtml, 'text/html');

  const items = [];

  // 1) Typical PG anchors like #link2HCH0001, #link2H_Epil, etc.
  doc.querySelectorAll('a[id^="link2H"]').forEach(a => {
    // If anchor has no text, look ahead for a heading sibling.
    let title = a.textContent?.trim();
    if (!title) {
      const nextH = a.nextElementSibling && /H[1-6]/.test(a.nextElementSibling.tagName)
        ? a.nextElementSibling
        : a.parentElement && /H[1-6]/.test(a.parentElement.tagName)
          ? a.parentElement
          : a.closest('h1,h2,h3,h4,h5,h6');
      title = nextH?.textContent?.trim() || `Section ${a.id}`;
    }
    items.push({ id: a.id, title, level: 2 });
  });

  // 2) Generic headings with ids (some PG files use <h2 id="chapter-1">)
  doc.querySelectorAll('h1[id],h2[id],h3[id]').forEach(h => {
    const t = h.textContent?.trim();
    const id = h.id;
    if (!id || !t) return;
    // Avoid duplicates if already captured via link2H anchors
    if (!items.some(x => x.id === id)) {
      const level = h.tagName === 'H1' ? 1 : h.tagName === 'H2' ? 2 : 3;
      items.push({ id, title: t, level });
    }
  });

  // Light normalization: keep order as they appear in the document
  // (querySelectorAll already preserves order; we appended in that order)
  // Final cleanup: de-dup titles/ids
  const seen = new Set();
  return items.filter(it => {
    const key = it.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
