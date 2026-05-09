import { useEffect, useState } from 'react'
import { getEmails } from '../services/api'
import { Mail } from 'lucide-react'

export default function Emails() {
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEmails().then(r => {
      setEmails(r.data.emails || [])
      setLoading(false)
    })
  }, [])

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Correos</h2>
      <p style={{ color: '#6c7086', marginBottom: '32px' }}>Bandeja de entrada reciente</p>

      {loading ? (
        <p style={{ color: '#6c7086' }}>Cargando correos...</p>
      ) : (
        <div style={{ background: '#313244', borderRadius: '12px', overflow: 'hidden' }}>
          {emails.map((e, i) => (
            <div key={e.id} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '16px 20px',
              borderBottom: i < emails.length - 1 ? '1px solid #45475a' : 'none',
            }}>
              <Mail size={18} color="#0ea5e9" style={{ marginTop: '2px' }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 4px' }}>{e.subject}</p>
                <p style={{ fontSize: '12px', color: '#6c7086', margin: 0 }}>{e.from}</p>
              </div>
              <span style={{ fontSize: '12px', color: '#6c7086', whiteSpace: 'nowrap' }}>
                {new Date(e.date).toLocaleDateString('es-MX')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}