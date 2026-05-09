import { useState } from 'react'
import { Send } from 'lucide-react'
import axios from 'axios'

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'agent', text: '¡Hola! Soy tu asistente de estudio. Puedo ayudarte a resumir archivos, crear fichas y organizar tu agenda. ¿En qué te ayudo?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!input.trim() || loading) return
    const userMessage = input
    setMessages(prev => [...prev, { role: 'user', text: userMessage }])
    setInput('')
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:8000/chat', {
        message: userMessage
      })
      setMessages(prev => [...prev, {
        role: 'agent',
        text: response.data.response
      }])
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'agent',
        text: 'Error al conectar con el agente. Intenta de nuevo.'
      }])
    } finally {
      setLoading(false)
    }
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
              whiteSpace: 'pre-wrap',
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '12px 16px',
              borderRadius: '12px',
              background: '#45475a',
              fontSize: '14px',
              color: '#6c7086',
            }}>
              Pensando...
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Escribe tu mensaje..."
          disabled={loading}
          style={{
            flex: 1,
            background: '#313244',
            border: '1px solid #45475a',
            borderRadius: '10px',
            padding: '12px 16px',
            color: '#cdd6f4',
            fontSize: '14px',
            outline: 'none',
            opacity: loading ? 0.7 : 1,
          }}
        />
        <button onClick={send} disabled={loading} style={{
          background: loading ? '#45475a' : '#7c3aed',
          border: 'none',
          borderRadius: '10px',
          padding: '12px 16px',
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          transition: 'background 0.2s',
        }}>
          <Send size={18} color="#fff" />
        </button>
      </div>
    </div>
  )
}