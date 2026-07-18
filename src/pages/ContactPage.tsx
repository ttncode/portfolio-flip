import { forwardRef } from 'react'
import { Page, Eyebrow, Folio } from '../components/Page'
import { content } from '../content/content'

export const ContactPage = forwardRef<HTMLDivElement>((_, ref) => {
  const { contact } = content
  return (
    <Page ref={ref} side="left">
      <Eyebrow>Contact</Eyebrow>
      <div className="about-h">{contact.title}</div>
      <p className="lead">{contact.desc}</p>
      <div className="chips" style={{ marginTop: 20, gap: 10 }}>
        {contact.actions.map((a) => (
          <a key={a.label} className="chip" style={{ padding: '9px 16px', fontSize: 12 }} href={a.href}>{a.label}</a>
        ))}
      </div>
      <div className="chips" style={{ marginTop: 14 }}>
        {content.hero.contacts.map((c) => (
          <a key={c.type} className="chip" href={c.href} target="_blank" rel="noreferrer">{c.label}</a>
        ))}
      </div>
      <Folio side="l">Contact · 14</Folio>
    </Page>
  )
})
ContactPage.displayName = 'ContactPage'
