import { forwardRef } from 'react'
import { Page, Eyebrow, Folio } from '../components/Page'
import { content } from '../content/content'

export const AboutPage = forwardRef<HTMLDivElement>((_, ref) => {
  const { about, hero } = content
  const [first, ...rest] = hero.summary
  return (
    <Page ref={ref} side="right">
      <Eyebrow>{about.eyebrow}</Eyebrow>
      <div className="about-h">{about.title}</div>
      <p className="lead"><span className="drop">{first}</span>{rest.join('')}</p>
      <div className="cards2">
        {about.cards.map((c) => (
          <div className="mini" key={c.title}><h4>{c.title}</h4><p>{c.desc}</p></div>
        ))}
      </div>
      <Folio side="r">About · 02</Folio>
    </Page>
  )
})
AboutPage.displayName = 'AboutPage'
