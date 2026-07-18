import { useEffect, useState } from 'react'

const BREAKPOINT = 1024
function compute(): 'single' | 'double' {
  return window.innerWidth < BREAKPOINT ? 'single' : 'double'
}

export function useResponsiveMode(): 'single' | 'double' {
  const [mode, setMode] = useState<'single' | 'double'>(compute)
  useEffect(() => {
    const onResize = () => setMode(compute())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return mode
}
