import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { ExperiencePage } from './ExperiencePage'
import { ProjectPage } from './ProjectPage'
import { content } from '../content/content'

describe('B pages', () => {
  it('experience shows company + first bullet', () => {
    const item = content.experience.items[0]
    render(<ExperiencePage ref={createRef<HTMLDivElement>()} item={item} side="left" folio="Work · 04" />)
    expect(screen.getByText(item.company)).toBeInTheDocument()
    expect(screen.getByText(item.bullets[0])).toBeInTheDocument()
  })
  it('project shows name + a metric number', () => {
    const p = content.projects.items[0]
    render(<ProjectPage ref={createRef<HTMLDivElement>()} project={p} side="right" folio="Work · 06" />)
    expect(screen.getByText(p.name)).toBeInTheDocument()
    expect(screen.getByText(p.metrics[0].num)).toBeInTheDocument()
  })
})
