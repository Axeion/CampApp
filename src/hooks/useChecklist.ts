import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useChecklist(userName: string) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  useEffect(() => {
    let mounted = true

    async function load() {
      const { data } = await supabase.from('checklist').select('item_key, checked')
      if (!mounted || !data) return
      const state: Record<string, boolean> = {}
      data.forEach(r => { state[r.item_key as string] = r.checked as boolean })
      setChecked(state)
    }

    load()

    const channel = supabase.channel('checklist-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'checklist' }, payload => {
        const row = payload.new as { item_key: string; checked: boolean }
        setChecked(prev => ({ ...prev, [row.item_key]: row.checked }))
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'checklist' }, payload => {
        const row = payload.new as { item_key: string; checked: boolean }
        setChecked(prev => ({ ...prev, [row.item_key]: row.checked }))
      })
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  const toggle = async (key: string) => {
    const next = !checked[key]
    setChecked(prev => ({ ...prev, [key]: next }))
    await supabase.from('checklist').upsert(
      { item_key: key, checked: next, checked_by: userName, updated_at: new Date().toISOString() },
      { onConflict: 'item_key' }
    )
  }

  const clearAll = async () => {
    setChecked({})
    await supabase.from('checklist')
      .update({ checked: false, checked_by: userName, updated_at: new Date().toISOString() })
      .neq('item_key', '__none__')
  }

  return { checked, toggle, clearAll }
}
