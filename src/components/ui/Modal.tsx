import type { ReactNode } from 'react'
import { T } from '../../theme'

export function Modal({ title, onClose, children }: {
  title: string
  onClose: () => void
  children: ReactNode
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.85)',
        zIndex: 100, overflowY: 'auto',
        padding: 16, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: T.card,
          border: `1px solid rgba(200,151,46,0.3)`,
          borderRadius: 10, padding: 20,
          width: '100%', maxWidth: 460, marginTop: 20,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{
            fontFamily: '\'Alegreya\', serif',
            fontSize: 16, fontWeight: 700, color: T.accent,
          }}>{title}</div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: T.muted, fontSize: 22, cursor: 'pointer', lineHeight: 1, padding: '0 0 0 12px' }}
          >×</button>
        </div>
        {children}
      </div>
    </div>
  )
}
