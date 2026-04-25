import { useState } from 'react'
import { T } from '../../theme'
import { Btn, GhostBtn } from '../ui/Btn'
import { Modal } from '../ui/Modal'
import type { RsvpEntry } from '../../types'

const SHIRT_SIZES = ['S', 'M', 'L', 'XL', 'XL (Tall)', '2XL', '3XL']

export function AdminRsvp({ data, onChange }: { data: RsvpEntry[]; onChange: (v: RsvpEntry[]) => void }) {
  const [editing, setEditing] = useState<number | 'new' | null>(null)
  const [form, setForm] = useState<Partial<RsvpEntry>>({})

  const openEdit = (i: number | 'new') => {
    setEditing(i)
    setForm(i === 'new' ? { name: '', fri: true, sat: true, shirt: 'XL' } : { ...data[i as number] })
  }

  const save = () => {
    if (!form.name?.trim()) return
    const entry: RsvpEntry = { name: form.name.trim(), fri: !!form.fri, sat: !!form.sat, shirt: form.shirt ?? 'XL' }
    const next = [...data]
    if (editing === 'new') next.push(entry)
    else next[editing as number] = entry
    onChange(next)
    setEditing(null)
  }

  const remove = (i: number) => {
    if (!confirm('Remove ' + data[i].name + '?')) return
    onChange(data.filter((_, idx) => idx !== i))
  }

  return (
    <div>
      {data.map((r, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', padding: '10px 14px',
          borderBottom: `1px solid ${T.divider}`,
          background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, color: T.text }}>{r.name}</div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>
              {r.fri ? 'Fri' : 'No Fri'} · {r.sat ? 'Sat' : 'No Sat'} · {r.shirt}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <GhostBtn onClick={() => openEdit(i)}>Edit</GhostBtn>
            <GhostBtn onClick={() => remove(i)} color={T.red}>Del</GhostBtn>
          </div>
        </div>
      ))}
      <div style={{ padding: '12px 14px' }}>
        <Btn onClick={() => openEdit('new')}>+ Add Person</Btn>
      </div>

      {editing !== null && (
        <Modal
          title={editing === 'new' ? 'Add Person' : `Edit ${(data[editing as number])?.name ?? ''}`}
          onClose={() => setEditing(null)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: T.muted, marginBottom: 4 }}>Name</div>
              <input value={form.name ?? ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name" />
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              {(['fri', 'sat'] as const).map(key => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, color: T.text, fontSize: 14, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={!!form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
                    style={{ width: 18, height: 18, accentColor: T.green }}
                  />
                  {key === 'fri' ? 'Friday Night' : 'Saturday Night'}
                </label>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 12, color: T.muted, marginBottom: 4 }}>Shirt Size</div>
              <select value={form.shirt ?? 'XL'} onChange={e => setForm(f => ({ ...f, shirt: e.target.value }))}>
                {SHIRT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 18, justifyContent: 'flex-end' }}>
            <GhostBtn onClick={() => setEditing(null)}>Cancel</GhostBtn>
            <Btn onClick={save}>Save</Btn>
          </div>
        </Modal>
      )}
    </div>
  )
}
