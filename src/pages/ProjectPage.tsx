import { forwardRef } from 'react'
import { Page, Eyebrow, Folio } from '../components/Page'
import { MetricTile, Chip } from '../components/primitives'
import type { Project } from '../content/types'

interface Props { project: Project; side: 'left' | 'right'; folio: string }

export const ProjectPage = forwardRef<HTMLDivElement, Props>(({ project, side, folio }, ref) => (
  <Page ref={ref} side={side}>
    <Eyebrow>{project.tag} · {project.period}</Eyebrow>
    <div className="section-title">{project.name}</div>
    <p className="lead" style={{ fontSize: 12 }}>{project.desc}</p>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14 }}>
      {project.metrics.map((m) => <MetricTile key={m.label} metric={m} />)}
    </div>
    <ul className="bullets" style={{ marginTop: 12 }}>
      {project.features.map((f) => <li key={f}>{f}</li>)}
    </ul>
    <div className="chips">{project.tech.map((t) => <Chip key={t}>{t}</Chip>)}</div>
    <Folio side={side === 'left' ? 'l' : 'r'}>{folio} · {project.team}</Folio>
  </Page>
))
ProjectPage.displayName = 'ProjectPage'
