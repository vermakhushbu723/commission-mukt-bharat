import { useEffect } from 'react'
import AnnouncementBar from './components/layout/AnnouncementBar'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import SwarmChatButton from './components/SwarmChatButton'
import Home from './pages/Home'
import ArticlesPage from './pages/ArticlesPage'
import IssuesPage from './pages/IssuesPage'

// Dependency-free routing: the Vite dev/preview server serves index.html for any
// path, so we pick the page from the URL. Full-page <a> navigations keep it simple.
function currentPage() {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/'
  if (path === '/articles' || path.startsWith('/articles/')) return 'articles'
  if (path === '/issues' || path.startsWith('/issues/')) return 'issues'
  return 'home'
}

export default function App() {
  // Reveal-on-scroll: fade `.reveal` elements in as they enter the viewport.
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const page = currentPage()

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <AnnouncementBar />
      <Header />

      {page === 'articles' ? <ArticlesPage /> : page === 'issues' ? <IssuesPage /> : <Home />}

      <Footer />
      <SwarmChatButton />
    </>
  )
}
