import { useState } from 'react'
import { Github, Globe, ArrowUpRight, Star } from 'lucide-react'
import { useInView } from '@/hooks'

export default function ProjectCard({ project, index = 0 }) {
  const [ref, inView] = useInView(0.1)
  const [hovered, setHovered] = useState(false)

  return (
    <article ref={ref} className="project-card"
      style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(36px)', transition: `opacity 0.7s cubic-bezier(0.4,0,0.2,1) ${index * 0.15}s, transform 0.7s cubic-bezier(0.4,0,0.2,1) ${index * 0.15}s` }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>

      <div style={{ height: 200, background: project.gradient, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div className="project-card-overlay" />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 30% 50%, ${project.accent}20 0%, transparent 55%)`, animation: 'gradMove 8s ease infinite', backgroundSize: '200% 200%' }} />
        <div style={{ fontSize: 64, position: 'relative', zIndex: 1, transition: 'transform 0.4s', transform: hovered ? 'scale(1.12) translateY(-4px)' : 'scale(1)', filter: `drop-shadow(0 0 24px ${project.accent}66)` }}>
          {project.emoji}
        </div>
        {project.featured && (
          <div style={{ position: 'absolute', top: 14, left: 14, background: 'var(--amber)', color: '#000', borderRadius: 6, padding: '4px 12px', fontSize: 10, fontWeight: 800, fontFamily: 'var(--font-body)', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 5 }}>
            <Star size={9} fill="currentColor" /> FEATURED
          </div>
        )}
        <div style={{ position: 'absolute', bottom: 14, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', padding: '0 14px', opacity: hovered ? 1 : 0, transform: hovered ? 'translateY(0)' : 'translateY(8px)', transition: 'all 0.3s' }}>
          {project.metrics.map(m => (
            <span key={m} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500, padding: '4px 10px', borderRadius: 20, background: 'rgba(8,8,8,0.75)', backdropFilter: 'blur(8px)', border: `1px solid ${project.accent}40`, color: project.accent }}>{m}</span>
          ))}
        </div>
      </div>

      <div style={{ padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <h3 className="f-display" style={{ fontSize: 20, fontWeight: 700, marginBottom: 5 }}>{project.title}</h3>
            <div className="f-mono" style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: '0.1em' }}>{project.subtitle.toUpperCase()}</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 8, flexShrink: 0, background: `${project.accent}10`, border: `1px solid ${project.accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: project.accent, transform: hovered ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s' }}>
            <ArrowUpRight size={16} />
          </div>
        </div>
        <p style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.75, marginBottom: 20 }}>{project.description}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 24 }}>
          {project.tech.map(t => (
            <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 500, padding: '3px 9px', borderRadius: 4, background: `${project.accent}0d`, border: `1px solid ${project.accent}20`, color: project.accent, letterSpacing: '0.05em' }}>{t}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href={project.links.github} className="btn-ghost" style={{ flex: 1, justifyContent: 'center', padding: '9px 0', fontSize: 12, borderRadius: 8 }}><Github size={13} /> Code</a>
          <a href={project.links.live} className="btn-amber" style={{ flex: 1, justifyContent: 'center', padding: '9px 0', fontSize: 12, borderRadius: 8 }}><Globe size={13} /> Live</a>
        </div>
      </div>
    </article>
  )
}
