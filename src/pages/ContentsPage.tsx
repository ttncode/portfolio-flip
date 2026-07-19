import { forwardRef } from 'react'
import { Page, Eyebrow, Folio } from '../components/Page'
import { Stat } from '../components/primitives'
import { content } from '../content/content'

const ENTRIES = [
  { t: 'About', s: 'Turning complex problems into elegant solutions', p: '02', page: 2 },
  { t: 'Experience', s: 'TPS Software · QASoft Solution', p: '04', page: 3 },
  { t: 'Projects', s: 'Unioss · Nippoh · Nail Booking · Misa ERP', p: '06', page: 5 },
  { t: 'Skills & Education', s: 'Stack, tooling, certifications', p: '12', page: 9 },
  { t: 'Contact', s: "Let's build something great", p: '14', page: 11 },
]

interface Props { onJump: (page: number) => void }

export const ContentsPage = forwardRef<HTMLDivElement, Props>(({ onJump }, ref) => (
  <Page ref={ref} side="left">
    <Eyebrow>Issue 01 — Contents</Eyebrow>
    <div className="toc-h">Inside this issue</div>
    {ENTRIES.map((e) => (
      <div className="toc-row" key={e.t}>
        <span>
          <button className="toc-link" onClick={() => onJump(e.page)}>
            <span className="t">{e.t}</span>
          </button>
          <span className="s">{e.s}</span>
        </span>
        <span className="p">{e.p}</span>
      </div>
    ))}
    <div className="stats">
      {content.hero.stats.map((s) => <Stat key={s.label} metric={s} />)}
    </div>
    <Folio side="l">TTN · 01</Folio>
  </Page>
))
ContentsPage.displayName = 'ContentsPage'
