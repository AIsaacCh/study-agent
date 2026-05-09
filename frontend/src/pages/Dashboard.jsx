import { useEffect, useState } from 'react'
import { getFiles, getEmails, getEvents } from '../services/api'
import { FileText, Mail, Calendar, MessageCircle } from 'lucide-react'

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div style={{
      background: '#313244',
      borderRadius: '12px',
      padding: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flex: 1,
    }}>
      <div style={{
        background: color,
        borderRadius: '10px',
        padding: '12px',
        display: 'flex',
      }}>
        <Icon size={24} color="#fff" />
      </div>
      <div>
        <p style={{ fontSize: '28px', fontWeight: 700, color: '#cdd6f4', margin: 0 }}>{value}</p>
        <p style={{ fontSize: '13px', color: '#6c7086', margin: 0 }}>{label}</p>
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
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Dashboard</h2>
      <p style={{ color: '#6c7086', marginBottom: '32px' }}>Bienvenido a tu asistente de estudio</p>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <StatCard icon={FileText} label="Archivos en Drive" value={files.length} color="#7c3aed" />
        <StatCard icon={Mail} label="Correos recientes" value={emails.length} color="#0ea5e9" />
        <StatCard icon={Calendar} label="Próximos eventos" value={events.length} color="#10b981" />
        <StatCard icon={MessageCircle} label="Chat activo" value="✓" color="#f59e0b" />
      </div>

      <div style={{ background: '#313244', borderRadius: '12px', padding: '24px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>Archivos recientes</h3>
        {files.slice(0, 5).map(f => (
          <div key={f.id} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '10px 0', borderBottom: '1px solid #45475a'
          }}>
            <FileText size={16} color="#7c3aed" />
            <span style={{ fontSize: '14px' }}>{f.name}</span>
            <span style={{ fontSize: '12px', color: '#6c7086', marginLeft: 'auto' }}>
              {new Date(f.modifiedTime).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}