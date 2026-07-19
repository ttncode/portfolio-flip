import { describe, it, expect } from 'vitest'
import { THEME_LIST, THEME_IDS, DEFAULT_THEME, isThemeId } from './themes'

describe('theme registry', () => {
  it('has exactly 6 themes', () => {
    expect(THEME_LIST).toHaveLength(6)
  })
  it('default is gallery-gold and is first', () => {
    expect(DEFAULT_THEME).toBe('gallery-gold')
    expect(THEME_LIST[0].id).toBe('gallery-gold')
  })
  it('exposes the exact id set', () => {
    expect(THEME_IDS).toEqual([
      'gallery-gold', 'mono-blue', 'editorial-ink', 'nocturne', 'terracotta', 'bauhaus',
    ])
  })
  it('validates ids', () => {
    expect(isThemeId('nocturne')).toBe(true)
    expect(isThemeId('swiss')).toBe(false)
  })
})
