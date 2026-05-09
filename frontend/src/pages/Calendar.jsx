import { useEffect, useState } from 'react'
import { getEvents } from '../services/api'
import { Calendar, Clock } from 'lucide-react'

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
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Calendario</h2>
      <p style={{ color: '#6c7086', marginBottom: '32px' }}>Próximos eventos</p>

      {loading ? (
        <p style={{ color: '#6c7086' }}>Cargando eventos...</p>
      ) : events.length === 0 ? (
        <div style={{ background: '#313244', borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
          <Calendar size={48} color="#6c7086" style={{ marginBottom: '16px' }} />
          <p style={{ color: '#6c7086' }}>No tienes eventos próximos</p>
        </div>
      ) : (
        <div style={{ background: '#313244', borderRadius: '12px', overflow: 'hidden' }}>
          {events.map((e, i) => (
            <div key={e.id} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '16px 20px',
              borderBottom: i < events.length - 1 ? '1px solid #45475a' : 'none',
            }}>
              <Calendar size={18} color="#10b981" style={{ marginTop: '2px' }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 4px' }}>{e.summary}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={12} color="#6c7086" />
                  <span style={{ fontSize: '12px', color: '#6c7086' }}>
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