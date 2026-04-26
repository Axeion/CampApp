import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { T } from '../../theme'
import { Btn, GhostBtn } from '../ui/Btn'
import { Modal } from '../ui/Modal'
import type { PackCategory, PackItem } from '../../types'

// ── Sortable item row ────────────────────────────────────────────────────────

function SortableItemRow({ id, row, onEdit, onDelete }: {
  id: string
  row: PackItem
  onEdit: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        display: 'flex', alignItems: 'center',
        padding: '9px 14px', borderBottom: `1px solid ${T.divider}`, gap: 8,
        background: isDragging ? 'rgba(42,143,212,0.08)' : 'transparent',
        opacity: isDragging ? 0.4 : 1,
      }}
    >
      <span
        {...(listeners ?? {})}
        {...attributes}
        style={{
          cursor: 'grab', color: T.muted, fontSize: 16,
          paddingRight: 6, lineHeight: 1,
          touchAction: 'none', flexShrink: 0, userSelect: 'none',
        }}
      >⣿</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: T.text }}>{row.item}</div>
        {row.qty && <div style={{ fontSize: 11, color: T.accent }}>{row.qty}</div>}
        {row.note && <div style={{ fontSize: 11, color: T.muted, fontStyle: 'italic' }}>{row.note}</div>}
      </div>
      <GhostBtn onClick={onEdit}>Edit</GhostBtn>
      <GhostBtn onClick={onDelete} color={T.red}>Del</GhostBtn>
    </div>
  )
}

// ── Sortable category ────────────────────────────────────────────────────────

function SortableCategory({ id, cat, ci, isOpen, onToggle, onRename, onDelete, onAddItem, onEditItem, onDeleteItem }: {
  id: string
  cat: PackCategory
  ci: number
  isOpen: boolean
  onToggle: () => void
  onRename: () => void
  onDelete: () => void
  onAddItem: () => void
  onEditItem: (ii: number) => void
  onDeleteItem: (ii: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const itemIds = cat.items.map((_, ii) => `item-${ci}-${ii}`)

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        marginBottom: 8,
        border: `1px solid ${T.cardBorder}`,
        borderRadius: 8,
        overflow: 'hidden',
        opacity: isDragging ? 0.3 : 1,
      }}
    >
      <div style={{ background: cat.color ?? T.accentDim, padding: '9px 14px', display: 'flex', alignItems: 'center' }}>
        <span
          {...(listeners ?? {})}
          {...attributes}
          style={{
            cursor: 'grab', color: 'rgba(255,255,255,0.55)', fontSize: 16,
            paddingRight: 10, lineHeight: 1,
            touchAction: 'none', flexShrink: 0, userSelect: 'none',
          }}
        >⣿</span>
        <span
          onClick={onToggle}
          style={{ flex: 1, fontSize: 12, fontWeight: 'bold', color: '#fff', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.06em' }}
        >
          {cat.category} ({cat.items.length}) {isOpen ? '▲' : '▼'}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          <GhostBtn onClick={onRename}>Rename</GhostBtn>
          <GhostBtn onClick={onDelete} color={T.red}>Del</GhostBtn>
        </div>
      </div>

      {isOpen && (
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          {cat.items.map((row, ii) => (
            <SortableItemRow
              key={`item-${ci}-${ii}`}
              id={`item-${ci}-${ii}`}
              row={row}
              onEdit={() => onEditItem(ii)}
              onDelete={() => onDeleteItem(ii)}
            />
          ))}
          <div style={{ padding: '10px 14px' }}>
            <GhostBtn onClick={onAddItem}>+ Add Item</GhostBtn>
          </div>
        </SortableContext>
      )}
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export function AdminPackList({ data, onChange }: {
  data: PackCategory[]
  onChange: (v: PackCategory[]) => void
}) {
  const [openCat, setOpenCat] = useState<number | null>(null)
  const [editingItem, setEditingItem] = useState<{ ci: number; ii: number | 'new' } | null>(null)
  const [itemForm, setItemForm] = useState<Partial<PackItem>>({})
  const [editingCat, setEditingCat] = useState<number | 'new' | null>(null)
  const [catForm, setCatForm] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const catIds = data.map((_, ci) => `cat-${ci}`)

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string)
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null)
    if (!over || active.id === over.id) return

    const aid = active.id as string
    const oid = over.id as string

    // Category → category reorder
    if (aid.startsWith('cat-') && oid.startsWith('cat-')) {
      const from = parseInt(aid.split('-')[1])
      const to = parseInt(oid.split('-')[1])
      onChange(arrayMove(data, from, to))
      return
    }

    // Item → item or category drop
    if (aid.startsWith('item-')) {
      const [, fromCiStr, fromIiStr] = aid.split('-')
      const fromCi = parseInt(fromCiStr)
      const fromIi = parseInt(fromIiStr)
      const item = data[fromCi].items[fromIi]

      let toCi: number
      let toIi: number

      if (oid.startsWith('item-')) {
        const [, toCiStr, toIiStr] = oid.split('-')
        toCi = parseInt(toCiStr)
        toIi = parseInt(toIiStr)
      } else if (oid.startsWith('cat-')) {
        toCi = parseInt(oid.split('-')[1])
        toIi = data[toCi].items.length  // append to end of that category
      } else {
        return
      }

      if (fromCi === toCi) {
        // Same category: simple reorder
        onChange(data.map((c, i) =>
          i === fromCi ? { ...c, items: arrayMove(c.items, fromIi, toIi) } : c
        ))
      } else {
        // Cross-category: remove from source, insert at target, open target
        setOpenCat(toCi)
        onChange(data.map((c, i) => {
          if (i === fromCi) return { ...c, items: c.items.filter((_, j) => j !== fromIi) }
          if (i === toCi) {
            const next = [...c.items]
            next.splice(toIi, 0, item)
            return { ...c, items: next }
          }
          return c
        }))
      }
    }
  }

  // Resolve what's being dragged for the overlay
  let activeCat: PackCategory | null = null
  let activeItem: PackItem | null = null
  if (activeId?.startsWith('cat-')) {
    activeCat = data[parseInt(activeId.split('-')[1])] ?? null
  } else if (activeId?.startsWith('item-')) {
    const parts = activeId.split('-')
    activeItem = data[parseInt(parts[1])]?.items[parseInt(parts[2])] ?? null
  }

  // CRUD helpers
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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={catIds} strategy={verticalListSortingStrategy}>
          {data.map((cat, ci) => (
            <SortableCategory
              key={`cat-${ci}`}
              id={`cat-${ci}`}
              cat={cat}
              ci={ci}
              isOpen={openCat === ci}
              onToggle={() => setOpenCat(openCat === ci ? null : ci)}
              onRename={() => { setEditingCat(ci); setCatForm(cat.category) }}
              onDelete={() => deleteCat(ci)}
              onAddItem={() => { setEditingItem({ ci, ii: 'new' }); setItemForm({}) }}
              onEditItem={ii => { setEditingItem({ ci, ii }); setItemForm({ ...cat.items[ii] }) }}
              onDeleteItem={ii => deleteItem(ci, ii)}
            />
          ))}
        </SortableContext>

        <DragOverlay>
          {activeCat != null && (
            <div style={{
              background: activeCat.color ?? T.accentDim,
              padding: '9px 14px', borderRadius: 8,
              border: `1px solid ${T.cardBorder}`,
              fontSize: 12, fontWeight: 'bold', color: '#fff',
              textTransform: 'uppercase', letterSpacing: '0.06em',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              cursor: 'grabbing', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ fontSize: 16, opacity: 0.7 }}>⣿</span>
              {activeCat.category} ({activeCat.items.length})
            </div>
          )}
          {activeItem != null && (
            <div style={{
              background: T.card,
              border: `1px solid rgba(200,151,46,0.3)`,
              borderRadius: 6, padding: '9px 14px',
              display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              cursor: 'grabbing',
            }}>
              <span style={{ fontSize: 16, color: T.muted }}>⣿</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: T.text }}>{activeItem.item}</div>
                {activeItem.qty && <div style={{ fontSize: 11, color: T.accent }}>{activeItem.qty}</div>}
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>

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
