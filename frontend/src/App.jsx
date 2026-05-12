import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Files from './pages/Files'
import Emails from './pages/Emails'
import Calendar from './pages/Calendar'
import Chat from './pages/Chat'
import Classroom from './pages/Classroom'
import Notion from './pages/Notion'
import { Sun, Moon } from '@phosphor-icons/react'
import './index.css'

export default function App() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <BrowserRouter>
      <div className="aero-bg" style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw',
        color: 'var(--text-primary)',
        overflow: 'hidden',
      }}>
        {/* Orb extra */}
        <div style={{
          position: 'absolute',
          width: '200px', height: '200px',
          borderRadius: '50%',
          background: 'var(--bg-orb3)',
          filter: 'blur(70px)',
          opacity: 0.25,
          top: '40%', right: '-30px',
          pointerEvents: 'none', zIndex: 0,
        }}/>

        {/* Desk line */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '30%',
          background: 'var(--desk-gradient)',
          pointerEvents: 'none', zIndex: 0,
        }}/>

        {/* Header */}
        <header className="glass" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          height: '52px',
          flexShrink: 0,
          zIndex: 10,
          borderRadius: 0,
          borderLeft: 'none',
          borderRight: 'none',
          borderTop: 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #c8a060, #9a7040)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(160,110,50,0.35), inset 0 1px 0 rgba(255,220,160,0.4)',
            }}>
              <span style={{ fontSize: '18px' }}>📚</span>
            </div>
            <span style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
              Study Agent
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: '#8fbb70',
                boxShadow: '0 0 6px #8fbb70',
              }}/>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Gemini 2.5 Flash</span>
            </div>

            <button
              onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
              className="glass-card"
              style={{
                borderRadius: '10px', padding: '7px 14px',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
                color: 'var(--text-secondary)', fontSize: '12px',
                border: '1px solid var(--glass-dark-border)',
              }}
            >
              {theme === 'light'
                ? <Moon size={14} weight="duotone" color="var(--accent-blue)"/>
                : <Sun size={14} weight="duotone" color="var(--accent-yellow)"/>
              }
              {theme === 'light' ? 'Oscuro' : 'Claro'}
            </button>
          </div>
        </header>

        {/* Body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative', zIndex: 1 }}>
          <Sidebar />
          <main style={{
            flex: 1, padding: '24px', overflowY: 'auto',
          }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/files" element={<Files />} />
              <Route path="/emails" element={<Emails />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/classroom" element={<Classroom />} />
              <Route path="/notion" element={<Notion />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}