import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Files from './pages/Files'
import Emails from './pages/Emails'
import Calendar from './pages/Calendar'
import Chat from './pages/Chat'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#1a1a2e' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '32px', color: '#cdd6f4' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/files" element={<Files />} />
            <Route path="/emails" element={<Emails />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}