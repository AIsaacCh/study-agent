import { useEffect, useState } from 'react'
import { getFiles } from '../services/api'
import { FileText, FileArchive, File, FolderOpen, BookOpen, Layers } from 'lucide-react'
import axios from 'axios'

function getIcon(mimeType) {
  if (mimeType === 'application/pdf') return <FileText size={18} color="#f87171" />
  if (mimeType === 'application/zip') return <FileArchive size={18} color="#fbbf24" />
  if (mimeType.includes('folder')) return <FolderOpen size={18} color="#60a5fa" />
  return <File size={18} color="#a78bfa" />
}

export default function Files() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState(null)
  const [resultTitle, setResultTitle] = useState('')
  const [processing, setProcessing] = useState(null)

  useEffect(() => {
    getFiles().then(r => {
      setFiles(r.data.files || [])
      setLoading(false)
    })
  }, [])

  const handleSummarize = async (file) => {
    setProcessing(file.id)
    setResult(null)
    try {
      const r = await axios.post('http://localhost:8000/drive/summarize', {
        file_id: file.id,
        mime_type: file.mimeType
      })
      setResultTitle(`Resumen: ${file.name}`)
      setResult(r.data.summary || r.data.error)
    } catch (e) {
      setResult('Error al procesar el archivo')
    } finally {
      setProcessing(null)
    }
  }

  const handleFlashcards = async (file) => {
    setProcessing(file.id)
    setResult(null)
    try {
      const r = await axios.post('http://localhost:8000/drive/flashcards', {
        file_id: file.id,
        mime_type: file.mimeType
      })
      setResultTitle(`Fichas: ${file.name}`)
      setResult(r.data.flashcards || r.data.error)
    } catch (e) {
      setResult('Error al procesar el archivo')
    } finally {
      setProcessing(null)
    }
  }

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Archivos</h2>
      <p style={{ color: '#6c7086', marginBottom: '32px' }}>Tus archivos de Google Drive</p>

      {loading ? (
        <p style={{ color: '#6c7086' }}>Cargando archivos...</p>
      ) : (
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {/* Lista de archivos */}
          <div style={{ flex: 1, minWidth: '300px', background: '#313244', borderRadius: '12px', overflow: 'hidden' }}>
            {files.map((f, i) => (
              <div key={f.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 20px',
                borderBottom: i < files.length - 1 ? '1px solid #45475a' : 'none',
              }}>
                {getIcon(f.mimeType)}
                <span style={{ fontSize: '13px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {f.name}
                </span>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button
                    onClick={() => handleSummarize(f)}
                    disabled={processing === f.id || f.mimeType.includes('folder') || f.mimeType.includes('zip')}
                    style={{
                      background: '#7c3aed',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      color: '#fff',
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      opacity: processing === f.id ? 0.6 : 1,
                    }}
                  >
                    <BookOpen size={12} />
                    {processing === f.id ? '...' : 'Resumir'}
                  </button>
                  <button
                    onClick={() => handleFlashcards(f)}
                    disabled={processing === f.id || f.mimeType.includes('folder') || f.mimeType.includes('zip')}
                    style={{
                      background: '#0ea5e9',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      color: '#fff',
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      opacity: processing === f.id ? 0.6 : 1,
                    }}
                  >
                    <Layers size={12} />
                    Fichas
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Panel de resultado */}
          {result && (
            <div style={{
              flex: 1,
              minWidth: '300px',
              background: '#313244',
              borderRadius: '12px',
              padding: '20px',
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', color: '#a6e3a1' }}>
                {resultTitle}
              </h3>
              <p style={{ fontSize: '13px', lineHeight: '1.7', whiteSpace: 'pre-wrap', color: '#cdd6f4' }}>
                {result}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}