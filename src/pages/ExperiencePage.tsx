import { forwardRef } from 'react'
import { Page, Eyebrow, Folio } from '../components/Page'
import { Chip } from '../components/primitives'
import type { ExperienceItem } from '../content/types'

interface Props { item: ExperienceItem; side: 'left' | 'right'; folio: string }

export const ExperiencePage = forwardRef<HTMLDivElement, Props>(({ item, side, folio }, ref) => (
  <Page ref={ref} side={side}>
    <Eyebrow>{item.current ? 'Current Role' : 'Experience'}</Eyebrow>
    <div className="section-title">{item.company}</div>
    <div className="label" style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted2)' }}>
      {item.role} · {item.location}
    </div>
    <div className="label" style={{ fontSize: 10, color: 'var(--accent)', marginTop: 4 }}>{item.period}</div>
    <ul className="bullets">{item.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
    <div className="chips">{item.tech.map((t) => <Chip key={t}>{t}</Chip>)}</div>
    <Folio side={side === 'left' ? 'l' : 'r'}>{folio}</Folio>
  </Page>
))
ExperiencePage.displayName = 'ExperiencePage'
