import { describe, it, expect } from 'vitest'
import { content } from './content'

describe('content model', () => {
  it('loads meta + hero', () => {
    expect(content.meta.name).toBe('Truong Trung Nghia')
    expect(content.hero.avatar).toBe('/avatar.jpg')
  })
  it('has 4 projects and 2 experience items', () => {
    expect(content.projects.items).toHaveLength(4)
    expect(content.experience.items).toHaveLength(2)
  })
  it('no longer exposes nav', () => {
    expect((content as unknown as Record<string, unknown>).nav).toBeUndefined()
  })
})
