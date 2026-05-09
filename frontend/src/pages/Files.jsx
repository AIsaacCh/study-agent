import { useEffect, useState } from 'react'
import { getFiles } from '../services/api'
import { 
  FilePdf, 
  FileZip, 
  Folder, 
  FileDoc, 
  FileXls,
  File,
  BookOpen,
  Cards,
  ArrowLeft
} from '@phosphor-icons/react'
import axios from 'axios'

function getFileIcon(mimeType) {
  const iconProps = { size: 24, weight: 'duotone' }
  if (mimeType === 'application/pdf') return <FilePdf {...iconProps} color="#e85a4f" />
  if (mimeType === 'application/zip') return <FileZip {...iconProps} color="#f0a500" />
  if (mimeType.includes('folder')) return <Folder {...iconProps} color="#4db8a8" />
  if (mimeType.includes('document')) return <FileDoc {...iconProps} color="#3a9eb0" />
  if (mimeType.includes('spreadsheet')) return <FileXls {...iconProps} color="#5bc8a0" />
  return <File {...iconProps} color="#7aa8d0" />
}

function getFileColor(mimeType) {
  if (mimeType === 'application/pdf') return { from: 'rgba(232,90,79,0.25)', to: 'rgba(232,90,79,0.1)', border: 'rgba(232,90,79,0.3)' }
  if (mimeType === 'application/zip') return { from: 'rgba(240,165,0,0.25)', to: 'rgba(240,165,0,0.1)', border: 'rgba(240,165,0,0.3)' }
  if (mimeType.includes('folder')) return { from: 'rgba(77,184,168,0.25)', to: 'rgba(77,184,168,0.1)', border: 'rgba(77,184,168,0.3)' }
  if (mimeType.includes('document')) return { from: 'rgba(58,158,176,0.25)', to: 'rgba(58,158,176,0.1)', border: 'rgba(58,158,176,0.3)' }
  if (mimeType.includes('spreadsheet')) return { from: 'rgba(91,200,160,0.25)', to: 'rgba(91,200,160,0.1)', border: 'rgba(91,200,160,0.3)' }
  return { from: 'rgba(122,168,208,0.25)', to: 'rgba(122,168,208,0.1)', border: 'rgba(122,168,208,0.3)' }
}

function isProcessable(mimeType) {
  return (
    mimeType === 'application/pdf' ||
    mimeType.includes('document') ||
    mimeType.includes('spreadsheet') ||
    mimeType.includes('presentation')
  )
}

export default function Files() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState(null)
  const [resultTitle, setResultTitle] = useState('')
  const [resultType, setResultType] = useState('')
  const [processing, setProcessing] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    getFiles().then(r => {
      setFiles(r.data.files || [])
      setLoading(false)
    })
  }, [])

  const handleSummarize = async (file) => {
    setProcessing(file.id)
    setSelectedFile(file)
    setResult(null)
    try {
      const r = await axios.post('http://localhost:8000/drive/summarize', {
        file_id: file.id,
        mime_type: file.mimeType
      })
      setResultTitle(file.name)
      setResultType('Resumen')
      setResult(r.data.summary || r.data.error)
    } catch {
      setResult('Error al procesar el archivo')
    } finally {
      setProcessing(null)
    }
  }

  const handleFlashcards = async (file) => {
    setProcessing(file.id)
    setSelectedFile(file)
    setResult(null)
    try {
      const r = await axios.post('http://localhost:8000/drive/flashcards', {
        file_id: file.id,
        mime_type: file.mimeType
      })
      setResultTitle(file.name)
      setResultType('Fichas')
      setResult(r.data.flashcards || r.data.error)
    } catch {
      setResult('Error al procesar el archivo')
    } finally {
      setProcessing(null)
    }
  }

  return (
    <div>
      <h2 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px', color: 'var(--text-primary)' }}>
        Drive
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', fontSize: '14px' }}>
        Tu directorio de Google Drive
      </p>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Cargando archivos...</p>
      ) : result ? (
        /* Panel de resultado */
        <div>
          <button
            onClick={() => { setResult(null); setSelectedFile(null) }}
            className="glass-card"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 14px', borderRadius: '10px', cursor: 'pointer',
              color: 'var(--text-secondary)', fontSize: '13px',
              marginBottom: '16px', border: '1px solid var(--glass-dark-border)',
            }}
          >
            <ArrowLeft size={14} weight="bold" />
            Volver a archivos
          </button>

          <div style={{ display: 'flex', gap: '16px' }}>
            {/* Info del archivo */}
            <div className="glass-card" style={{
              borderRadius: '16px', padding: '20px',
              width: '200px', flexShrink: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '12px', textAlign: 'center',
            }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '16px',
                background: `linear-gradient(135deg, ${getFileColor(selectedFile.mimeType).from}, ${getFileColor(selectedFile.mimeType).to})`,
                border: `1px solid ${getFileColor(selectedFile.mimeType).border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {getFileIcon(selectedFile.mimeType)}
              </div>
              <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', wordBreak: 'break-word' }}>
                {selectedFile.name}
              </p>
              <span style={{
                fontSize: '10px', padding: '3px 10px', borderRadius: '6px',
                background: 'linear-gradient(135deg, rgba(77,184,168,0.3), rgba(58,158,176,0.2))',
                border: '1px solid rgba(77,184,168,0.3)',
                color: 'var(--accent-teal)', fontWeight: '600',
              }}>
                {resultType}
              </span>
            </div>

            {/* Resultado */}
            <div className="glass-card" style={{ borderRadius: '16px', padding: '24px', flex: 1 }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                {resultType}: {resultTitle}
              </h3>
              <p style={{ fontSize: '13px', lineHeight: '1.8', whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>
                {result}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Grid de archivos */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '14px',
        }}>
          {files.map(f => {
            const colors = getFileColor(f.mimeType)
            const processable = isProcessable(f.mimeType)
            const isProcessing = processing === f.id

            return (
              <div
                key={f.id}
                className="glass-card"
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                  opacity: isProcessing ? 0.7 : 1,
                }}
              >
                {/* Preview del archivo */}
                <div style={{
                  height: '80px',
                  background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
                  borderBottom: `1px solid ${colors.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {isProcessing ? (
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[0,1,2].map(i => (
                        <div key={i} style={{
                          width: '6px', height: '6px', borderRadius: '50%',
                          background: 'var(--accent-teal)',
                          animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                        }}/>
                      ))}
                    </div>
                  ) : (
                    getFileIcon(f.mimeType)
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: '10px 12px' }}>
                  <p style={{
                    fontSize: '11px', fontWeight: '600',
                    color: 'var(--text-primary)',
                    marginBottom: '4px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {f.name}
                  </p>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    {new Date(f.modifiedTime).toLocaleDateString('es-MX')}
                  </p>

                  {processable && (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => handleSummarize(f)}
                        disabled={isProcessing}
                        style={{
                          flex: 1,
                          background: 'linear-gradient(135deg, rgba(77,184,168,0.3), rgba(58,158,176,0.2))',
                          border: '1px solid rgba(77,184,168,0.4)',
                          borderRadius: '8px',
                          padding: '5px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          color: 'var(--accent-teal)',
                          fontSize: '10px',
                          fontWeight: '600',
                        }}
                      >
                        <BookOpen size={11} weight="duotone" />
                        Resumir
                      </button>
                      <button
                        onClick={() => handleFlashcards(f)}
                        disabled={isProcessing}
                        style={{
                          flex: 1,
                          background: 'linear-gradient(135deg, rgba(58,158,176,0.3), rgba(91,200,160,0.2))',
                          border: '1px solid rgba(58,158,176,0.4)',
                          borderRadius: '8px',
                          padding: '5px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          color: 'var(--accent-blue)',
                          fontSize: '10px',
                          fontWeight: '600',
                        }}
                      >
                        <Cards size={11} weight="duotone" />
                        Fichas
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}