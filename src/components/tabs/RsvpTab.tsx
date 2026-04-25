import { T } from '../../theme'
import { Card } from '../ui/Card'
import type { RsvpEntry } from '../../types'

const SHIRT_ORDER = ['S', 'M', 'L', 'XL', 'XL (Tall)', '2XL', '3XL']

export function RsvpTab({ data }: { data: RsvpEntry[] }) {
  const friCount = data.filter(r => r.fri).length
  const satCount = data.filter(r => r.sat).length
  const shirtCounts = data.reduce<Record<string, number>>((acc, r) => {
    acc[r.shirt] = (acc[r.shirt] ?? 0) + 1
    return acc
  }, {})

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, padding: '12px 12px 0' }}>
        {([['Total', data.length], ['Friday', friCount], ['Saturday', satCount]] as [string, number][]).map(([label, val]) => (
          <div key={label} style={{
            flex: 1, background: T.card, border: `1px solid ${T.cardBorder}`,
            borderRadius: 8, padding: '12px 8px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 26, fontWeight: 'bold', color: T.accent, lineHeight: 1 }}>{val}</div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
          </div>
        ))}
      </div>

      <Card
        headerText="Attendance"
        headerColor={T.accentDim}
        badge={<span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Fri · Sat · Shirt</span>}
      >
        {data.map((r, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', padding: '10px 14px',
            borderBottom: `1px solid ${T.divider}`,
            background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
          }}>
            <span style={{ flex: 1, fontSize: 14, color: T.text }}>{r.name}</span>
            {[r.fri, r.sat].map((on, j) => (
              <div key={j} style={{
                width: 10, height: 10, borderRadius: '50%', marginLeft: 8,
                background: on ? T.green : T.cardBorder, flexShrink: 0,
              }} />
            ))}
            <span style={{ fontSize: 12, color: T.accent, fontWeight: 'bold', marginLeft: 10, minWidth: 40, textAlign: 'right' }}>{r.shirt}</span>
          </div>
        ))}
      </Card>

      <Card headerText="Shirt Size Summary" headerColor="#3a4a6a">
        {SHIRT_ORDER.filter(s => shirtCounts[s]).map((size, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 14px', borderBottom: `1px solid ${T.divider}`,
            background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
          }}>
            <span style={{ fontSize: 14, color: T.text }}>{size}</span>
            <span style={{ fontSize: 20, fontWeight: 'bold', color: T.accent }}>{shirtCounts[size]}</span>
          </div>
        ))}
      </Card>
      <div style={{ height: 20 }} />
    </div>
  )
}
