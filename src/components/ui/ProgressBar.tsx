import { T } from '../../theme'

export function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total ? Math.round((done / total) * 100) : 0
  return (
    <div style={{ padding: '10px 12px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, height: 4, background: T.cardBorder, borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: pct + '%', height: '100%', background: T.green, borderRadius: 2, transition: 'width 0.3s' }} />
      </div>
      <span style={{ fontSize: 12, color: T.muted, flexShrink: 0 }}>{done}/{total}</span>
    </div>
  )
}
