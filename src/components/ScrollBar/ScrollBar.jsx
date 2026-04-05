import { useScrollProgress } from '@/hooks'

export default function ScrollBar() {
  const pct = useScrollProgress()
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, zIndex: 1001,
      height: 2, width: `${pct}%`,
      background: 'linear-gradient(90deg, var(--amber), var(--emerald))',
      transition: 'width 0.08s linear',
      borderRadius: '0 1px 1px 0',
    }} />
  )
}
