import { useState, useEffect } from 'react'

export function useScrollProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const handler = () => {
      const el = document.documentElement
      setPct((window.scrollY / (el.scrollHeight - el.clientHeight)) * 100)
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return pct
}
