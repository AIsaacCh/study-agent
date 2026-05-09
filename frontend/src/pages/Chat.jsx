import { useState } from 'react'
import { Send } from 'lucide-react'

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'agent', text: '¡Hola! Soy tu asistente de estudio. Puedo ayudarte a resumir archivos, crear fichas y organizar tu agenda. ¿En qué te ayudo?' }
  ])
  const [input, setInput] = useState('')

  const send = () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, { role: 'user', text: input }])
    setInput('')
    // Aquí conectaremos Gemini en la Fase siguiente
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'agent',
        text: 'Estoy procesando tu mensaje... (Gemini se conecta en la siguiente fase)'
      }])
    }, 800)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Chat</h2>
      <p style={{ color: '#6c7086', marginBottom: '24px' }}>Habla con tu asistente de estudio</p>

      <div style={{
        flex: 1,
        background: '#313244',
        borderRadius: '12px',
        padding: '20px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '16px',
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
          }}>
            <div style={{
              maxWidth: '70%',
              padding: '12px 16px',
              borderRadius: '12px',
              background: m.role === 'user' ? '#7c3aed' : '#45475a',
              fontSize: '14px',
              lineHeight: '1.5',
            }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Escribe tu mensaje..."
          style={{
            flex: 1,
            background: '#313244',
            border: '1px solid #45475a',
            borderRadius: '10px',
            padding: '12px 16px',
            color: '#cdd6f4',
            fontSize: '14px',
            outline: 'none',
          }}
        />
        <button onClick={send} style={{
          background: '#7c3aed',
          border: 'none',
          borderRadius: '10px',
          padding: '12px 16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
        }}>
          <Send size={18} color="#fff" />
        </button>
      </div>
    </div>
  )
}