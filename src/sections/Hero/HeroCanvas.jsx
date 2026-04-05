import { useEffect, useRef } from 'react'

export default function HeroCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W = 0, H = 0, raf
    const mouse = { x: 0, y: 0 }

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouseMove = (e) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
    }
    window.addEventListener('mousemove', onMouseMove)

    const rings = [
      { r: 180, speed: 0.0006,  nodes: 8,  size: 1.5, color: 'rgba(245,158,11,0.55)'  },
      { r: 290, speed: -0.0004, nodes: 12, size: 1.0, color: 'rgba(56,189,248,0.38)'  },
      { r: 400, speed: 0.0003,  nodes: 6,  size: 1.2, color: 'rgba(16,185,129,0.32)'  },
    ]

    const stars = Array.from({ length: 130 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.2 + 0.3,
      o: Math.random() * 0.4 + 0.1,
      speed: Math.random() * 0.0002 + 0.0001,
      phase: Math.random() * Math.PI * 2,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const t = performance.now() / 1000
      const cx = W / 2 + (mouse.x - W / 2) * 0.04
      const cy = H / 2 + (mouse.y - H / 2) * 0.04

      for (const s of stars) {
        const o = s.o * (0.7 + 0.3 * Math.sin(t * s.speed * 1000 + s.phase))
        ctx.beginPath()
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${o})`
        ctx.fill()
      }

      for (const ring of rings) {
        ctx.beginPath()
        ctx.arc(cx, cy, ring.r, 0, Math.PI * 2)
        ctx.strokeStyle = ring.color.replace(/[\d.]+\)$/, '0.07)')
        ctx.lineWidth = 1
        ctx.stroke()

        const baseAngle = t * ring.speed * 1000
        for (let n = 0; n < ring.nodes; n++) {
          const angle = baseAngle + (n / ring.nodes) * Math.PI * 2
          const nx = cx + Math.cos(angle) * ring.r
          const ny = cy + Math.sin(angle) * ring.r
          ctx.beginPath()
          ctx.arc(nx, ny, ring.size, 0, Math.PI * 2)
          ctx.fillStyle = ring.color
          ctx.fill()
          if (n % 3 === 0) {
            const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, 12)
            grad.addColorStop(0, ring.color.replace(/[\d.]+\)$/, '0.3)'))
            grad.addColorStop(1, 'transparent')
            ctx.beginPath()
            ctx.arc(nx, ny, 12, 0, Math.PI * 2)
            ctx.fillStyle = grad
            ctx.fill()
          }
        }
      }

      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 320)
      glow.addColorStop(0, 'rgba(245,158,11,0.04)')
      glow.addColorStop(0.5, 'rgba(245,158,11,0.02)')
      glow.addColorStop(1, 'transparent')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, W, H)

      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <canvas ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.75 }} />
  )
}
