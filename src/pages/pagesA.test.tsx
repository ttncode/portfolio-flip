import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { CoverPage } from './CoverPage'
import { AboutPage } from './AboutPage'
import { ContentsPage } from './ContentsPage'

describe('A pages', () => {
  it('cover shows name and role', () => {
    render(<CoverPage ref={createRef<HTMLDivElement>()} />)
    expect(screen.getByText('Truong Trung Nghia')).toBeInTheDocument()
    expect(screen.getAllByText(/Full Stack Developer/i).length).toBeGreaterThan(0)
  })
  it('about shows the 4 value cards', () => {
    render(<AboutPage ref={createRef<HTMLDivElement>()} />)
    expect(screen.getByText('Enterprise Focus')).toBeInTheDocument()
    expect(screen.getByText('Measurable Impact')).toBeInTheDocument()
  })
  it('contents lists sections', () => {
    render(<ContentsPage ref={createRef<HTMLDivElement>()} onJump={() => {}} />)
    expect(screen.getAllByText('Projects').length).toBeGreaterThan(0)
  })
})
