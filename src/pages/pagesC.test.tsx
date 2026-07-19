import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { SkillsPage } from './SkillsPage'
import { EducationPage } from './EducationPage'
import { ContactPage } from './ContactPage'

describe('C pages', () => {
  it('skills shows a group title', () => {
    render(<SkillsPage ref={createRef<HTMLDivElement>()} />)
    expect(screen.getByText('Languages')).toBeInTheDocument()
  })
  it('education shows the degree', () => {
    render(<EducationPage ref={createRef<HTMLDivElement>()} />)
    expect(screen.getByText(/Information Technology/)).toBeInTheDocument()
  })
  it('contact shows the title', () => {
    render(<ContactPage ref={createRef<HTMLDivElement>()} />)
    expect(screen.getByText(/build something great/i)).toBeInTheDocument()
  })
})
