// server/cache.js
const store = new Map(); // key -> { data, exp }
const TTL = 60_000;

export function getCache(key) {
  const v = store.get(key);
  if (!v || v.exp < Date.now()) { store.delete(key); return null; }
  return v.data;
}
export function setCache(key, data, ttl = TTL) {
  store.set(key, { data, exp: Date.now() + ttl });
}
