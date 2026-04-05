import { useEffect, useRef } from 'react'
import { lerp } from '@/utils'

export default function Cursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const pos     = useRef({ x: -200, y: -200 })
  const rPos    = useRef({ x: -200, y: -200 })

  useEffect(() => {
    let raf

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px'
        dotRef.current.style.top  = e.clientY + 'px'
      }
    }

    const tick = () => {
      rPos.current.x = lerp(rPos.current.x, pos.current.x, 0.1)
      rPos.current.y = lerp(rPos.current.y, pos.current.y, 0.1)
      if (ringRef.current) {
        ringRef.current.style.left = rPos.current.x + 'px'
        ringRef.current.style.top  = rPos.current.y + 'px'
      }
      raf = requestAnimationFrame(tick)
    }
    tick()

    const onOver = (e) => {
      const el = e.target.closest('a, button, [data-hover]')
      if (!ringRef.current) return
      if (el) {
        ringRef.current.style.width       = '52px'
        ringRef.current.style.height      = '52px'
        ringRef.current.style.borderColor = 'var(--amber)'
        ringRef.current.style.background  = 'rgba(245,158,11,0.07)'
      } else {
        ringRef.current.style.width       = '34px'
        ringRef.current.style.height      = '34px'
        ringRef.current.style.borderColor = 'rgba(245,158,11,0.35)'
        ringRef.current.style.background  = 'transparent'
      }
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} style={{
        position: 'fixed', width: 6, height: 6,
        background: 'var(--amber)', borderRadius: '50%',
        pointerEvents: 'none', zIndex: 9999,
        transform: 'translate(-50%, -50%)',
        boxShadow: '0 0 8px var(--amber)',
      }} />
      <div ref={ringRef} style={{
        position: 'fixed', width: 34, height: 34,
        border: '1.5px solid rgba(245,158,11,0.35)', borderRadius: '50%',
        pointerEvents: 'none', zIndex: 9998,
        transform: 'translate(-50%, -50%)',
        transition: 'width 0.25s, height 0.25s, border-color 0.25s, background 0.25s',
      }} />
    </>
  )
}
