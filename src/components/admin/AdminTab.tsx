import { useState } from 'react'
import { T } from '../../theme'
import { Btn, GhostBtn } from '../ui/Btn'
import { Card } from '../ui/Card'
import { AdminRsvp } from './AdminRsvp'
import { AdminPackList } from './AdminPackList'
import { AdminMenu } from './AdminMenu'
import { DEFAULT_RSVP, buildDefaultPackList, DEFAULT_MENU } from '../../data/defaults'
import type { RsvpEntry, PackCategory, MenuDay } from '../../types'

type Section = 'rsvp' | 'packlist' | 'menu'

interface Props {
  rsvp: RsvpEntry[]
  packList: PackCategory[]
  menu: MenuDay[]
  onSaveRsvp: (v: RsvpEntry[]) => void
  onSavePackList: (v: PackCategory[]) => void
  onSaveMenu: (v: MenuDay[]) => void
  onClose: () => void
}

const ADMIN_PIN = '302'

export function AdminTab({ rsvp, packList, menu, onSaveRsvp, onSavePackList, onSaveMenu, onClose }: Props) {
  const [section, setSection] = useState<Section>('rsvp')
  const [pin, setPin] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [pinErr, setPinErr] = useState(false)

  const tryUnlock = () => {
    if (pin === ADMIN_PIN) { setUnlocked(true); setPinErr(false) }
    else { setPinErr(true); setPin('') }
  }

  if (!unlocked) {
    return (
      <div style={{ padding: 24, maxWidth: 300, margin: '50px auto', textAlign: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 'bold', color: T.accent, marginBottom: 6 }}>Admin Access</div>
        <div style={{ fontSize: 13, color: T.muted, marginBottom: 18 }}>Enter PIN to edit</div>
        <input
          type="password" inputMode="numeric" value={pin}
          onChange={e => { setPin(e.target.value); setPinErr(false) }}
          onKeyDown={e => e.key === 'Enter' && tryUnlock()}
          placeholder="PIN"
          style={{ textAlign: 'center', letterSpacing: '0.3em', marginBottom: 10 }}
        />
        {pinErr && <div style={{ fontSize: 12, color: T.red, marginBottom: 10 }}>Incorrect PIN</div>}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <GhostBtn onClick={onClose}>Cancel</GhostBtn>
          <Btn onClick={tryUnlock}>Unlock</Btn>
        </div>
      </div>
    )
  }

  const reset = () => {
    const labels: Record<Section, string> = { rsvp: 'RSVP', packlist: 'Pack List', menu: 'Menu' }
    if (!confirm(`Reset ${labels[section]} to original defaults? This cannot be undone.`)) return
    if (section === 'rsvp')     onSaveRsvp(DEFAULT_RSVP)
    if (section === 'packlist') onSavePackList(buildDefaultPackList())
    if (section === 'menu')     onSaveMenu(DEFAULT_MENU)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', borderBottom: `1px solid ${T.cardBorder}`, gap: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 'bold', color: T.accent, flex: 1 }}>Admin Mode</span>
        <GhostBtn onClick={reset} color={T.red}>Reset</GhostBtn>
        <Btn onClick={onClose} small>Done</Btn>
      </div>

      <div style={{ display: 'flex', background: '#161210', borderBottom: `1px solid ${T.cardBorder}` }}>
        {(['rsvp', 'packlist', 'menu'] as Section[]).map(id => (
          <button key={id} onClick={() => setSection(id)} style={{
            flex: 1, padding: '11px 4px', fontSize: 12,
            fontWeight: section === id ? 'bold' : 'normal',
            color: section === id ? T.accent : T.muted,
            background: 'none', border: 'none',
            borderBottom: section === id ? `2px solid ${T.accent}` : '2px solid transparent',
            cursor: 'pointer', fontFamily: 'Georgia, serif', textTransform: 'capitalize',
          }}>{id === 'packlist' ? 'Pack List' : id.toUpperCase() === 'RSVP' ? 'RSVP' : id}</button>
        ))}
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 12px' }}>
        {section === 'rsvp' && (
          <Card headerText="Edit RSVP List" headerColor="#3a4a6a">
            <AdminRsvp data={rsvp} onChange={onSaveRsvp} />
          </Card>
        )}
        {section === 'packlist' && (
          <div style={{ paddingTop: 10 }}>
            <div style={{ fontSize: 12, color: T.muted, paddingBottom: 8 }}>Tap a category to expand. Gear items use Note; shopping items use Qty.</div>
            <AdminPackList data={packList} onChange={onSavePackList} />
          </div>
        )}
        {section === 'menu' && (
          <div style={{ paddingTop: 10 }}>
            <div style={{ fontSize: 12, color: T.muted, paddingBottom: 8 }}>Tap a day to expand, then Edit a meal.</div>
            <AdminMenu data={menu} onChange={onSaveMenu} />
          </div>
        )}
        <div style={{ height: 40 }} />
      </div>
    </div>
  )
}
