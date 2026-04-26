import { useState } from 'react'
import { T } from '../theme'
import { Btn } from './ui/Btn'

export function NameGate({ onName }: { onName: (name: string) => void }) {
  const [value, setValue] = useState('')

  const submit = () => {
    const name = value.trim()
    if (!name) return
    localStorage.setItem('camp_user_name', name)
    onName(name)
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', padding: 24, background: T.bg,
    }}>
      <div style={{ maxWidth: 300, width: '100%', textAlign: 'center' }}>
        <div style={{
          fontFamily: '\'Alegreya\', serif',
          fontSize: 26, fontWeight: 700,
          color: T.accent, marginBottom: 4,
        }}>Mizpah Lodge #302</div>
        <div style={{
          fontSize: 12, color: T.muted,
          marginBottom: 32, fontStyle: 'italic',
          borderBottom: `1px solid rgba(200,151,46,0.25)`,
          paddingBottom: 20,
        }}>Camp Cook — Dalton Kock</div>
        <div style={{ fontSize: 14, color: T.text, marginBottom: 12 }}>Who are you?</div>
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="Your name"
          autoFocus
          style={{ textAlign: 'center', marginBottom: 16 }}
        />
        <Btn onClick={submit}>Let’s Go</Btn>
      </div>
    </div>
  )
}
