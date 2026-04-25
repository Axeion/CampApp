import { T } from '../../theme'
import { ProgressBar } from '../ui/ProgressBar'
import { Card } from '../ui/Card'
import { CheckRow } from '../ui/CheckRow'
import { GhostBtn } from '../ui/Btn'
import type { PackCategory } from '../../types'

interface Props {
  data: PackCategory[]
  checked: Record<string, boolean>
  onToggle: (key: string) => void
  onClearAll: () => void
}

export function PackListTab({ data, checked, onToggle, onClearAll }: Props) {
  const allKeys = data.flatMap((c, ci) => c.items.map((_, ii) => `${ci}-${ii}`))
  const done = allKeys.filter(k => checked[k]).length

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 12px 0' }}>
        <span style={{ fontSize: 13, color: T.muted }}>Gear to pack + items to buy</span>
        <GhostBtn onClick={onClearAll}>Clear all</GhostBtn>
      </div>
      <ProgressBar done={done} total={allKeys.length} />
      {data.map((cat, ci) => {
        const catDone = cat.items.filter((_, ii) => checked[`${ci}-${ii}`]).length
        return (
          <Card key={ci} headerText={cat.category} headerColor={cat.color ?? T.accentDim} badge={`${catDone}/${cat.items.length}`}>
            {cat.items.map((row, ii) => (
              <CheckRow
                key={ii}
                label={row.item}
                sublabel={row.note ?? null}
                rightLabel={row.qty ?? null}
                checked={!!checked[`${ci}-${ii}`]}
                onToggle={() => onToggle(`${ci}-${ii}`)}
              />
            ))}
          </Card>
        )
      })}
      <div style={{ height: 20 }} />
    </div>
  )
}
