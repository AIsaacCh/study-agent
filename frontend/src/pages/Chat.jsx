import { useState, useRef, useEffect } from 'react'
import { PaperPlaneRight, Robot, User } from '@phosphor-icons/react'
import axios from 'axios'

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'agent', text: '¡Hola! Soy tu asistente de estudio. Puedo ayudarte a resumir archivos, crear fichas y organizar tu agenda. ¿En qué te ayudo?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMessage = input
    setMessages(prev => [...prev, { role: 'user', text: userMessage }])
    setInput('')
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:8000/chat', { message: userMessage })
      setMessages(prev => [...prev, { role: 'agent', text: response.data.response }])
    } catch {
      setMessages(prev => [...prev, { role: 'agent', text: 'Error al conectar con el agente.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
      <h2 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px', color: 'var(--text-primary)' }}>
        Chat IA
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '14px' }}>
        Habla con tu asistente de estudio
      </p>

      <div className="glass-card" style={{
        flex: 1,
        borderRadius: '16px',
        padding: '20px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        marginBottom: '14px',
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
            gap: '10px',
            alignItems: 'flex-start',
          }}>
            {m.role === 'agent' && (
              <div style={{
                width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
                background: 'linear-gradient(135deg, rgba(77,184,168,0.4), rgba(58,158,176,0.3))',
                border: '1px solid rgba(77,184,168,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Robot size={16} weight="duotone" color="var(--accent-teal)" />
              </div>
            )}
            <div style={{
              maxWidth: '70%',
              padding: '12px 16px',
              borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: m.role === 'user'
                ? 'linear-gradient(135deg, rgba(77,184,168,0.5), rgba(58,158,176,0.4))'
                : 'var(--glass-bg)',
              border: m.role === 'user'
                ? '1px solid rgba(77,184,168,0.5)'
                : '1px solid var(--glass-border)',
              backdropFilter: 'blur(8px)',
              fontSize: '13px',
              lineHeight: '1.6',
              color: 'var(--text-primary)',
              whiteSpace: 'pre-wrap',
              boxShadow: m.role === 'user'
                ? '0 2px 12px rgba(77,184,168,0.2)'
                : 'var(--glass-shadow)',
            }}>
              {m.text}
            </div>
            {m.role === 'user' && (
              <div style={{
                width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
                background: 'linear-gradient(135deg, rgba(58,158,176,0.4), rgba(91,200,160,0.3))',
                border: '1px solid rgba(58,158,176,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <User size={16} weight="duotone" color="var(--accent-blue)" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(77,184,168,0.4), rgba(58,158,176,0.3))',
              border: '1px solid rgba(77,184,168,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Robot size={16} weight="duotone" color="var(--accent-teal)" />
            </div>
            <div className="glass-card" style={{ padding: '12px 16px', borderRadius: '16px 16px 16px 4px' }}>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: 'var(--accent-teal)',
                    animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}/>
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Escribe tu mensaje..."
          disabled={loading}
          className="glass-card"
          style={{
            flex: 1,
            borderRadius: '14px',
            padding: '14px 18px',
            color: 'var(--text-primary)',
            fontSize: '13px',
            outline: 'none',
            opacity: loading ? 0.7 : 1,
          }}
        />
        <button
          onClick={send}
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-blue))',
            border: '1px solid rgba(77,184,168,0.5)',
            borderRadius: '14px',
            padding: '14px 18px',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(77,184,168,0.3)',
            opacity: loading ? 0.7 : 1,
            transition: 'all 0.2s',
          }}
        >
          <PaperPlaneRight size={18} weight="duotone" color="white" />
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}