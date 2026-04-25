import { useState } from 'react'
import { T } from '../../theme'
import { Btn, GhostBtn } from '../ui/Btn'
import { Modal } from '../ui/Modal'
import type { PackCategory, PackItem } from '../../types'

export function AdminPackList({ data, onChange }: { data: PackCategory[]; onChange: (v: PackCategory[]) => void }) {
  const [openCat, setOpenCat] = useState<number | null>(null)
  const [editingItem, setEditingItem] = useState<{ ci: number; ii: number | 'new' } | null>(null)
  const [itemForm, setItemForm] = useState<Partial<PackItem>>({})
  const [editingCat, setEditingCat] = useState<number | 'new' | null>(null)
  const [catForm, setCatForm] = useState('')

  const saveItem = () => {
    if (!itemForm.item?.trim() || !editingItem) return
    const next = data.map(c => ({ ...c, items: [...c.items] }))
    const entry: PackItem = { item: itemForm.item.trim(), qty: itemForm.qty ?? '', note: itemForm.note ?? '' }
    if (editingItem.ii === 'new') next[editingItem.ci].items.push(entry)
    else next[editingItem.ci].items[editingItem.ii as number] = entry
    onChange(next)
    setEditingItem(null)
    setItemForm({})
  }

  const deleteItem = (ci: number, ii: number) =>
    onChange(data.map((c, i) => i === ci ? { ...c, items: c.items.filter((_, j) => j !== ii) } : c))

  const saveCat = () => {
    if (!catForm.trim()) return
    if (editingCat === 'new') onChange([...data, { category: catForm.trim(), color: '#3a3020', listType: 'shopping', items: [] }])
    else onChange(data.map((c, i) => i === editingCat ? { ...c, category: catForm.trim() } : c))
    setEditingCat(null)
    setCatForm('')
  }

  const deleteCat = (ci: number) => {
    if (!confirm(`Delete "${data[ci].category}" and all its items?`)) return
    onChange(data.filter((_, i) => i !== ci))
    if (openCat === ci) setOpenCat(null)
  }

  return (
    <div>
      {data.map((cat, ci) => (
        <div key={ci} style={{ marginBottom: 8, border: `1px solid ${T.cardBorder}`, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ background: cat.color ?? T.accentDim, padding: '9px 14px', display: 'flex', alignItems: 'center' }}>
            <span
              onClick={() => setOpenCat(openCat === ci ? null : ci)}
              style={{ flex: 1, fontSize: 12, fontWeight: 'bold', color: '#fff', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.06em' }}
            >
              {cat.category} ({cat.items.length}) {openCat === ci ? '▲' : '▼'}
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <GhostBtn onClick={() => { setEditingCat(ci); setCatForm(cat.category) }}>Rename</GhostBtn>
              <GhostBtn onClick={() => deleteCat(ci)} color={T.red}>Del</GhostBtn>
            </div>
          </div>
          {openCat === ci && (
            <div>
              {cat.items.map((row, ii) => (
                <div key={ii} style={{ display: 'flex', alignItems: 'center', padding: '9px 14px', borderBottom: `1px solid ${T.divider}`, gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: T.text }}>{row.item}</div>
                    {row.qty && <div style={{ fontSize: 11, color: T.accent }}>{row.qty}</div>}
                    {row.note && <div style={{ fontSize: 11, color: T.muted, fontStyle: 'italic' }}>{row.note}</div>}
                  </div>
                  <GhostBtn onClick={() => { setEditingItem({ ci, ii }); setItemForm({ ...row }) }}>Edit</GhostBtn>
                  <GhostBtn onClick={() => deleteItem(ci, ii)} color={T.red}>Del</GhostBtn>
                </div>
              ))}
              <div style={{ padding: '10px 14px' }}>
                <GhostBtn onClick={() => { setEditingItem({ ci, ii: 'new' }); setItemForm({}) }}>+ Add Item</GhostBtn>
              </div>
            </div>
          )}
        </div>
      ))}
      <div style={{ paddingBottom: 8 }}>
        <Btn onClick={() => { setEditingCat('new'); setCatForm('') }}>+ Add Category</Btn>
      </div>

      {editingItem !== null && (
        <Modal title={editingItem.ii === 'new' ? 'Add Item' : 'Edit Item'} onClose={() => { setEditingItem(null); setItemForm({}) }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: T.muted, marginBottom: 4 }}>Item Name</div>
              <input value={itemForm.item ?? ''} onChange={e => setItemForm(f => ({ ...f, item: e.target.value }))} placeholder="e.g. Thick-cut bacon" />
            </div>
            <div>
              <div style={{ fontSize: 12, color: T.muted, marginBottom: 4 }}>Qty <span style={{ color: T.accentDim, fontSize: 11 }}>(optional)</span></div>
              <input value={itemForm.qty ?? ''} onChange={e => setItemForm(f => ({ ...f, qty: e.target.value }))} placeholder="e.g. 4 lbs" />
            </div>
            <div>
              <div style={{ fontSize: 12, color: T.muted, marginBottom: 4 }}>Note <span style={{ color: T.accentDim, fontSize: 11 }}>(optional)</span></div>
              <input value={itemForm.note ?? ''} onChange={e => setItemForm(f => ({ ...f, note: e.target.value }))} placeholder="e.g. Don't go disposable" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 18, justifyContent: 'flex-end' }}>
            <GhostBtn onClick={() => { setEditingItem(null); setItemForm({}) }}>Cancel</GhostBtn>
            <Btn onClick={saveItem}>Save</Btn>
          </div>
        </Modal>
      )}

      {editingCat !== null && (
        <Modal title={editingCat === 'new' ? 'New Category' : 'Rename Category'} onClose={() => { setEditingCat(null); setCatForm('') }}>
          <input value={catForm} onChange={e => setCatForm(e.target.value)} placeholder="Category name" />
          <div style={{ display: 'flex', gap: 8, marginTop: 18, justifyContent: 'flex-end' }}>
            <GhostBtn onClick={() => { setEditingCat(null); setCatForm('') }}>Cancel</GhostBtn>
            <Btn onClick={saveCat}>Save</Btn>
          </div>
        </Modal>
      )}
    </div>
  )
}
