export function getGutendexCover(formats) {
  return formats?.['image/jpeg'] || null;
}

export function buildPgCoverUrl(id, size = 'medium') {
  return `https://www.gutenberg.org/cache/epub/${id}/pg${id}.cover.${size}.jpg`;
}

export function getBestCoverUrl(book, size = 'medium') {
  return getGutendexCover(book.formats) || buildPgCoverUrl(book.id, size);
}
