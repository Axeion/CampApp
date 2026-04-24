import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { DEFAULT_RSVP, buildDefaultPackList, DEFAULT_MENU } from '../data/defaults'
import type { AppConfig } from '../types'

const DEFAULTS: AppConfig = {
  rsvp: DEFAULT_RSVP,
  packList: buildDefaultPackList(),
  menu: DEFAULT_MENU,
}

export function useAppConfig() {
  const [config, setConfig] = useState<AppConfig>(DEFAULTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function load() {
      const { data } = await supabase.from('config').select('key, value')
      if (!mounted) return

      if (data && data.length > 0) {
        const map: Record<string, unknown> = {}
        data.forEach(r => { map[r.key as string] = r.value })
        setConfig({
          rsvp: (map['rsvp'] as AppConfig['rsvp']) ?? DEFAULTS.rsvp,
          packList: (map['pack_list'] as AppConfig['packList']) ?? DEFAULTS.packList,
          menu: (map['menu'] as AppConfig['menu']) ?? DEFAULTS.menu,
        })
      } else {
        await supabase.from('config').upsert([
          { key: 'rsvp',       value: DEFAULTS.rsvp },
          { key: 'pack_list',  value: DEFAULTS.packList },
          { key: 'menu',       value: DEFAULTS.menu },
        ])
      }

      if (mounted) setLoading(false)
    }

    load()

    const channel = supabase.channel('config-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'config' }, payload => {
        if (!mounted) return
        const row = payload.new as { key: string; value: unknown }
        if (row.key === 'rsvp')       setConfig(c => ({ ...c, rsvp:     row.value as AppConfig['rsvp'] }))
        if (row.key === 'pack_list')  setConfig(c => ({ ...c, packList: row.value as AppConfig['packList'] }))
        if (row.key === 'menu')       setConfig(c => ({ ...c, menu:     row.value as AppConfig['menu'] }))
      })
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  async function upsert(key: string, value: unknown) {
    await supabase.from('config').upsert({ key, value, updated_at: new Date().toISOString() })
  }

  const saveRsvp = async (rsvp: AppConfig['rsvp']) => {
    setConfig(c => ({ ...c, rsvp }))
    await upsert('rsvp', rsvp)
  }

  const savePackList = async (packList: AppConfig['packList']) => {
    setConfig(c => ({ ...c, packList }))
    await upsert('pack_list', packList)
  }

  const saveMenu = async (menu: AppConfig['menu']) => {
    setConfig(c => ({ ...c, menu }))
    await upsert('menu', menu)
  }

  return { config, loading, saveRsvp, savePackList, saveMenu }
}
