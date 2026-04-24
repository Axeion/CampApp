export interface RsvpEntry {
  name: string
  fri: boolean
  sat: boolean
  shirt: string
}

export interface PackItem {
  item: string
  qty?: string
  note?: string
}

export interface PackCategory {
  category: string
  color?: string
  listType?: string
  items: PackItem[]
}

export interface MenuMeal {
  meal: string
  name: string
  items: string[]
  note?: string
}

export interface MenuDay {
  day: string
  color?: string
  meals: MenuMeal[]
}

export interface AppConfig {
  rsvp: RsvpEntry[]
  packList: PackCategory[]
  menu: MenuDay[]
}
