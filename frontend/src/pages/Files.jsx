import { useEffect, useState } from 'react'
import { getFiles } from '../services/api'
import { FileText, FileArchive, File, FolderOpen } from 'lucide-react'

function getIcon(mimeType) {
  if (mimeType === 'application/pdf') return <FileText size={18} color="#f87171" />
  if (mimeType === 'application/zip') return <FileArchive size={18} color="#fbbf24" />
  if (mimeType.includes('folder')) return <FolderOpen size={18} color="#60a5fa" />
  return <File size={18} color="#a78bfa" />
}

export default function Files() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFiles().then(r => {
      setFiles(r.data.files || [])
      setLoading(false)
    })
  }, [])

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Archivos</h2>
      <p style={{ color: '#6c7086', marginBottom: '32px' }}>Tus archivos de Google Drive</p>

      {loading ? (
        <p style={{ color: '#6c7086' }}>Cargando archivos...</p>
      ) : (
        <div style={{ background: '#313244', borderRadius: '12px', overflow: 'hidden' }}>
          {files.map((f, i) => (
            <div key={f.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 20px',
              borderBottom: i < files.length - 1 ? '1px solid #45475a' : 'none',
              transition: 'background 0.2s',
            }}>
              {getIcon(f.mimeType)}
              <span style={{ fontSize: '14px', flex: 1 }}>{f.name}</span>
              <span style={{ fontSize: '12px', color: '#6c7086' }}>
                {new Date(f.modifiedTime).toLocaleDateString('es-MX')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}