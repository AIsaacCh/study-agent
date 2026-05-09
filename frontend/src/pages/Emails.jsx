import { useEffect, useState } from 'react'
import { getEmails } from '../services/api'
import { Envelope, User } from '@phosphor-icons/react'

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
      <h2 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px', color: 'var(--text-primary)' }}>
        Gmail
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', fontSize: '14px' }}>
        Bandeja de entrada reciente
      </p>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Cargando correos...</p>
      ) : (
        <div className="glass-card" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          {emails.map((e, i) => (
            <div key={e.id} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
              padding: '16px 20px',
              borderBottom: i < emails.length - 1 ? '1px solid var(--glass-dark-border)' : 'none',
              transition: 'background 0.2s',
            }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(58,158,176,0.3), rgba(77,184,168,0.2))',
                border: '1px solid rgba(58,158,176,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <User size={18} weight="duotone" color="var(--accent-blue)" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {e.subject}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {e.from}
                </p>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                {new Date(e.date).toLocaleDateString('es-MX')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}