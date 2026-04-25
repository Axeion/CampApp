import { T } from '../../theme'
import { Card } from '../ui/Card'
import type { MenuDay } from '../../types'

export function MenuTab({ data }: { data: MenuDay[] }) {
  return (
    <div>
      {data.map((day, di) => (
        <Card key={di} headerText={day.day} headerColor={day.color}>
          {day.meals.map((meal, mi) => (
            <div key={mi}>
              <div style={{ padding: '12px 14px', borderBottom: `1px solid ${T.divider}` }}>
                <div style={{ fontSize: 11, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>{meal.meal}</div>
                <div style={{ fontSize: 15, fontWeight: 'bold', color: T.text, marginBottom: 8 }}>{meal.name}</div>
                {meal.items.map((item, ii) => (
                  <div key={ii} style={{ fontSize: 13, color: '#c0b49e', lineHeight: 1.8, paddingLeft: 8 }}>
                    <span style={{ color: T.accentDim, marginRight: 6 }}>-</span>{item}
                  </div>
                ))}
              </div>
              {meal.note && (
                <div style={{
                  fontSize: 12, color: '#a07848', fontStyle: 'italic',
                  padding: '8px 14px 10px', background: 'rgba(200,134,26,0.05)',
                  borderBottom: `1px solid ${T.divider}`, lineHeight: 1.5,
                }}>
                  Cook’s Note: {meal.note}
                </div>
              )}
            </div>
          ))}
        </Card>
      ))}
      <div style={{ height: 20 }} />
    </div>
  )
}
