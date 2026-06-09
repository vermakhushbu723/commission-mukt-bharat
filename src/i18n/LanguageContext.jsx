import { createContext, useContext, useEffect, useState } from 'react'

// Global language state (en | hi), persisted so the choice survives reloads.
const LanguageContext = createContext({ lang: 'en', setLang: () => {} })

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return window.localStorage.getItem('cmb-lang') || 'en'
    } catch {
      return 'en'
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem('cmb-lang', lang)
    } catch {
      /* ignore */
    }
    document.documentElement.lang = lang
  }, [lang])

  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}
