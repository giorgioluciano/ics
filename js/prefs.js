// prefs.js — remembers the reader's settings between visits (a small first-party cookie).
// If cookies are unavailable (e.g. inside a sandboxed preview frame) settings simply
// last for the current visit.
const NAME = 'icb_prefs';
const PATH = location.pathname.replace(/[^/]*$/, '') || '/';

function load() {
  try {
    const m = document.cookie.match(new RegExp(`(?:^|; )${NAME}=([^;]*)`));
    return m ? JSON.parse(decodeURIComponent(m[1])) : {};
  } catch { return {}; }
}

const cache = load();

export const prefs = {
  get(key, fallback = null) { return key in cache ? cache[key] : fallback; },
  set(key, value) {
    cache[key] = value;
    try {
      document.cookie = `${NAME}=${encodeURIComponent(JSON.stringify(cache))}; max-age=31536000; path=${PATH}; SameSite=Lax`;
    } catch { /* not allowed here: keep in memory */ }
  },
};
