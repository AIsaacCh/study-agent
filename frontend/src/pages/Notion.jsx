import { useEffect, useState } from 'react'
import { NotePencil, ArrowLeft, BookOpen, Cards } from '@phosphor-icons/react'
import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function Notion() {
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [result, setResult] = useState(null)
  const [resultType, setResultType] = useState('')
  const [processing, setProcessing] = useState(null)

  useEffect(() => {
    axios.get(`${API_URL}/notion/pages`).then(r => {
      setPages(r.data.pages || [])
      setLoading(false)
    })
  }, [])

  const handleSummarize = async (page) => {
    setProcessing(page.id)
    setResult(null)
    try {
      const r = await axios.post(`${API_URL}/notion/page/summarize`, {
        page_id: page.id
      })
      setSelected(page)
      setResultType('Resumen')
      setResult(r.data.summary || r.data.error)
    } catch {
      setResult('Error al procesar la página')
    } finally {
      setProcessing(null)
    }
  }

  const handleFlashcards = async (page) => {
    setProcessing(page.id)
    setResult(null)
    try {
      const content = await axios.post(`${API_URL}/notion/page/content`, {
        page_id: page.id
      })
      const text = content.data.content
      if (!text) {
        setResult('La página no tiene contenido')
        setProcessing(null)
        return
      }
      const r = await axios.post(`${API_URL}/flashcards`, { text })
      setSelected(page)
      setResultType('Fichas')
      setResult(r.data.flashcards || r.data.error)
    } catch {
      setResult('Error al procesar la página')
    } finally {
      setProcessing(null)
    }
  }

  return (
    <div>
      <h2 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px', color: 'var(--text-primary)' }}>
        Notion
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', fontSize: '14px' }}>
        Tus páginas y notas de Notion
      </p>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Cargando páginas...</p>
      ) : result ? (
        <div>
          <button
            onClick={() => { setResult(null); setSelected(null) }}
            className="glass-card"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 14px', borderRadius: '10px', cursor: 'pointer',
              color: 'var(--text-secondary)', fontSize: '13px',
              marginBottom: '16px', border: '1px solid var(--glass-dark-border)',
            }}
          >
            <ArrowLeft size={14} weight="bold" />
            Volver a páginas
          </button>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="glass-card" style={{
              borderRadius: '16px', padding: '20px',
              width: '200px', flexShrink: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '12px', textAlign: 'center',
            }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(77,184,168,0.3), rgba(58,158,176,0.2))',
                border: '1px solid rgba(77,184,168,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <NotePencil size={28} weight="duotone" color="var(--accent-teal)" />
              </div>
              <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', wordBreak: 'break-word' }}>
                {selected?.title}
              </p>
              <span style={{
                fontSize: '10px', padding: '3px 10px', borderRadius: '6px',
                background: 'linear-gradient(135deg, rgba(77,184,168,0.3), rgba(58,158,176,0.2))',
                border: '1px solid rgba(77,184,168,0.3)',
                color: 'var(--accent-teal)', fontWeight: '600',
              }}>
                {resultType}
              </span>
            </div>

            <div className="glass-card" style={{ borderRadius: '16px', padding: '24px', flex: 1 }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                {resultType}: {selected?.title}
              </h3>
              <p style={{ fontSize: '13px', lineHeight: '1.8', whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>
                {result}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '14px',
        }}>
          {pages.length === 0 ? (
            <div className="glass-card" style={{ borderRadius: '16px', padding: '40px', textAlign: 'center', gridColumn: '1/-1' }}>
              <NotePencil size={40} weight="duotone" color="var(--text-muted)" style={{ marginBottom: '12px' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                No hay páginas disponibles. Asegúrate de compartir tus páginas con la integración en Notion.
              </p>
            </div>
          ) : pages.map(page => (
            <div key={page.id} className="glass-card" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{
                height: '70px',
                background: 'linear-gradient(135deg, rgba(77,184,168,0.25), rgba(58,158,176,0.15))',
                borderBottom: '1px solid rgba(77,184,168,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {processing === page.id ? (
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[0,1,2].map(i => (
                      <div key={i} style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: 'var(--accent-teal)',
                        animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }}/>
                    ))}
                  </div>
                ) : (
                  <NotePencil size={26} weight="duotone" color="var(--accent-teal)" />
                )}
              </div>
              <div style={{ padding: '10px 12px' }}>
                <p style={{
                  fontSize: '11px', fontWeight: '600',
                  color: 'var(--text-primary)', marginBottom: '4px',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {page.title}
                </p>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                  {new Date(page.last_edited_time).toLocaleDateString('es-MX')}
                </p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => handleSummarize(page)}
                    disabled={processing === page.id}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, rgba(77,184,168,0.3), rgba(58,158,176,0.2))',
                      border: '1px solid rgba(77,184,168,0.4)',
                      borderRadius: '8px', padding: '5px',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                      color: 'var(--accent-teal)', fontSize: '10px', fontWeight: '600',
                    }}
                  >
                    <BookOpen size={11} weight="duotone" />
                    Resumir
                  </button>
                  <button
                    onClick={() => handleFlashcards(page)}
                    disabled={processing === page.id}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, rgba(58,158,176,0.3), rgba(91,200,160,0.2))',
                      border: '1px solid rgba(58,158,176,0.4)',
                      borderRadius: '8px', padding: '5px',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                      color: 'var(--accent-blue)', fontSize: '10px', fontWeight: '600',
                    }}
                  >
                    <Cards size={11} weight="duotone" />
                    Fichas
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}