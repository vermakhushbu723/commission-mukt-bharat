import { useEffect } from 'react'
import { useLanguage } from './LanguageContext'
import { translateToHindi } from './translate'

// Whole-site translator. When Hindi is selected it walks the rendered DOM,
// translating every visible text node + form placeholder, and keeps watching
// for newly rendered content. Switching back to English restores the originals.
// This covers every page without touching individual components.

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE', 'SVG', 'TEXTAREA'])

// node -> original string (for restore)
const originalText = new Map()
const originalAttr = new Map() // el -> { placeholder?, title? }

function translatableTextNode(node) {
  const p = node.parentElement
  if (!p) return false
  if (p.closest('[data-no-translate]')) return false
  let el = p
  while (el) {
    if (SKIP_TAGS.has(el.tagName)) return false
    el = el.parentElement
  }
  const txt = node.nodeValue
  if (!txt || !txt.trim()) return false
  return /[A-Za-z]/.test(txt) // skip pure numbers / punctuation / already-Hindi
}

function collectTextNodes(root) {
  const out = []
  if (root.nodeType === Node.TEXT_NODE) {
    if (translatableTextNode(root)) out.push(root)
    return out
  }
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let n
  while ((n = walker.nextNode())) {
    if (translatableTextNode(n)) out.push(n)
  }
  return out
}

function collectPlaceholders(root) {
  const els = []
  const scope = root.nodeType === Node.ELEMENT_NODE ? root : null
  const all = scope
    ? [scope, ...scope.querySelectorAll('[placeholder], [title]')]
    : []
  all.forEach((el) => {
    if (el.nodeType !== Node.ELEMENT_NODE) return
    if (el.closest('[data-no-translate]')) return
    if (el.getAttribute('placeholder') || el.getAttribute('title')) els.push(el)
  })
  return els
}

async function runQueue(items, worker, concurrency = 6) {
  const queue = [...items]
  const runners = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    while (queue.length) {
      const item = queue.shift()
      await worker(item)
    }
  })
  await Promise.all(runners)
}

async function toHindi(root, isActive) {
  // text nodes
  const nodes = collectTextNodes(root)
  nodes.forEach((node) => {
    if (!originalText.has(node)) originalText.set(node, node.nodeValue)
  })
  await runQueue(nodes, async (node) => {
    if (!isActive()) return
    const orig = originalText.get(node)
    if (orig == null) return
    const trimmed = orig.trim()
    const start = orig.indexOf(trimmed)
    const lead = orig.slice(0, start)
    const trail = orig.slice(start + trimmed.length)
    const hi = await translateToHindi(trimmed)
    if (isActive() && node.isConnected) node.nodeValue = lead + hi + trail
  })

  // placeholders / titles
  const els = collectPlaceholders(root)
  await runQueue(els, async (el) => {
    if (!isActive()) return
    if (!originalAttr.has(el)) {
      originalAttr.set(el, {
        placeholder: el.getAttribute('placeholder'),
        title: el.getAttribute('title'),
      })
    }
    const o = originalAttr.get(el)
    if (o.placeholder) el.setAttribute('placeholder', await translateToHindi(o.placeholder))
    if (o.title) el.setAttribute('title', await translateToHindi(o.title))
  })
}

function restore() {
  for (const [node, orig] of originalText) {
    try {
      if (node.isConnected) node.nodeValue = orig
    } catch {
      /* node gone */
    }
  }
  for (const [el, o] of originalAttr) {
    try {
      if (o.placeholder != null) el.setAttribute('placeholder', o.placeholder)
      if (o.title != null) el.setAttribute('title', o.title)
    } catch {
      /* el gone */
    }
  }
}

export default function Translator() {
  const { lang } = useLanguage()

  useEffect(() => {
    const root = document.getElementById('root') || document.body
    if (lang !== 'hi') {
      restore()
      return
    }

    let active = true
    const isActive = () => active

    toHindi(root, isActive)

    // Translate content React renders later (filtered lists, new posts, etc.)
    let timer = null
    const pending = []
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((nd) => {
          if (nd.nodeType === Node.ELEMENT_NODE || nd.nodeType === Node.TEXT_NODE) pending.push(nd)
        })
      })
      if (pending.length) {
        clearTimeout(timer)
        timer = setTimeout(() => {
          const batch = pending.splice(0)
          batch.forEach((nd) => {
            if (nd.isConnected) toHindi(nd, isActive)
          })
        }, 120)
      }
    })
    observer.observe(root, { childList: true, subtree: true })

    return () => {
      active = false
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [lang])

  return null
}
