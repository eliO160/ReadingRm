//route logic to connect to Gutendex API
import { getCache, setCache } from '../services/cache.js';
import { searchGutendex, getGutendexBookById, getGutendexBookHtml } from '../services/gutendexService.js';
import axios from 'axios';

function logAxiosError(err, where = "") {
  if (err?.code === 'ECONNABORTED') {
    console.error(`${where}: TIMEOUT (ECONNABORTED) after`, err.config?.timeout, "ms");
  } else if (err?.response) {
    console.error(`${where} → HTTP ${err.response.status}`, err.response.data);
  } else if (err?.request) {
    console.error(`${where} → Network error`, err.code || err.message);
  } else {
    console.error(`${where} → Setup error`, err?.message);
  }
}

export const searchBooks = async (req, res) => {
  const key = `search:${JSON.stringify(req.query)}`;
  try {
    const cached = getCache(key);
    if (cached) {
      res.set("Cache-Control", "public, max-age=60");
      return res.json(cached);
    }
    const data = await searchGutendex(req.query);
    setCache(key, data);
    res.set("Cache-Control", "public, max-age=60");
    res.json(data);
  } catch (error) {
    const status = error?.code === 'ECONNABORTED' ? 504 : 502;
    res.status(status).json({ error: "Upstream fetch failed" });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await getGutendexBookById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (error) {
    logAxiosError(error, "getBookById");
    res.status(502).json({ error: "Upstream fetch failed" });
  }
};

export const getBookHtml = async (req, res) => {
  try {
    const html = await getGutendexBookHtml(req.params.id);
    if (!html) return res.status(404).json({ error: "HTML format not available" });
    res.send(html);
  } catch (error) {
    logAxiosError(error, "getBookHtml");
    res.status(502).json({ error: "Upstream fetch failed" });
  }
};