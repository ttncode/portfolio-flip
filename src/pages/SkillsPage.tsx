import { forwardRef } from 'react'
import { Page, Eyebrow, Folio } from '../components/Page'
import { Chip } from '../components/primitives'
import { content } from '../content/content'

export const SkillsPage = forwardRef<HTMLDivElement>((_, ref) => {
  const { skills } = content
  return (
    <Page ref={ref} side="left">
      <Eyebrow>{skills.eyebrow}</Eyebrow>
      <div className="section-title">{skills.title}</div>
      <div style={{ overflowY: 'auto' }}>
        {skills.groups.map((g) => (
          <div key={g.title} style={{ marginBottom: 12 }}>
            <div className="label" style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>{g.title}</div>
            <div className="chips">{g.items.map((i) => <Chip key={i}>{i}</Chip>)}</div>
          </div>
        ))}
      </div>
      <Folio side="l">Skills · 12</Folio>
    </Page>
  )
})
SkillsPage.displayName = 'SkillsPage'
