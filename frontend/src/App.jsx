import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Files from './pages/Files'
import Emails from './pages/Emails'
import Calendar from './pages/Calendar'
import Chat from './pages/Chat'
import Classroom from './pages/Classroom'
import { Sun, Moon } from '@phosphor-icons/react'
import './index.css'
import Notion from './pages/Notion'

export default function App() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

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
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'var(--bg-orb3)',
          filter: 'blur(60px)',
          opacity: 0.3,
          top: '40%',
          right: '-40px',
          pointerEvents: 'none',
          zIndex: 0,
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
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-blue))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(77,184,168,0.4)',
            }}>
              <span style={{ fontSize: '18px' }}>📚</span>
            </div>
            <span style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
              Study Agent
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '7px', height: '7px',
                borderRadius: '50%',
                background: 'var(--accent-green)',
                boxShadow: '0 0 6px var(--accent-green)',
              }}/>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Gemini 2.5 Flash
              </span>
            </div>

            <button
              onClick={toggleTheme}
              className="glass-card"
              style={{
                borderRadius: '10px',
                padding: '7px 14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--text-secondary)',
                fontSize: '12px',
                transition: 'all 0.2s',
              }}
            >
              {theme === 'light'
                ? <Moon size={14} weight="duotone" color="var(--accent-blue)"/>
                : <Sun size={14} weight="duotone" color="var(--accent-teal)"/>
              }
              {theme === 'light' ? 'Oscuro' : 'Claro'}
            </button>
          </div>
        </header>

        {/* Body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative', zIndex: 1 }}>
          <Sidebar />
          <main style={{
            flex: 1,
            padding: '24px',
            overflowY: 'auto',
          }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/files" element={<Files />} />
              <Route path="/emails" element={<Emails />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/classroom" element={<Classroom/>}/>
              <Route path="/notion" element={<Notion/>}/>
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}