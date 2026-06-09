import { useEffect, useRef, useState } from 'react'

// "Sign in with Google" via Google Identity Services (GIS).
// Set VITE_GOOGLE_CLIENT_ID (a Google OAuth Web client ID, with this origin
// added to "Authorized JavaScript origins") to enable the real button.
// Without it, a styled fallback button explains how to turn it on.
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(decodeURIComponent(escape(window.atob(payload))))
  } catch {
    return null
  }
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}

export default function GoogleLogin({ onSuccess }) {
  const btnRef = useRef(null)
  const cb = useRef(onSuccess)
  cb.current = onSuccess
  const [note, setNote] = useState('')

  useEffect(() => {
    if (!CLIENT_ID) return
    let cancelled = false

    function init() {
      if (cancelled || !window.google?.accounts?.id || !btnRef.current) return
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: (resp) => {
          const data = decodeJwt(resp.credential)
          if (data) cb.current?.({ name: data.name, email: data.email, picture: data.picture })
        },
      })
      window.google.accounts.id.renderButton(btnRef.current, {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        width: 320,
      })
    }

    if (window.google?.accounts?.id) {
      init()
    } else {
      let s = document.getElementById('gis-script')
      if (!s) {
        s = document.createElement('script')
        s.src = 'https://accounts.google.com/gsi/client'
        s.async = true
        s.defer = true
        s.id = 'gis-script'
        document.head.appendChild(s)
      }
      s.addEventListener('load', init)
      return () => {
        cancelled = true
        s.removeEventListener('load', init)
      }
    }
  }, [])

  // Real Google button
  if (CLIENT_ID) {
    return <div ref={btnRef} className="flex justify-center min-h-[44px]" />
  }

  // Fallback (not configured yet)
  return (
    <div>
      <button
        type="button"
        onClick={() =>
          setNote(
            'Google sign-in needs setup: add a VITE_GOOGLE_CLIENT_ID and authorize this site in Google Cloud. You can still join with the form below.',
          )
        }
        className="w-full inline-flex items-center justify-center gap-3 bg-paper border-2 border-ink/25 rounded-sm px-5 py-3 text-ink font-medium hover:border-ink transition"
      >
        <GoogleIcon />
        Continue with Google
      </button>
      {note && <p className="text-xs text-ink/60 mt-2 text-center leading-relaxed">{note}</p>}
    </div>
  )
}
