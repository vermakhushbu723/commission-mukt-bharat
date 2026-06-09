// Lightweight English→Hindi translation with aggressive caching.
// Uses Google's public translate endpoint (keyless). Results are cached in
// memory and localStorage, so a phrase is fetched at most once ever.
const mem = new Map()

function key(text) {
  return `hi::${text}`
}

function fromCache(text) {
  if (mem.has(text)) return mem.get(text)
  try {
    const v = window.localStorage.getItem(key(text))
    if (v) {
      mem.set(text, v)
      return v
    }
  } catch {
    /* ignore */
  }
  return null
}

function toCache(text, value) {
  mem.set(text, value)
  try {
    window.localStorage.setItem(key(text), value)
  } catch {
    /* storage full — memory cache still helps this session */
  }
}

export async function translateToHindi(text) {
  const cached = fromCache(text)
  if (cached !== null) return cached
  try {
    const url =
      'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=' +
      encodeURIComponent(text)
    const res = await fetch(url)
    if (!res.ok) throw new Error('translate http ' + res.status)
    const data = await res.json()
    const out = (data[0] || []).map((seg) => seg[0]).join('')
    if (out) {
      toCache(text, out)
      return out
    }
  } catch {
    /* network/CORS/rate-limit — fall back to original text */
  }
  return text
}
