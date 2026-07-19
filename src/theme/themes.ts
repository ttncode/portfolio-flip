export const THEME_LIST = [
  { id: 'gallery-gold', label: 'Gallery Gold' },
  { id: 'mono-blue', label: 'Mono Blue' },
  { id: 'editorial-ink', label: 'Editorial Ink' },
  { id: 'nocturne', label: 'Nocturne' },
  { id: 'terracotta', label: 'Terracotta Warm' },
  { id: 'bauhaus', label: 'Bauhaus Blocks' },
] as const

export type ThemeId = (typeof THEME_LIST)[number]['id']
export const THEME_IDS = THEME_LIST.map((t) => t.id) as ThemeId[]
export const DEFAULT_THEME: ThemeId = 'gallery-gold'
export function isThemeId(v: string): v is ThemeId {
  return (THEME_IDS as string[]).includes(v)
}
