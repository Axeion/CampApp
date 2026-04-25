import { T } from '../../theme'

interface Props {
  label: string
  sublabel?: string | null
  rightLabel?: string | null
  checked: boolean
  onToggle: () => void
}

export function CheckRow({ label, sublabel, rightLabel, checked, onToggle }: Props) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: 'flex', alignItems: 'center', padding: '12px 14px',
        borderBottom: `1px solid ${T.divider}`,
        background: checked ? 'rgba(74,140,92,0.07)' : 'transparent',
        cursor: 'pointer', userSelect: 'none',
      }}
    >
      <div style={{
        width: 24, height: 24, borderRadius: 5,
        border: `2px solid ${checked ? T.green : T.muted}`,
        background: checked ? T.green : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginRight: 12, transition: 'all 0.15s',
      }}>
        {checked && <span style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', lineHeight: 1 }}>✓</span>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, color: checked ? T.muted : T.text, textDecoration: checked ? 'line-through' : 'none', lineHeight: 1.3 }}>{label}</div>
        {sublabel && <div style={{ fontSize: 11, color: T.muted, marginTop: 3 }}>{sublabel}</div>}
      </div>
      {rightLabel && (
        <span style={{ fontSize: 12, color: T.accent, fontWeight: 'bold', marginLeft: 10, flexShrink: 0, fontStyle: 'italic' }}>{rightLabel}</span>
      )}
    </div>
  )
}
