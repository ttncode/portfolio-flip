import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Page, Eyebrow } from './Page'

describe('Page', () => {
  it('forwards ref to the page div and renders children', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Page ref={ref} side="left"><Eyebrow>About</Eyebrow></Page>)
    expect(ref.current).not.toBeNull()
    expect(ref.current!.classList.contains('page')).toBe(true)
    expect(screen.getByText('About')).toBeInTheDocument()
  })
})
