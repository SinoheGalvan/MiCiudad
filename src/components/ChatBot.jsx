import { useState, useRef, useEffect } from 'react'
import { askGemini } from '../services/gemini'

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: '¡Hola! Soy Nautilus 🐚 ¿En qué puedo ayudarte hoy? Puedo recomendarte lugares, museos, cafés y más en Durango.',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)

    const response = await askGemini(userMsg, history)

    setHistory(prev => [
      ...prev,
      { role: 'user',  parts: [{ text: userMsg }] },
      { role: 'model', parts: [{ text: response }] },
    ])
    setMessages(prev => [...prev, { role: 'assistant', text: response }])
    setLoading(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <style>{`
        @keyframes chatOpen {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes dotPulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40%           { opacity: 1;   transform: scale(1); }
        }
        @keyframes badgePing {
          0%, 100% { opacity: 1;   transform: scale(1); }
          50%      { opacity: 0.6; transform: scale(1.4); }
        }
        .chat-open { animation: chatOpen 200ms ease-out forwards; }
        .dot-1 { animation: dotPulse 1.2s 0s   infinite; }
        .dot-2 { animation: dotPulse 1.2s 0.2s infinite; }
        .dot-3 { animation: dotPulse 1.2s 0.4s infinite; }
        .badge-ping { animation: badgePing 1.8s ease-in-out infinite; }
      `}</style>

      {/* Floating button */}
      {!isOpen && (
        <div className="fixed z-[1400]" style={{ bottom: 24, right: 24 }}>
          {/* Active badge */}
          <div
            className="badge-ping absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white"
            style={{ background: '#22c55e' }}
          />
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Abrir chat con Nautilus"
            className="w-14 h-14 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            style={{
              background: 'rgba(42,157,143,0.9)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(42,157,143,0.35), inset 0 1px 0 rgba(255,255,255,0.3)',
            }}
          >
            <ChatBubbleIcon />
          </button>
        </div>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div
          className="chat-open fixed z-[1400] flex flex-col overflow-hidden"
          style={{
            bottom: 0,
            right: 0,
            left: 0,
            height: '85vh',
            borderRadius: '24px 24px 0 0',
            background: 'rgba(255,255,255,0.25)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.5)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6)',
          }}
        >
          <DesktopStyles />

          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
            style={{
              background: 'rgba(42,157,143,0.85)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderBottom: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '24px 24px 0 0',
            }}
          >
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg flex-shrink-0">
              🤖
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                <p className="text-white font-bold text-sm leading-none">Nautilus</p>
              </div>
              <p className="text-white/80 text-xs mt-0.5">Asistente de MiCiudad</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar chat"
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors flex-shrink-0"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3" style={{ background: 'transparent' }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="max-w-[80%] px-4 py-2.5 text-sm leading-relaxed"
                  style={
                    msg.role === 'user'
                      ? {
                          background: 'rgba(42,157,143,0.85)',
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                          border: '1px solid rgba(42,157,143,0.3)',
                          boxShadow: '0 2px 8px rgba(42,157,143,0.2)',
                          color: 'white',
                          borderRadius: '18px 18px 4px 18px',
                        }
                      : {
                          background: 'rgba(255,255,255,0.55)',
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                          border: '1px solid rgba(255,255,255,0.7)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                          color: '#1a1a1a',
                          borderRadius: '18px 18px 18px 4px',
                        }
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex justify-start">
                <div
                  className="px-4 py-3 flex items-center gap-1.5"
                  style={{
                    background: 'rgba(255,255,255,0.55)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.7)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    borderRadius: '18px 18px 18px 4px',
                  }}
                >
                  <span className="dot-1 w-2 h-2 rounded-full bg-gray-400 inline-block" />
                  <span className="dot-2 w-2 h-2 rounded-full bg-gray-400 inline-block" />
                  <span className="dot-3 w-2 h-2 rounded-full bg-gray-400 inline-block" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div
            className="flex items-center gap-2 px-3 py-3 flex-shrink-0"
            style={{
              background: 'rgba(255,255,255,0.4)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderTop: '1px solid rgba(255,255,255,0.5)',
              borderRadius: '0 0 24px 24px',
            }}
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu pregunta..."
              disabled={loading}
              className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400 px-4 py-2"
              style={{
                background: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.8)',
                borderRadius: '999px',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              aria-label="Enviar mensaje"
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
              style={{
                background: input.trim() && !loading ? '#2A9D8F' : '#d1d5db',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              }}
            >
              <SendIcon />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

// Injects a <style> tag that upgrades the panel to desktop size at sm breakpoint.
// Using a style tag avoids needing Tailwind config changes.
function DesktopStyles() {
  return (
    <style>{`
      @media (min-width: 640px) {
        .chat-open {
          bottom: 24px !important;
          right: 24px !important;
          left: auto !important;
          width: 360px !important;
          height: 520px !important;
          border-radius: 24px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6) !important;
        }
      }
    `}</style>
  )
}

function ChatBubbleIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}
