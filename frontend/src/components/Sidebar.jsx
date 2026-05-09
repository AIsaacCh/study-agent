import { NavLink } from 'react-router-dom'
import {
  SquaresFour,
  HardDrive,
  Envelope,
  CalendarBlank,
  Chat,
  BookOpen,
  MusicNote,
  NotePencil,
  Circle,
} from '@phosphor-icons/react'

const services = [
  {
    section: 'GOOGLE',
    items: [
      { to: '/', icon: SquaresFour, label: 'Dashboard', active: true },
      { to: '/files', icon: HardDrive, label: 'Drive', active: true },
      { to: '/emails', icon: Envelope, label: 'Gmail', active: true },
      { to: '/calendar', icon: CalendarBlank, label: 'Calendar', active: true },
      { to: '/classroom', icon: BookOpen, label: 'Classroom', active: false },
    ],
  },
  {
    section: 'EXTERNO',
    items: [
      { to: '/notion', icon: NotePencil, label: 'Notion', active: false },
      { to: '/spotify', icon: MusicNote, label: 'Spotify', active: false },
    ],
  },
  {
    section: 'AGENTE',
    items: [
      { to: '/chat', icon: Chat, label: 'Chat IA', active: true },
    ],
  },
]

const statusItems = [
  { label: 'Gemini 2.5', status: 'ok' },
  { label: 'Drive API', status: 'ok' },
  { label: 'Gmail API', status: 'ok' },
  { label: 'Calendar', status: 'warn' },
]

function GlassIcon({ icon: Icon, isActive }) {
  return (
    <div style={{
      width: '28px',
      height: '28px',
      borderRadius: '8px',
      background: isActive
        ? 'linear-gradient(135deg, rgba(77,184,168,0.5), rgba(58,158,176,0.5))'
        : 'rgba(255,255,255,0.2)',
      border: isActive
        ? '1px solid rgba(77,184,168,0.6)'
        : '1px solid rgba(255,255,255,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      backdropFilter: 'blur(4px)',
      boxShadow: isActive
        ? '0 2px 8px rgba(77,184,168,0.3), inset 0 1px 0 rgba(255,255,255,0.5)'
        : 'inset 0 1px 0 rgba(255,255,255,0.3)',
      transition: 'all 0.2s',
    }}>
      <Icon
        size={15}
        weight="duotone"
        color={isActive ? '#1a6a6a' : 'var(--text-muted)'}
      />
    </div>
  )
}

export default function Sidebar() {
  return (
    <aside className="glass" style={{
      width: '200px',
      minHeight: '100%',
      padding: '16px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      flexShrink: 0,
      borderRadius: 0,
      borderLeft: 'none',
      borderTop: 'none',
      borderBottom: 'none',
    }}>
      {services.map(({ section, items }) => (
        <div key={section}>
          <p style={{
            fontSize: '9px',
            color: 'var(--text-muted)',
            letterSpacing: '1.5px',
            marginBottom: '6px',
            paddingLeft: '4px',
            fontWeight: '600',
          }}>
            {section}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {items.map(({ to, icon, label, active }) =>
              active ? (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '7px 10px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    background: isActive ? 'var(--nav-active-bg)' : 'transparent',
                    border: isActive ? '1px solid var(--nav-active-border)' : '1px solid transparent',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontSize: '13px',
                    fontWeight: isActive ? '600' : '400',
                    transition: 'all 0.2s',
                    boxShadow: isActive ? '0 2px 8px rgba(100,180,200,0.15)' : 'none',
                  })}
                >
                  {({ isActive }) => (
                    <>
                      <GlassIcon icon={icon} isActive={isActive} />
                      {label}
                      {isActive && (
                        <div style={{
                          marginLeft: 'auto',
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: 'var(--accent-teal)',
                          boxShadow: '0 0 6px var(--accent-teal)',
                        }}/>
                      )}
                    </>
                  )}
                </NavLink>
              ) : (
                <div
                  key={to}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '7px 10px',
                    borderRadius: '10px',
                    color: 'var(--text-muted)',
                    fontSize: '13px',
                    opacity: 0.5,
                    cursor: 'not-allowed',
                  }}
                >
                  <GlassIcon icon={icon} isActive={false} />
                  {label}
                  <span style={{
                    marginLeft: 'auto',
                    fontSize: '8px',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--glass-dark-border)',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    background: 'var(--glass-dark-bg)',
                  }}>
                    soon
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      ))}

      {/* Status */}
      <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--glass-dark-border)' }}>
        <p style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '1.5px', marginBottom: '8px', fontWeight: '600' }}>
          STATUS
        </p>
        {statusItems.map(({ label, status }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: status === 'ok' ? 'var(--accent-green)' : 'var(--accent-warn)',
              boxShadow: status === 'ok'
                ? '0 0 6px var(--accent-green)'
                : '0 0 6px var(--accent-warn)',
            }}/>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{label}</span>
          </div>
        ))}
      </div>
    </aside>
  )
}