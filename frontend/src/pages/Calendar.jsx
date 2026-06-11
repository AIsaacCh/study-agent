import { useEffect, useState } from 'react'
import { getEvents } from '../services/api'
import { CalendarBlank, Clock, Plus, X } from '@phosphor-icons/react'
import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function CalendarPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newEvent, setNewEvent] = useState({ title: '', date: '', description: '' })
  const [creating, setCreating] = useState(false)

  const loadEvents = () => {
    setLoading(true)
    getEvents().then(r => {
      setEvents(r.data.events || [])
      setLoading(false)
    })
  }

  useEffect(() => { loadEvents() }, [])

  const createEvent = async () => {
    if (!newEvent.title || !newEvent.date) return
    setCreating(true)
    try {
      await axios.post(`${API_URL}/calendar/create`, newEvent)
      setShowForm(false)
      setNewEvent({ title: '', date: '', description: '' })
      loadEvents()
    } catch {
    } finally {
      setCreating(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: '700', color: 'var(--text-primary)' }}>Calendar</h2>
        <button onClick={() => setShowForm(f => !f)} style={{
          background: 'linear-gradient(135deg, rgba(200,160,80,0.4), rgba(160,120,50,0.3))',
          border: '1px solid rgba(200,160,80,0.5)',
          borderRadius: '10px', padding: '8px 14px',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
          color: 'var(--text-primary)', fontSize: '12px', fontWeight: '600',
        }}>
          {showForm ? <X size={14} weight="bold" /> : <Plus size={14} weight="bold" />}
          {showForm ? 'Cancelar' : 'Nuevo evento'}
        </button>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}>Próximos eventos</p>

      {showForm && (
        <div className="glass-card" style={{ borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '14px' }}>
            Crear nuevo evento
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              value={newEvent.title}
              onChange={e => setNewEvent(n => ({ ...n, title: e.target.value }))}
              placeholder="Título del evento"
              style={{
                borderRadius: '10px', padding: '10px 14px',
                background: 'rgba(255,255,255,0.4)',
                border: '1px solid var(--glass-dark-border)',
                color: 'var(--text-primary)', fontSize: '13px', outline: 'none',
              }}
            />
            <input
              type="date"
              value={newEvent.date}
              onChange={e => setNewEvent(n => ({ ...n, date: e.target.value }))}
              style={{
                borderRadius: '10px', padding: '10px 14px',
                background: 'rgba(255,255,255,0.4)',
                border: '1px solid var(--glass-dark-border)',
                color: 'var(--text-primary)', fontSize: '13px', outline: 'none',
              }}
            />
            <input
              value={newEvent.description}
              onChange={e => setNewEvent(n => ({ ...n, description: e.target.value }))}
              placeholder="Descripción (opcional)"
              style={{
                borderRadius: '10px', padding: '10px 14px',
                background: 'rgba(255,255,255,0.4)',
                border: '1px solid var(--glass-dark-border)',
                color: 'var(--text-primary)', fontSize: '13px', outline: 'none',
              }}
            />
            <button onClick={createEvent} disabled={creating} style={{
              background: 'linear-gradient(135deg, rgba(200,160,80,0.5), rgba(160,120,50,0.4))',
              border: '1px solid rgba(200,160,80,0.5)',
              borderRadius: '10px', padding: '10px',
              cursor: 'pointer', fontSize: '13px', fontWeight: '600',
              color: 'var(--text-primary)',
            }}>
              {creating ? 'Creando...' : 'Crear evento'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Cargando eventos...</p>
      ) : events.length === 0 ? (
        <div className="glass-card" style={{ borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
          <CalendarBlank size={48} weight="duotone" color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No tienes eventos próximos</p>
        </div>
      ) : (
        <div className="glass-card" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          {events.map((e, i) => (
            <div key={e.id} style={{
              display: 'flex', alignItems: 'flex-start', gap: '14px',
              padding: '16px 20px',
              borderBottom: i < events.length - 1 ? '1px solid var(--glass-dark-border)' : 'none',
            }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
                background: 'linear-gradient(135deg, rgba(200,160,80,0.3), rgba(160,120,50,0.2))',
                border: '1px solid rgba(200,160,80,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CalendarBlank size={18} weight="duotone" color="var(--accent-yellow)" />
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