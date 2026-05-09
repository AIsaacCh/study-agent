import { useEffect, useState } from 'react'
import { getFiles, getEmails, getEvents } from '../services/api'
import { HardDrive, Envelope, CalendarBlank, Chat } from '@phosphor-icons/react'

function GlassStatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="glass-card" style={{
      borderRadius: '16px',
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flex: 1,
      transition: 'all 0.2s',
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '14px',
        background: `linear-gradient(135deg, ${color}40, ${color}25)`,
        border: `1px solid ${color}50`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 4px 12px ${color}20, inset 0 1px 0 rgba(255,255,255,0.4)`,
        backdropFilter: 'blur(4px)',
        flexShrink: 0,
      }}>
        <Icon size={22} weight="duotone" color={color} />
      </div>
      <div>
        <p style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', margin: 0, lineHeight: 1 }}>
          {value}
        </p>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
          {label}
        </p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [files, setFiles] = useState([])
  const [emails, setEmails] = useState([])
  const [events, setEvents] = useState([])

  useEffect(() => {
    getFiles().then(r => setFiles(r.data.files || []))
    getEmails().then(r => setEmails(r.data.emails || []))
    getEvents().then(r => setEvents(r.data.events || []))
  }, [])

  return (
    <div>
      <h2 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px', color: 'var(--text-primary)' }}>
        Dashboard
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', fontSize: '14px' }}>
        Bienvenido a tu asistente de estudio
      </p>

      <div style={{ display: 'flex', gap: '14px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <GlassStatCard icon={HardDrive} label="Archivos en Drive" value={files.length} color="#4db8a8" />
        <GlassStatCard icon={Envelope} label="Correos recientes" value={emails.length} color="#3a9eb0" />
        <GlassStatCard icon={CalendarBlank} label="Próximos eventos" value={events.length} color="#5bc8a0" />
        <GlassStatCard icon={Chat} label="Chat activo" value="✓" color="#7aa8d0" />
      </div>

      <div className="glass-card" style={{ borderRadius: '16px', padding: '20px 24px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>
          Archivos recientes
        </h3>
        {files.slice(0, 5).map((f, i) => (
          <div key={f.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 0',
            borderBottom: i < 4 ? '1px solid var(--glass-dark-border)' : 'none',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(77,184,168,0.3), rgba(58,158,176,0.2))',
              border: '1px solid rgba(77,184,168,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <HardDrive size={15} weight="duotone" color="var(--accent-teal)" />
            </div>
            <span style={{ fontSize: '13px', color: 'var(--text-primary)', flex: 1 }}>{f.name}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {new Date(f.modifiedTime).toLocaleDateString('es-MX')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}