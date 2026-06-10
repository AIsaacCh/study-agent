import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  SquaresFour, HardDrive, Envelope, CalendarBlank,
  Chat, BookOpen, NotePencil, MagnifyingGlass,
  List, Circle,
} from '@phosphor-icons/react'
import { YoutubeLogo } from '@phosphor-icons/react'

const services = [
  { section: 'PRINCIPAL', items: [
    { to: '/', icon: SquaresFour, label: 'Dashboard' },
    { to: '/files', icon: HardDrive, label: 'Drive' },
    { to: '/emails', icon: Envelope, label: 'Gmail' },
    { to: '/calendar', icon: CalendarBlank, label: 'Calendar' },
    { to: '/classroom', icon: BookOpen, label: 'Classroom' },
    { to: '/notion', icon: NotePencil, label: 'Notion' },
    { to: '/youtube', icon: YoutubeLogo, label: 'YouTube' },
  ]},
  { section: 'AGENTE', items: [
    { to: '/chat', icon: Chat, label: 'Chat IA' },
  ]},
]

const statusItems = [
  { label: 'Gemini 2.5', status: 'ok' },
  { label: 'Drive API', status: 'ok' },
  { label: 'Elastic', status: 'ok' },
  { label: 'Notion', status: 'ok' },
]

export default function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <aside style={{
      width: open ? '180px' : '56px',
      minHeight: '100%',
      background: 'var(--sidebar-bg)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRight: '1px solid var(--glass-border)',
      padding: open ? '12px' : '12px 0',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      flexShrink: 0,
      transition: 'width 0.3s ease',
      overflow: 'hidden',
      alignItems: open ? 'flex-start' : 'center',
    }}>
      {/* Toggle */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '32px', height: '32px',
          borderRadius: '9px',
          background: 'rgba(255,255,255,0.55)',
          border: '1px solid rgba(255,255,255,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          marginBottom: '10px',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
        }}
      >
        <List size={16} color="var(--text-secondary)" />
      </button>

      {/* Logo */}
      <div style={{
        width: '32px', height: '32px', borderRadius: '9px',
        background: 'linear-gradient(135deg, #c8a060, #9a7040)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        marginBottom: '14px',
        boxShadow: '0 2px 8px rgba(160,110,50,0.3), inset 0 1px 0 rgba(255,220,160,0.4)',
      }}>
        <span style={{ fontSize: '16px' }}>📚</span>
      </div>

      {services.map(({ section, items }) => (
        <div key={section} style={{ width: '100%' }}>
          {open && (
            <p style={{
              fontSize: '9px', color: 'var(--text-muted)',
              letterSpacing: '1.5px', marginBottom: '4px',
              paddingLeft: '8px', fontWeight: '600',
            }}>
              {section}
            </p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {items.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: open ? '8px 10px' : '8px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  background: isActive ? 'var(--nav-active-bg)' : 'transparent',
                  border: isActive ? '1px solid var(--nav-active-border)' : '1px solid transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: isActive ? '600' : '400',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  justifyContent: open ? 'flex-start' : 'center',
                })}
              >
                {({ isActive }) => (
                  <>
                    <div style={{
                      width: '26px', height: '26px', borderRadius: '7px', flexShrink: 0,
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(200,160,80,0.4), rgba(160,120,50,0.3))'
                        : 'rgba(255,255,255,0.3)',
                      border: isActive
                        ? '1px solid rgba(200,160,80,0.5)'
                        : '1px solid rgba(255,255,255,0.5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)',
                    }}>
                      <Icon size={14} weight="duotone"
                        color={isActive ? '#9a7040' : 'var(--text-muted)'} />
                    </div>
                    {open && label}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      ))}

      {/* Status */}
      <div style={{
        marginTop: 'auto', width: '100%',
        paddingTop: '12px',
        borderTop: '1px solid var(--glass-dark-border)',
      }}>
        {open && (
          <p style={{
            fontSize: '9px', color: 'var(--text-muted)',
            letterSpacing: '1.5px', marginBottom: '6px',
            fontWeight: '600',
          }}>STATUS</p>
        )}
        {statusItems.map(({ label, status }) => (
          <div key={label} style={{
            display: 'flex', alignItems: 'center',
            gap: '6px', marginBottom: '4px',
            justifyContent: open ? 'flex-start' : 'center',
          }}>
            <div style={{
              width: '5px', height: '5px', borderRadius: '50%', flexShrink: 0,
              background: status === 'ok' ? '#8fbb70' : 'var(--accent-warn)',
              boxShadow: status === 'ok' ? '0 0 5px #8fbb70' : '0 0 5px var(--accent-warn)',
            }}/>
            {open && <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{label}</span>}
          </div>
        ))}
      </div>
    </aside>
  )
}

