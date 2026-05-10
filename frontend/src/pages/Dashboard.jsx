import { useEffect, useState } from 'react'
import { getFiles, getEmails, getEvents } from '../services/api'
import {
  HardDrive, Envelope, CalendarBlank, Chat,
  HardDrives, EnvelopeOpen, CalendarCheck,
  Cards, GraduationCap, NotePencil, X, ArrowRight
} from '@phosphor-icons/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function GlassStatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="glass-card" style={{
      borderRadius: '16px', padding: '18px 20px',
      display: 'flex', alignItems: 'center', gap: '14px', flex: 1,
    }}>
      <div style={{
        width: '44px', height: '44px', borderRadius: '12px',
        background: `linear-gradient(135deg, ${color}40, ${color}20)`,
        border: `1px solid ${color}50`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 4px 12px ${color}20, inset 0 1px 0 rgba(255,255,255,0.5)`,
        flexShrink: 0,
      }}>
        <Icon size={20} weight="duotone" color={color} />
      </div>
      <div>
        <p style={{ fontSize: '26px', fontWeight: '700', color: 'var(--text-primary)', margin: 0, lineHeight: 1 }}>{value}</p>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '3px 0 0' }}>{label}</p>
      </div>
    </div>
  )
}

const BUBBLES = [
  { id: 'drive',     Icon: HardDrives,    label: 'Drive',     sub: d => `${d.files?.length||0} archivos`,  angle: 310, rx: 42, ry: 36, size: 96, color: '#4db8a8' },
  { id: 'gmail',     Icon: EnvelopeOpen,  label: 'Gmail',     sub: d => `${d.emails?.length||0} correos`,  angle: 50,  rx: 40, ry: 34, size: 84, color: '#3a9eb0' },
  { id: 'calendar',  Icon: CalendarCheck, label: 'Agenda',    sub: d => d.events?.length ? `${d.events.length} eventos` : 'Al día', angle: 148, rx: 41, ry: 35, size: 90, color: '#5bc8a0' },
  { id: 'fichas',    Icon: Cards,         label: 'Fichas',    sub: () => 'Crear fichas',                    angle: 230, rx: 38, ry: 33, size: 78, color: '#7aa8d0' },
  { id: 'classroom', Icon: GraduationCap, label: 'Classroom', sub: d => `${d.courses?.length||0} cursos`,  angle: 18,  rx: 44, ry: 37, size: 88, color: '#4db8a8' },
  { id: 'notion',    Icon: NotePencil,    label: 'Notion',    sub: d => `${d.pages?.length||0} páginas`,   angle: 195, rx: 43, ry: 36, size: 80, color: '#3a9eb0' },
]

const ROUTES = { drive: '/files', gmail: '/emails', calendar: '/calendar', fichas: '/files', classroom: '/classroom', notion: '/notion' }

function BubbleMenu({ bubble, data, onClose, navigate }) {
  const items = {
    drive:     (data.files||[]).slice(0,4).map(f => ({ label: f.name, detail: new Date(f.modifiedTime).toLocaleDateString('es-MX') })),
    gmail:     (data.emails||[]).slice(0,4).map(e => ({ label: e.subject, detail: e.from?.split('<')[0].trim() })),
    calendar:  (data.events||[]).slice(0,4).map(e => ({ label: e.summary, detail: e.start?.dateTime ? new Date(e.start.dateTime).toLocaleDateString('es-MX') : e.start?.date })),
    fichas:    [{ label: 'Selecciona un archivo en Drive', detail: 'y genera fichas automáticamente' }],
    classroom: (data.courses||[]).slice(0,4).map(c => ({ label: c.name, detail: c.section||c.subject||'' })),
    notion:    (data.pages||[]).slice(0,4).map(p => ({ label: p.title, detail: new Date(p.last_edited_time).toLocaleDateString('es-MX') })),
  }
  const { Icon, label, color } = bubble

  return (
    <div style={{
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '270px', zIndex: 50,
      background: 'var(--menu-bubble-bg)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: '1.5px solid rgba(255,255,255,0.9)',
      borderRadius: '22px',
      boxShadow: `0 12px 40px ${color}30, inset 0 1px 0 rgba(255,255,255,0.95)`,
      padding: '18px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: `linear-gradient(135deg, ${color}40, ${color}20)`,
            border: `1px solid ${color}60`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 8px ${color}20`,
          }}>
            <Icon size={18} weight="duotone" color={color} />
          </div>
          <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>{label}</span>
        </div>
        <button onClick={onClose} style={{ background: 'rgba(0,0,0,0.06)', border: 'none', cursor: 'pointer', padding: '5px', borderRadius: '8px', display: 'flex' }}>
          <X size={14} color="var(--text-muted)" />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '12px' }}>
        {!items[bubble.id]?.length ? (
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '8px' }}>Sin contenido disponible</p>
        ) : items[bubble.id].map((item, i) => (
          <div key={i} style={{
            padding: '8px 10px', borderRadius: '10px',
            background: 'rgba(255,255,255,0.55)',
            border: `1px solid ${color}20`,
          }}>
            <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</p>
            {item.detail && <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.detail}</p>}
          </div>
        ))}
      </div>

      <button onClick={() => { onClose(); navigate(ROUTES[bubble.id]) }} style={{
        width: '100%', padding: '9px',
        background: `linear-gradient(135deg, ${color}50, ${color}30)`,
        border: `1px solid ${color}60`,
        borderRadius: '11px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
        color: 'var(--text-primary)', fontSize: '12px', fontWeight: '600',
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.7)`,
      }}>
        Ver todo en {label} <ArrowRight size={13} weight="bold" />
      </button>
    </div>
  )
}

function Bubble3D({ b, index, data, isActive, onClick }) {
  const { Icon, label, sub, color, size } = b
  const rad = b.angle * Math.PI / 180
  const left = 50 + Math.cos(rad) * b.rx
  const top  = 50 + Math.sin(rad) * b.ry

  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute',
        left: `calc(${left}% - ${size/2}px)`,
        top:  `calc(${top}%  - ${size/2}px)`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        cursor: 'pointer',
        zIndex: isActive ? 20 : 5,
        animation: `floatB${index} ${3.6 + index * 0.35}s ease-in-out infinite`,
        transition: 'transform 0.25s',
      }}
    >
      {/* Capa exterior — reflejo superior */}
      {/* Capa exterior — reflejo superior */}
<div style={{
  position: 'absolute', inset: 0, borderRadius: '50%',
  background: isActive
    ? `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.9) 0%, ${color}70 40%, ${color}50 70%, rgba(255,255,255,0.1) 100%)`
    : `radial-gradient(circle at 35% 28%, rgba(255,255,255,0.85) 0%, ${color}45 35%, ${color}20 65%, rgba(200,240,255,0.1) 100%)`,
  border: isActive ? `2px solid ${color}90` : `1.5px solid rgba(255,255,255,0.6)`,
  boxShadow: isActive
    ? `0 8px 30px ${color}50, 0 2px 8px rgba(0,0,0,0.15), inset 0 -3px 8px ${color}30, inset 0 3px 10px rgba(255,255,255,0.6)`
    : `0 6px 20px ${color}30, 0 2px 6px rgba(0,0,0,0.1), inset 0 -2px 6px rgba(0,0,0,0.08), inset 0 3px 8px rgba(255,255,255,0.5)`,
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
}}/>
      {/* Reflejo pequeño superior izquierdo */}
      <div style={{
        position: 'absolute',
        top: '12%', left: '18%',
        width: '28%', height: '16%',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.55)',
        filter: 'blur(3px)',
        transform: 'rotate(-30deg)',
        pointerEvents: 'none',
      }}/>
      {/* Reflejo sutil inferior */}
      <div style={{
        position: 'absolute',
        bottom: '14%', right: '20%',
        width: '20%', height: '10%',
        borderRadius: '50%',
        background: `rgba(255,255,255,0.2)`,
        filter: 'blur(2px)',
        pointerEvents: 'none',
      }}/>
      {/* Contenido */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '2px',
      }}>
        <Icon size={size > 88 ? 22 : 18} weight="duotone" color={isActive ? '#fff' : color} />
        <span style={{ fontSize: size > 88 ? '10px' : '9px', fontWeight: '700', color: isActive ? '#fff' : '#1a5a6a', lineHeight: 1.1, textAlign: 'center', padding: '0 6px' }}>{label}</span>
        <span style={{ fontSize: '8px', color: isActive ? 'rgba(255,255,255,0.85)' : '#4a8a9a', lineHeight: 1.1, textAlign: 'center', padding: '0 4px' }}>{sub(data)}</span>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [data, setData] = useState({ files: [], emails: [], events: [], courses: [], pages: [] })
  const [activeBubble, setActiveBubble] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getFiles().then(r => setData(d => ({ ...d, files: r.data.files||[] })))
    getEmails().then(r => setData(d => ({ ...d, emails: r.data.emails||[] })))
    getEvents().then(r => setData(d => ({ ...d, events: r.data.events||[] })))
    axios.get('http://localhost:8000/classroom/courses').then(r => setData(d => ({ ...d, courses: r.data.courses||[] })))
    axios.get('http://localhost:8000/notion/pages').then(r => setData(d => ({ ...d, pages: r.data.pages||[] })))
  }, [])

  return (
    <div>
      <h2 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px', color: 'var(--text-primary)' }}>Dashboard</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '14px' }}>Bienvenido a tu asistente de estudio</p>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <GlassStatCard icon={HardDrive}     label="Archivos en Drive"  value={data.files.length}  color="#4db8a8" />
        <GlassStatCard icon={Envelope}      label="Correos recientes"  value={data.emails.length} color="#3a9eb0" />
        <GlassStatCard icon={CalendarBlank} label="Próximos eventos"   value={data.events.length} color="#5bc8a0" />
        <GlassStatCard icon={Chat}          label="Chat activo"        value="✓"                  color="#7aa8d0" />
      </div>

      {/* Centro de actividad */}
      <div style={{
        position: 'relative',
        height: '420px',
        borderRadius: '24px',
        background: 'var(--bubble-bg)',
        border: '1px solid rgba(255,255,255,0.75)',
        backdropFilter: 'blur(10px)',
        overflow: 'hidden',
      }}>
        {/* Orbs */}
        <div style={{ position:'absolute', width:'280px', height:'280px', borderRadius:'50%', background:'#7dd3c8', filter:'blur(70px)', opacity:0.22, top:'-80px', left:'-60px', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', width:'220px', height:'220px', borderRadius:'50%', background:'#a8d8ea', filter:'blur(60px)', opacity:0.2,  bottom:'-50px', right:'40px',  pointerEvents:'none' }}/>
        <div style={{ position:'absolute', width:'160px', height:'160px', borderRadius:'50%', background:'#b8e8d0', filter:'blur(50px)', opacity:0.18, top:'30%',    right:'-30px', pointerEvents:'none' }}/>

        {/* Líneas conectoras */}
        <svg style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', pointerEvents:'none' }}>
          {BUBBLES.map(b => {
            const rad = b.angle * Math.PI / 180
            const x2 = 50 + Math.cos(rad) * b.rx
            const y2 = 50 + Math.sin(rad) * b.ry
            return (
              <line key={b.id}
                x1="50%" y1="50%"
                x2={`${x2}%`} y2={`${y2}%`}
                stroke={`${b.color}30`}
                strokeWidth="1.2"
                strokeDasharray="5,5"
              />
            )
          })}
        </svg>

        {/* Hub central 3D */}
        <div style={{
          position: 'absolute', left:'50%', top:'50%',
          transform: 'translate(-50%, -50%)',
          width: '100px', height: '100px', borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 28%, rgba(255,255,255,0.9) 0%, rgba(77,184,168,0.7) 35%, rgba(58,158,176,0.5) 70%, rgba(100,200,220,0.15) 100%)',
          border: '2px solid rgba(255,255,255,0.85)',
          boxShadow: '0 10px 40px rgba(77,184,168,0.4), inset 0 -4px 10px rgba(58,158,176,0.3), inset 0 4px 12px rgba(255,255,255,0.75)',
          display: 'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          zIndex: 10,
          animation: 'pulseHub 2.5s ease-out infinite',
        }}>
          <div style={{ position:'absolute', top:'10%', left:'20%', width:'30%', height:'15%', borderRadius:'50%', background:'rgba(255,255,255,0.5)', filter:'blur(3px)', transform:'rotate(-25deg)', pointerEvents:'none' }}/>
          <Chat size={28} weight="duotone" color="white" />
          <span style={{ fontSize:'9px', fontWeight:'700', color:'white', marginTop:'3px', textShadow:'0 1px 4px rgba(0,0,0,0.2)' }}>Study Agent</span>
        </div>

        {/* Burbujas 3D */}
        {BUBBLES.map((b, i) => (
          <Bubble3D
            key={b.id}
            b={b}
            index={i}
            data={data}
            isActive={activeBubble?.id === b.id}
            onClick={() => setActiveBubble(activeBubble?.id === b.id ? null : b)}
          />
        ))}

        {/* Mini panel */}
        {activeBubble && (
          <BubbleMenu
            bubble={activeBubble}
            data={data}
            onClose={() => setActiveBubble(null)}
            navigate={navigate}
          />
        )}
      </div>

     <style>{`
  :root {
    --bubble-bg: linear-gradient(135deg, rgba(232,245,240,0.85), rgba(212,238,247,0.85), rgba(221,240,234,0.85));
  }
  [data-theme="dark"] {
    --bubble-bg: linear-gradient(135deg, rgba(10,30,28,0.85), rgba(10,25,35,0.85), rgba(10,28,25,0.85));
  }
    :root { --menu-bubble-bg: rgba(255,255,255,0.72); }
[data-theme="dark"] { --menu-bubble-bg: rgba(10,30,35,0.85); }
  @keyframes floatB0{0%,100%{transform:translate(0,0)}50%{transform:translate(5px,-10px)}}
  @keyframes floatB1{0%,100%{transform:translate(0,0)}50%{transform:translate(-7px,6px)}}
  @keyframes floatB2{0%,100%{transform:translate(0,0)}50%{transform:translate(6px,7px)}}
  @keyframes floatB3{0%,100%{transform:translate(0,0)}50%{transform:translate(-5px,-8px)}}
  @keyframes floatB4{0%,100%{transform:translate(0,0)}50%{transform:translate(7px,-5px)}}
  @keyframes floatB5{0%,100%{transform:translate(0,0)}50%{transform:translate(-6px,7px)}}
  @keyframes pulseHub{0%{box-shadow:0 0 0 0 rgba(77,184,168,0.5),0 10px 40px rgba(77,184,168,0.4),inset 0 -4px 10px rgba(58,158,176,0.3),inset 0 4px 12px rgba(255,255,255,0.75)}70%{box-shadow:0 0 0 14px rgba(77,184,168,0),0 10px 40px rgba(77,184,168,0.4),inset 0 -4px 10px rgba(58,158,176,0.3),inset 0 4px 12px rgba(255,255,255,0.75)}100%{box-shadow:0 0 0 0 rgba(77,184,168,0),0 10px 40px rgba(77,184,168,0.4),inset 0 -4px 10px rgba(58,158,176,0.3),inset 0 4px 12px rgba(255,255,255,0.75)}}
`}</style>
    </div>
  )
}