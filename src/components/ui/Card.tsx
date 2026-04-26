import type { ReactNode } from 'react'
import { T } from '../../theme'

interface Props {
  children: ReactNode
  headerText: string
  headerColor?: string
  badge?: ReactNode
  collapsed?: boolean
  onHeaderClick?: () => void
}

export function Card({ children, headerText, headerColor, badge, collapsed, onHeaderClick }: Props) {
  return (
    <div style={{ background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: 8, margin: '10px 12px 0', overflow: 'hidden' }}>
      <div
        onClick={onHeaderClick}
        style={{
          background: headerColor ?? T.accentDim,
          padding: '9px 14px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          cursor: onHeaderClick ? 'pointer' : undefined,
          userSelect: 'none',
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{headerText}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {badge !== undefined && (
            <span style={{ fontSize: 11, background: 'rgba(0,0,0,0.3)', color: '#fff', padding: '2px 8px', borderRadius: 10 }}>{badge}</span>
          )}
          {onHeaderClick !== undefined && (
            <span style={{
              fontSize: 12, color: 'rgba(255,255,255,0.75)',
              transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
              display: 'inline-block', transition: 'transform 0.15s',
            }}>▾</span>
          )}
        </div>
      </div>
      {!collapsed && children}
    </div>
  )
}
