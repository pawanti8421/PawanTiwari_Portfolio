import { useState, useEffect } from 'react'

const LOAD_STEPS = [8, 15, 24, 36, 52, 68, 81, 92, 100]
const STATUS_LINES = [
  'Initializing environment...',
  'Loading portfolio assets...',
  'Compiling components...',
  'Optimizing bundle...',
  'Ready.',
]

export default function Loader({ onDone }) {
  const [pct, setPct]       = useState(0)
  const [reveal, setReveal] = useState(false)

  useEffect(() => {
    let i = 0
    const iv = setInterval(() => {
      if (i >= LOAD_STEPS.length) {
        clearInterval(iv)
        setReveal(true)
        setTimeout(onDone, 600)
        return
      }
      setPct(LOAD_STEPS[i++])
    }, 180)
    return () => clearInterval(iv)
  }, [onDone])

  const lineIdx = pct < 20 ? 0 : pct < 40 ? 1 : pct < 65 ? 2 : pct < 90 ? 3 : 4

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9500,
      background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 24,
      opacity: reveal ? 0 : 1,
      transition: 'opacity 0.5s ease',
    }}>
      <div className="f-display grad-text"
        style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-0.04em' }}>
        PT
      </div>
      <div style={{ width: 240 }}>
        <div style={{ height: 1, background: 'var(--border)', borderRadius: 1, overflow: 'hidden', marginBottom: 12 }}>
          <div style={{
            height: '100%', background: 'var(--amber)',
            width: `${pct}%`, transition: 'width 0.25s ease',
            borderRadius: 1, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              animation: 'shimmer 1.2s infinite',
            }} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text2)' }}>
          <span style={{ color: 'var(--emerald)' }}>{STATUS_LINES[lineIdx]}</span>
          <span>{pct}%</span>
        </div>
      </div>
    </div>
  )
}
