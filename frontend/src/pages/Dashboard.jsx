import { useEffect, useState } from 'react'
import { getFiles, getEmails, getEvents } from '../services/api'
import { HardDrive, Envelope, CalendarBlank, Chat, BookOpen, FilePdf, FileDoc, ArrowRight } from '@phosphor-icons/react'
import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
import { useNavigate } from 'react-router-dom'

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="glass-card" style={{ borderRadius: '14px', padding: '14px 16px' }}>
      <div style={{
        width: '36px', height: '36px', borderRadius: '10px',
        background: `${color}25`,
        border: `1px solid ${color}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '8px',
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.6)`,
      }}>
        <Icon size={18} weight="duotone" color={color} />
      </div>
      <p style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', margin: 0, lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '3px 0 0' }}>{label}</p>
    </div>
  )
}

function WidgetHeader({ title, to, navigate }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
      <p style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '1px' }}>{title}</p>
      {to && (
        <button onClick={() => navigate(to)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '10px', color: 'var(--text-muted)',
          display: 'flex', alignItems: 'center', gap: '3px',
        }}>
          Ver todo <ArrowRight size={10} weight="bold" />
        </button>
      )}
    </div>
  )
}

function FileItem({ file }) {
  const isPdf = file.mimeType === 'application/pdf'
  const isDoc = file.mimeType?.includes('document')
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '7px 9px', borderRadius: '9px',
      background: 'rgba(255,255,255,0.35)',
      border: '1px solid rgba(255,255,255,0.5)',
      marginBottom: '5px',
    }}>
      <div style={{
        width: '26px', height: '26px', borderRadius: '7px', flexShrink: 0,
        background: isPdf ? 'rgba(220,80,70,0.15)' : isDoc ? 'rgba(60,100,180,0.15)' : 'rgba(160,120,60,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {isPdf ? <FilePdf size={14} weight="duotone" color="#c05040" /> : <FileDoc size={14} weight="duotone" color="#3060a0" />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</p>
        <p style={{ fontSize: '9px', color: 'var(--text-muted)', margin: '1px 0 0' }}>{new Date(file.modifiedTime).toLocaleDateString('es-MX')}</p>
      </div>
    </div>
  )
}

function EmailItem({ email }) {
  return (
    <div style={{
      padding: '7px 9px', borderRadius: '9px',
      background: 'rgba(255,255,255,0.35)',
      border: '1px solid rgba(255,255,255,0.5)',
      marginBottom: '5px',
    }}>
      <p style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email.subject}</p>
      <p style={{ fontSize: '9px', color: 'var(--text-muted)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email.from?.split('<')[0].trim()}</p>
    </div>
  )
}

function CourseItem({ course }) {
  const colors = ['#e08040', '#5a8050', '#506080', '#9a6040', '#607050']
  const color = colors[Math.floor(Math.random() * colors.length)]
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '7px 9px', borderRadius: '9px',
      background: 'rgba(255,255,255,0.35)',
      border: '1px solid rgba(255,255,255,0.5)',
      marginBottom: '5px',
    }}>
      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.name}</p>
        <p style={{ fontSize: '9px', color: 'var(--text-muted)', margin: '1px 0 0' }}>{course.section || course.subject || 'Activo'}</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [data, setData] = useState({ files: [], emails: [], events: [], courses: [], indexed: [] })
  const [time, setTime] = useState(new Date())
  const navigate = useNavigate()

  useEffect(() => {
    getFiles().then(r => setData(d => ({ ...d, files: r.data.files || [] })))
    getEmails().then(r => setData(d => ({ ...d, emails: r.data.emails || [] })))
    getEvents().then(r => setData(d => ({ ...d, events: r.data.events || [] })))
    axios.get(`${API_URL}/classroom/courses`).then(r => setData(d => ({ ...d, courses: r.data.courses || [] })))
    axios.get(`${API_URL}/elastic/indexed`).then(r => setData(d => ({ ...d, indexed: r.data.documents || [] })))
    const timer = setInterval(() => setTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const h = time.getHours()
  const greeting = h < 12 ? '¡Buenos días' : h < 18 ? '¡Buenas tardes' : '¡Buenas noches'
  const timeStr = `${h % 12 || 12}:${String(time.getMinutes()).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
            {greeting}, Isaac!
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px' }}>
            Bienvenido a tu espacio de estudio
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="glass-card" style={{ borderRadius: '12px', padding: '8px 16px', textAlign: 'center' }}>
            <p style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>{timeStr}</p>
            <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px' }}>
              {time.toLocaleDateString('es-MX', { weekday: 'short', day: '2-digit', month: 'long' })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
        <StatCard icon={HardDrive}     label="Archivos Drive"  value={data.files.length}   color="#9a7040" />
        <StatCard icon={Envelope}      label="Correos nuevos"  value={data.emails.length}  color="#5a8050" />
        <StatCard icon={CalendarBlank} label="Eventos hoy"     value={data.events.length}  color="#506080" />
        <StatCard icon={BookOpen}      label="Cursos activos"  value={data.courses.length} color="#9a5040" />
      </div>

      {/* Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>

        {/* Archivos recientes */}
        <div className="glass-card" style={{ borderRadius: '16px', padding: '16px' }}>
          <WidgetHeader title="ARCHIVOS RECIENTES" to="/files" navigate={navigate} />
          {data.files.slice(0, 4).map(f => <FileItem key={f.id} file={f} />)}
        </div>

        {/* Gmail + Classroom */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="glass-card" style={{ borderRadius: '16px', padding: '16px', flex: 1 }}>
            <WidgetHeader title="CORREOS" to="/emails" navigate={navigate} />
            {data.emails.slice(0, 2).map(e => <EmailItem key={e.id} email={e} />)}
          </div>
          <div className="glass-card" style={{ borderRadius: '16px', padding: '16px', flex: 1 }}>
            <WidgetHeader title="CURSOS ACTIVOS" to="/classroom" navigate={navigate} />
            {data.courses.slice(0, 2).map(c => <CourseItem key={c.id} course={c} />)}
          </div>
        </div>

        {/* Chat + Elastic */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="glass-card" style={{ borderRadius: '16px', padding: '16px', flex: 1 }}>
            <WidgetHeader title="CHAT CON AGENTE" to="/chat" navigate={navigate} />
            <div style={{
              padding: '10px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.35)',
              border: '1px solid rgba(255,255,255,0.5)',
              fontSize: '12px', color: 'var(--text-secondary)',
              lineHeight: '1.5', marginBottom: '8px',
            }}>
              Puedo resumir archivos, crear fichas y buscar en tus documentos con Elastic.
            </div>
            <button onClick={() => navigate('/chat')} style={{
              width: '100%', padding: '8px',
              background: 'linear-gradient(135deg, rgba(200,160,80,0.35), rgba(160,120,50,0.25))',
              border: '1px solid rgba(200,160,80,0.4)',
              borderRadius: '10px', cursor: 'pointer',
              fontSize: '12px', fontWeight: '600',
              color: 'var(--text-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            }}>
              <Chat size={14} weight="duotone" color="var(--accent-yellow)" />
              Abrir chat
            </button>
          </div>

          <div className="glass-card" style={{ borderRadius: '16px', padding: '16px', flex: 1 }}>
            <WidgetHeader title="ELASTIC INDEXADOS" navigate={navigate} />
            {data.indexed.length === 0 ? (
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Sin documentos indexados aún</p>
            ) : data.indexed.slice(0, 3).map((doc, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '6px 9px', borderRadius: '9px',
                background: 'rgba(255,255,255,0.35)',
                border: '1px solid rgba(255,255,255,0.5)',
                marginBottom: '5px',
              }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#7090b0', flexShrink: 0 }} />
                <p style={{ fontSize: '11px', color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}