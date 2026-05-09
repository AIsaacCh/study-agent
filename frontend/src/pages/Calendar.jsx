import { useEffect, useState } from 'react'
import { getEvents } from '../services/api'
import { CalendarBlank, Clock } from '@phosphor-icons/react'

export default function CalendarPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEvents().then(r => {
      setEvents(r.data.events || [])
      setLoading(false)
    })
  }, [])

  return (
    <div>
      <h2 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px', color: 'var(--text-primary)' }}>
        Calendar
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', fontSize: '14px' }}>
        Próximos eventos
      </p>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Cargando eventos...</p>
      ) : events.length === 0 ? (
        <div className="glass-card" style={{ borderRadius: '16px', padding: '48px', textAlign: 'center' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '18px',
            background: 'linear-gradient(135deg, rgba(91,200,160,0.3), rgba(77,184,168,0.2))',
            border: '1px solid rgba(91,200,160,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <CalendarBlank size={28} weight="duotone" color="var(--accent-green)" />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No tienes eventos próximos</p>
        </div>
      ) : (
        <div className="glass-card" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          {events.map((e, i) => (
            <div key={e.id} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
              padding: '16px 20px',
              borderBottom: i < events.length - 1 ? '1px solid var(--glass-dark-border)' : 'none',
            }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(91,200,160,0.3), rgba(77,184,168,0.2))',
                border: '1px solid rgba(91,200,160,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <CalendarBlank size={18} weight="duotone" color="var(--accent-green)" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 4px' }}>
                  {e.summary}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={12} color="var(--text-muted)" />
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {e.start?.dateTime
                      ? new Date(e.start.dateTime).toLocaleString('es-MX')
                      : e.start?.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}