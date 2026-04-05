import { useState, useEffect } from 'react'

export default function SkillBar({ item, color, inView, delay = 200 }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    if (!inView) return
    const t = setTimeout(() => setWidth(item.level), delay)
    return () => clearTimeout(t)
  }, [inView, item.level, delay])
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>{item.name}</span>
        <span className="f-mono" style={{ fontSize: 11, color, fontWeight: 600 }}>{item.level}%</span>
      </div>
      <div className="skill-track">
        <div className="skill-fill" style={{ width: `${width}%`, background: `linear-gradient(90deg, ${color}, ${color}aa)` }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)', animation: 'shimmer 2.5s infinite' }} />
        </div>
      </div>
    </div>
  )
}
