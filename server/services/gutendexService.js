import { http } from "./http.js";
import { withRetry } from "./retry.js";

export async function searchGutendex(params) {
  const clean = { ...params };
  if (typeof clean.search === "string") {
    clean.search = clean.search.trim().replace(/\s+/g, " ");
  }
  return withRetry(async () => {
    const { data } = await http.get("https://gutendex.com/books", { params: clean });
    return data;
  }, { retries: 3, baseDelayMS: 400 });
}

export async function getGutendexBookById(id) {
  return withRetry(async () => {
    const { data } = await http.get("https://gutendex.com/books/", {params : { ids: id } });
    return data.results?.[0] ?? null;
  });
}

export async function getGutendexBookHtml(id) {
  const book = await getGutendexBookById(id);
  if (!book) return null;

  const f = book.formats || {};

  const htmlUrl =
    f["text/html"] ||
    f["text/html; charset=utf-8"] ||
    f["text/html; charset=us-ascii"] ||
    f["text/html; charset=iso-8859-1"];

  if (!htmlUrl) return null;

  return withRetry(async () => {
    const { data } = await http.get(htmlUrl);
    return data;
  });
}

