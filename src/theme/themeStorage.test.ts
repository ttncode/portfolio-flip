import { describe, it, expect, beforeEach } from 'vitest'
import { getInitialTheme, persistTheme, STORAGE_KEY } from './themeStorage'

describe('theme storage', () => {
  beforeEach(() => localStorage.clear())

  it('defaults to gallery-gold when nothing stored', () => {
    expect(getInitialTheme()).toBe('gallery-gold')
  })
  it('returns a valid stored theme', () => {
    localStorage.setItem(STORAGE_KEY, 'nocturne')
    expect(getInitialTheme()).toBe('nocturne')
  })
  it('ignores an invalid stored value', () => {
    localStorage.setItem(STORAGE_KEY, 'not-a-theme')
    expect(getInitialTheme()).toBe('gallery-gold')
  })
  it('persists a theme', () => {
    persistTheme('terracotta')
    expect(localStorage.getItem(STORAGE_KEY)).toBe('terracotta')
  })
})
