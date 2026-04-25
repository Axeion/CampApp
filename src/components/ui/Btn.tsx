import type { ReactNode } from 'react'
import { T } from '../../theme'

export function Btn({ children, onClick, color, small }: {
  children: ReactNode
  onClick?: () => void
  color?: string
  small?: boolean
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: color ?? T.accentDim, color: '#fff', border: 'none',
        borderRadius: 6, padding: small ? '5px 12px' : '9px 16px',
        fontSize: small ? 12 : 13, fontFamily: 'Georgia, serif',
        cursor: 'pointer', fontWeight: 'bold',
      }}
    >{children}</button>
  )
}

export function GhostBtn({ children, onClick, color }: {
  children: ReactNode
  onClick?: () => void
  color?: string
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none', color: color ?? T.muted,
        border: `1px solid ${color ?? T.cardBorder}`, borderRadius: 5,
        padding: '4px 10px', fontSize: 12, fontFamily: 'Georgia, serif', cursor: 'pointer',
      }}
    >{children}</button>
  )
}
