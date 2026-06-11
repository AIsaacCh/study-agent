import { useEffect, useState } from 'react'
import { GraduationCap, BookOpen, ArrowLeft, Bell } from '@phosphor-icons/react'
import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function Classroom() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [work, setWork] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [loadingDetail, setLoadingDetail] = useState(false)

  useEffect(() => {
    axios.get(`${API_URL}/classroom/courses`).then(r => {
      setCourses(r.data.courses || [])
      setLoading(false)
    })
  }, [])

  const openCourse = async (course) => {
    setSelected(course)
    setLoadingDetail(true)
    try {
      const [w, a] = await Promise.all([
        axios.get(`${API_URL}/classroom/courses/${course.id}/work`),
        axios.get(`${API_URL}/classroom/courses/${course.id}/announcements`),
      ])
      setWork(w.data.coursework || [])
      setAnnouncements(a.data.announcements || [])
    } catch {
      setWork([])
      setAnnouncements([])
    } finally {
      setLoadingDetail(false)
    }
  }

  const colors = [
    { from: 'rgba(77,184,168,0.3)', to: 'rgba(58,158,176,0.2)', border: 'rgba(77,184,168,0.4)' },
    { from: 'rgba(58,158,176,0.3)', to: 'rgba(91,200,160,0.2)', border: 'rgba(58,158,176,0.4)' },
    { from: 'rgba(91,200,160,0.3)', to: 'rgba(77,184,168,0.2)', border: 'rgba(91,200,160,0.4)' },
    { from: 'rgba(122,168,208,0.3)', to: 'rgba(58,158,176,0.2)', border: 'rgba(122,168,208,0.4)' },
  ]

  return (
    <div>
      <h2 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px', color: 'var(--text-primary)' }}>
        Classroom
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', fontSize: '14px' }}>
        Tus cursos de Google Classroom
      </p>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Cargando cursos...</p>
      ) : selected ? (
        <div>
          <button
            onClick={() => { setSelected(null); setWork([]); setAnnouncements([]) }}
            className="glass-card"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 14px', borderRadius: '10px', cursor: 'pointer',
              color: 'var(--text-secondary)', fontSize: '13px',
              marginBottom: '16px', border: '1px solid var(--glass-dark-border)',
            }}
          >
            <ArrowLeft size={14} weight="bold" />
            Volver a cursos
          </button>

          <div className="glass-card" style={{ borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(77,184,168,0.4), rgba(58,158,176,0.3))',
                border: '1px solid rgba(77,184,168,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <GraduationCap size={24} weight="duotone" color="var(--accent-teal)" />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                  {selected.name}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                  {selected.section || selected.descriptionHeading || ''}
                </p>
              </div>
            </div>
          </div>

          {loadingDetail ? (
            <p style={{ color: 'var(--text-muted)' }}>Cargando contenido...</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Tareas */}
              <div className="glass-card" style={{ borderRadius: '16px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <BookOpen size={16} weight="duotone" color="var(--accent-teal)" />
                  <h4 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', margin: 0 }}>
                    Tareas ({work.length})
                  </h4>
                </div>
                {work.length === 0 ? (
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Sin tareas disponibles</p>
                ) : work.map((w, i) => (
                  <div key={w.id} style={{
                    padding: '10px 0',
                    borderBottom: i < work.length - 1 ? '1px solid var(--glass-dark-border)' : 'none',
                  }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 4px' }}>
                      {w.title}
                    </p>
                    {w.dueDate && (
                      <p style={{ fontSize: '11px', color: 'var(--accent-teal)', margin: 0 }}>
                        Entrega: {w.dueDate.day}/{w.dueDate.month}/{w.dueDate.year}
                      </p>
                    )}
                    {w.maxPoints && (
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                        {w.maxPoints} puntos
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Anuncios */}
              <div className="glass-card" style={{ borderRadius: '16px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <Bell size={16} weight="duotone" color="var(--accent-blue)" />
                  <h4 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', margin: 0 }}>
                    Anuncios ({announcements.length})
                  </h4>
                </div>
                {announcements.length === 0 ? (
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Sin anuncios recientes</p>
                ) : announcements.map((a, i) => (
                  <div key={a.id} style={{
                    padding: '10px 0',
                    borderBottom: i < announcements.length - 1 ? '1px solid var(--glass-dark-border)' : 'none',
                  }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-primary)', margin: '0 0 4px', lineHeight: '1.5' }}>
                      {a.text?.slice(0, 120)}{a.text?.length > 120 ? '...' : ''}
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
                      {new Date(a.creationTime).toLocaleDateString('es-MX')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '14px',
        }}>
          {courses.map((c, i) => {
            const color = colors[i % colors.length]
            return (
              <div
                key={c.id}
                className="glass-card"
                onClick={() => openCourse(c)}
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  height: '70px',
                  background: `linear-gradient(135deg, ${color.from}, ${color.to})`,
                  borderBottom: `1px solid ${color.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <GraduationCap size={28} weight="duotone" color="var(--accent-teal)" />
                </div>
                <div style={{ padding: '12px' }}>
                  <p style={{
                    fontSize: '12px', fontWeight: '700',
                    color: 'var(--text-primary)', margin: '0 0 4px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {c.name}
                  </p>
                  <p style={{
                    fontSize: '11px', color: 'var(--text-secondary)', margin: 0,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {c.section || c.subject || 'Ver curso →'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}