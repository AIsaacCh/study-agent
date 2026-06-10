import { useState } from 'react'
import { MagnifyingGlass, YoutubeLogo, Play, X } from '@phosphor-icons/react'
import axios from 'axios'

export default function YouTube() {
  const [query, setQuery] = useState('')
  const [subject, setSubject] = useState('')
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)

  const search = async () => {
    if (!query.trim()) return
    setLoading(true)
    setVideos([])
    try {
      const r = await axios.post('http://localhost:8000/youtube/search', {
        query, subject
      })
      setVideos(r.data.videos || [])
    } catch {
      setVideos([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px', color: 'var(--text-primary)' }}>
        YouTube
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}>
        Busca videos educativos relacionados con tus materias
      </p>

      {/* Buscador */}
      <div className="glass-card" style={{ borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
            placeholder="¿Qué quieres aprender?"
            style={{
              flex: 2, borderRadius: '10px', padding: '10px 14px',
              background: 'rgba(255,255,255,0.4)',
              border: '1px solid var(--glass-dark-border)',
              color: 'var(--text-primary)', fontSize: '13px', outline: 'none',
            }}
          />
          <input
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="Materia (opcional)"
            style={{
              flex: 1, borderRadius: '10px', padding: '10px 14px',
              background: 'rgba(255,255,255,0.4)',
              border: '1px solid var(--glass-dark-border)',
              color: 'var(--text-primary)', fontSize: '13px', outline: 'none',
            }}
          />
          <button onClick={search} disabled={loading} style={{
            background: 'linear-gradient(135deg, rgba(200,160,80,0.5), rgba(160,120,50,0.4))',
            border: '1px solid rgba(200,160,80,0.5)',
            borderRadius: '10px', padding: '10px 18px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
            color: 'var(--text-primary)', fontSize: '13px', fontWeight: '600',
          }}>
            <MagnifyingGlass size={16} weight="duotone" />
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

        {/* Sugerencias rápidas */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['Sistemas de información', 'Programación', 'Cálculo', 'Inglés', 'Base de datos'].map(s => (
            <button key={s} onClick={() => { setQuery(s); }} style={{
              background: 'rgba(255,255,255,0.3)',
              border: '1px solid rgba(255,255,255,0.5)',
              borderRadius: '20px', padding: '4px 12px',
              cursor: 'pointer', fontSize: '11px', color: 'var(--text-secondary)',
            }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Modal de video */}
      {selected && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
        }} onClick={() => setSelected(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%', maxWidth: '800px',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--glass-border)',
            borderRadius: '20px', overflow: 'hidden',
          }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src={selected.embed_url}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allowFullScreen
              />
            </div>
            <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, marginRight: '12px' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 4px' }}>{selected.title}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>{selected.channel}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{
                background: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.5)',
                borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex',
              }}>
                <X size={16} color="var(--text-secondary)" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid de videos */}
      {loading ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Buscando videos...</p>
      ) : videos.length === 0 ? (
        <div className="glass-card" style={{ borderRadius: '16px', padding: '48px', textAlign: 'center' }}>
          <YoutubeLogo size={48} weight="duotone" color="var(--text-muted)" style={{ marginBottom: '12px' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Busca un tema para encontrar videos educativos
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '14px',
        }}>
          {videos.map(v => (
            <div key={v.id} className="glass-card" style={{ borderRadius: '16px', overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => setSelected(v)}>
              <div style={{ position: 'relative' }}>
                <img src={v.thumbnail} alt={v.title} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0,0,0,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0, transition: 'opacity 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                  onMouseLeave={e => e.currentTarget.style.opacity = 0}
                >
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.9)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Play size={22} weight="fill" color="#c00" />
                  </div>
                </div>
              </div>
              <div style={{ padding: '12px' }}>
                <p style={{
                  fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)',
                  margin: '0 0 4px',
                  display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {v.title}
                </p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{v.channel}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}