import { forwardRef } from 'react'
import { Page } from '../components/Page'
import { content } from '../content/content'

export const CoverPage = forwardRef<HTMLDivElement>((_, ref) => {
  const { hero } = content
  return (
    <Page ref={ref} side="right" className="cover">
      <div className="cover-inner">
        <div className="eyebrow" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Portfolio — 2025</span><span>No. 01</span>
        </div>
        <div className="cover-name">{hero.name}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="cover-role">{hero.role}</span>
          <img className="cover-avatar" src={hero.avatar} alt={hero.name} />
        </div>
        <p className="lead" style={{ marginTop: 18, fontStyle: 'italic' }}>"{hero.summary}"</p>
      </div>
    </Page>
  )
})
CoverPage.displayName = 'CoverPage'
