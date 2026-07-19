import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '../theme/ThemeProvider'
import { ThemeSwitcher } from './ThemeSwitcher'

describe('ThemeSwitcher', () => {
  it('sets data-theme on html when a theme is clicked', () => {
    render(<ThemeProvider><ThemeSwitcher /></ThemeProvider>)
    fireEvent.click(screen.getByRole('button', { name: /Nocturne/i }))
    expect(document.documentElement.getAttribute('data-theme')).toBe('nocturne')
  })
})
