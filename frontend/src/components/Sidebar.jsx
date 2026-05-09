import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FileText, Mail, Calendar, MessageCircle } from 'lucide-react'

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/files', icon: FileText, label: 'Archivos' },
  { to: '/emails', icon: Mail, label: 'Correos' },
  { to: '/calendar', icon: Calendar, label: 'Calendario' },
  { to: '/chat', icon: MessageCircle, label: 'Chat' },
]

export default function Sidebar() {
  return (
    <aside style={{
      width: '220px',
      minHeight: '100vh',
      background: '#1e1e2e',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      <h1 style={{ color: '#cdd6f4', fontSize: '18px', fontWeight: 700, marginBottom: '24px', paddingLeft: '8px' }}>
        📚 Study Agent
      </h1>
      {links.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 12px',
            borderRadius: '8px',
            textDecoration: 'none',
            color: isActive ? '#cdd6f4' : '#6c7086',
            background: isActive ? '#313244' : 'transparent',
            fontWeight: isActive ? 600 : 400,
            fontSize: '14px',
            transition: 'all 0.2s',
          })}
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </aside>
  )
}