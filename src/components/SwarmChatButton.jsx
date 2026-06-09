import { useEffect, useRef, useState } from 'react'
import { MessageCircleIcon, CloseIcon } from './ui/Icons'
import { getBotReply, CHAT_WELCOME, CHAT_SUGGESTIONS } from '../data/chatbot'

let msgId = 0
const newId = () => `m${Date.now()}-${msgId++}`

export default function SwarmChatButton() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ id: newId(), from: 'bot', text: CHAT_WELCOME }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, typing, open])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  function send(text) {
    const trimmed = text.trim()
    if (!trimmed) return
    setMessages((prev) => [...prev, { id: newId(), from: 'user', text: trimmed }])
    setInput('')
    setTyping(true)
    // Auto-reply, drawn from the site's own content.
    timerRef.current = setTimeout(() => {
      const reply = getBotReply(trimmed)
      setMessages((prev) => [...prev, { id: newId(), from: 'bot', text: reply }])
      setTyping(false)
    }, 600)
  }

  function handleSubmit(e) {
    e.preventDefault()
    send(input)
  }

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label="Live Chat"
          className="fixed bottom-[88px] right-4 sm:bottom-24 sm:right-6 z-[60] w-[min(360px,calc(100vw-2rem))] bg-paper border-2 border-ink rounded-sm shadow-[6px_6px_0_0_rgba(35,35,35,0.85)] flex flex-col overflow-hidden"
        >
          {/* header */}
          <div className="flex items-center justify-between gap-2 bg-ink text-paper px-4 py-3">
            <div className="flex items-center gap-2">
              <span
                className="lens-pulse w-2 h-2 rounded-full bg-green"
                style={{ boxShadow: '0 0 7px rgba(19,136,8,0.95)' }}
              />
              <div className="leading-tight">
                <div className="condensed text-xs font-bold tracking-[0.16em] uppercase">CMB Assistant</div>
                <div className="text-[0.6rem] text-paper/55">Auto-reply · online</div>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="text-paper/60 hover:text-paper transition"
            >
              <CloseIcon size={16} />
            </button>
          </div>

          {/* tiranga strip */}
          <div aria-hidden="true" className="tiranga-strip h-[3px]" />

          {/* messages */}
          <div ref={scrollRef} className="flex-1 max-h-80 overflow-y-auto px-3 py-4 space-y-3 bg-paper-soft/50">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[82%] text-sm leading-relaxed px-3 py-2 rounded-lg ${
                    m.from === 'user'
                      ? 'bg-green text-paper rounded-br-sm'
                      : 'bg-paper border border-ink/15 text-ink/90 rounded-bl-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="bg-paper border border-ink/15 rounded-lg rounded-bl-sm px-3 py-2.5 inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-ink/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-ink/40 animate-bounce" style={{ animationDelay: '120ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-ink/40 animate-bounce" style={{ animationDelay: '240ms' }} />
                </div>
              </div>
            )}

            {/* quick suggestions — only before the user has asked anything */}
            {messages.length === 1 && !typing && (
              <div className="flex flex-wrap gap-2 pt-1">
                {CHAT_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="condensed text-[0.7rem] font-semibold tracking-wider border border-ink/25 rounded-full px-3 py-1.5 text-ink/75 hover:border-gold hover:text-gold-ink transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* input */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-ink/15 p-2.5 bg-paper">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              aria-label="Type your message"
              className="flex-1 bg-paper-soft border-2 border-ink/20 rounded-sm px-3 py-2 text-sm focus:border-green focus:outline-none focus:ring-2 focus:ring-green/40 transition"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="condensed text-xs font-bold tracking-wider bg-green text-paper px-4 py-2.5 rounded-sm hover:bg-green-ink transition shrink-0"
            >
              SEND
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        aria-label="Open chat"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="btn-tiranga-ring fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60] inline-flex items-center gap-2 px-3 py-3 sm:px-4 sm:py-3.5 text-paper rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.45)] transition min-h-[52px] min-w-[52px]"
      >
        {open ? <CloseIcon size={18} /> : <MessageCircleIcon size={18} />}
        <span
          className="hidden sm:inline text-[0.72rem] sm:text-[0.75rem] font-bold tracking-[0.18em] uppercase"
          style={{ fontFamily: 'var(--font-condensed)' }}
        >
          Live Chat
        </span>
      </button>
    </>
  )
}
