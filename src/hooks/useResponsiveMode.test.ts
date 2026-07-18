import { describe, it, expect, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { act } from 'react'
import { useResponsiveMode } from './useResponsiveMode'

function setWidth(w: number) {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: w })
  window.dispatchEvent(new Event('resize'))
}
afterEach(() => setWidth(1280))

describe('useResponsiveMode', () => {
  it('double on wide viewport', () => {
    setWidth(1280)
    const { result } = renderHook(() => useResponsiveMode())
    expect(result.current).toBe('double')
  })
  it('single on narrow viewport', () => {
    setWidth(600)
    const { result } = renderHook(() => useResponsiveMode())
    expect(result.current).toBe('single')
  })
  it('reacts to resize', () => {
    setWidth(1280)
    const { result } = renderHook(() => useResponsiveMode())
    act(() => setWidth(500))
    expect(result.current).toBe('single')
  })
})
