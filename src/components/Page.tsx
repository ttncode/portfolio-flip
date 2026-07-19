import { forwardRef, type ReactNode } from 'react'

interface PageProps { side?: 'left' | 'right'; className?: string; children: ReactNode }

export const Page = forwardRef<HTMLDivElement, PageProps>(
  ({ side = 'right', className = '', children }, ref) => (
    <div className="page" ref={ref}>
      <div className={`pg ${side} ${className}`}>{children}</div>
    </div>
  ),
)
Page.displayName = 'Page'

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow">{children}</div>
}
export function Folio({ side, children }: { side: 'l' | 'r'; children: ReactNode }) {
  return <div className={`folio ${side}`}>{children}</div>
}
