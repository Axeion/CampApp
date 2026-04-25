import type { ReactNode } from 'react'
import { T } from '../../theme'

interface Props {
  children: ReactNode
  headerText: string
  headerColor?: string
  badge?: ReactNode
}

export function Card({ children, headerText, headerColor, badge }: Props) {
  return (
    <div style={{ background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: 8, margin: '10px 12px 0', overflow: 'hidden' }}>
      <div style={{ background: headerColor ?? T.accentDim, padding: '9px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{headerText}</span>
        {badge !== undefined && (
          <span style={{ fontSize: 11, background: 'rgba(0,0,0,0.3)', color: '#fff', padding: '2px 8px', borderRadius: 10 }}>{badge}</span>
        )}
      </div>
      {children}
    </div>
  )
}
