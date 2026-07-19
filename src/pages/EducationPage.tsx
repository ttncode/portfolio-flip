import { forwardRef } from 'react'
import { Page, Eyebrow, Folio } from '../components/Page'
import { content } from '../content/content'

export const EducationPage = forwardRef<HTMLDivElement>((_, ref) => {
  const { education } = content
  const d = education.degree
  return (
    <Page ref={ref} side="right">
      <Eyebrow>{education.eyebrow}</Eyebrow>
      <div className="section-title">{education.title}</div>
      <div className="mini" style={{ marginTop: 8 }}>
        <h4>{d.title}</h4>
        <p>{d.school} · {d.location}</p>
        <p className="label" style={{ color: 'var(--accent)', marginTop: 4 }}>{d.period}</p>
      </div>
      <div className="label" style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)', margin: '16px 0 8px' }}>Certifications</div>
      {education.certifications.map((c) => (
        <div className="toc-row" key={c.name}>
          <span><span className="t">{c.name}</span><span className="s">{c.issuer}</span></span>
          <span className="p">{c.date}</span>
        </div>
      ))}
      <Folio side="r">Education · 13</Folio>
    </Page>
  )
})
EducationPage.displayName = 'EducationPage'
