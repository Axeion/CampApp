import { useState } from 'react'
import { T } from './theme'
import { NameGate } from './components/NameGate'
import { PackListTab } from './components/tabs/PackListTab'
import { MenuTab } from './components/tabs/MenuTab'
import { RsvpTab } from './components/tabs/RsvpTab'
import { AdminTab } from './components/admin/AdminTab'
import { useAppConfig } from './hooks/useAppConfig'
import { useChecklist } from './hooks/useChecklist'
import { useSwipe } from './hooks/useSwipe'

type TabId = 'packlist' | 'menu' | 'rsvp'

const TABS: { id: TabId; label: string }[] = [
  { id: 'packlist', label: 'Pack List' },
  { id: 'menu',     label: 'Menu' },
  { id: 'rsvp',     label: 'RSVP' },
]

const TAB_IDS = TABS.map(t => t.id)

export default function App() {
  const [userName, setUserName] = useState<string | null>(
    () => localStorage.getItem('camp_user_name')
  )
  const [tab, setTab] = useState<TabId>('packlist')
  const [adminOpen, setAdminOpen] = useState(false)

  const { config, loading, saveRsvp, savePackList, saveMenu } = useAppConfig()
  const { checked, toggle, clearAll } = useChecklist(userName ?? 'anonymous')

  const currentIdx = TAB_IDS.indexOf(tab)
  const swipe = useSwipe(
    () => setTab(TAB_IDS[(currentIdx + 1) % TAB_IDS.length]),
    () => setTab(TAB_IDS[(currentIdx + TAB_IDS.length - 1) % TAB_IDS.length]),
  )

  if (!userName) return <NameGate onName={setUserName} />

  if (loading) {
    return (
      <div style={{ background: T.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: T.muted, fontSize: 13 }}>Loading…</span>
      </div>
    )
  }

  return (
    <div style={{ background: T.bg, minHeight: '100vh', color: T.text, paddingBottom: 60 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(180deg, #112338 0%, #0d1b26 100%)',
        borderBottom: `1px solid ${T.accent}`,
        padding: '16px 14px 12px',
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{
            fontFamily: "'Alegreya', serif",
            fontSize: 21, fontWeight: 700,
            color: T.accent, letterSpacing: '0.04em',
          }}>Mizpah Lodge #302</div>
          <div style={{ fontSize: 11, color: T.muted, marginTop: 2, fontStyle: 'italic' }}>Camp Cook — Dalton Kock</div>
        </div>
        <button onClick={() => setAdminOpen(true)} style={{
          background: 'none',
          border: `1px solid rgba(200,151,46,0.4)`,
          borderRadius: 6,
          color: T.muted, padding: '5px 10px', fontSize: 11, cursor: 'pointer',
          flexShrink: 0,
        }}>Admin</button>
      </div>

      {adminOpen ? (
        <AdminTab
          rsvp={config.rsvp}
          packList={config.packList}
          menu={config.menu}
          onSaveRsvp={saveRsvp}
          onSavePackList={savePackList}
          onSaveMenu={saveMenu}
          onClose={() => setAdminOpen(false)}
        />
      ) : (
        <>
          {/* Tab bar */}
          <div style={{
            display: 'flex',
            background: '#0a1820',
            borderBottom: `1px solid ${T.cardBorder}`,
            overflowX: 'auto',
          }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                flex: '0 0 auto', padding: '12px 20px', fontSize: 13,
                fontWeight: tab === t.id ? 700 : 400,
                color: tab === t.id ? T.accent : T.muted,
                background: 'none', border: 'none',
                borderBottom: tab === t.id ? `2px solid ${T.accent}` : '2px solid transparent',
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}>{t.label}</button>
            ))}
          </div>

          <div style={{ maxWidth: 600, margin: '0 auto' }} {...swipe}>
            {tab === 'packlist' && <PackListTab data={config.packList} checked={checked} onToggle={toggle} onClearAll={clearAll} />}
            {tab === 'menu'     && <MenuTab data={config.menu} />}
            {tab === 'rsvp'     && <RsvpTab data={config.rsvp} />}
          </div>
        </>
      )}
    </div>
  )
}
