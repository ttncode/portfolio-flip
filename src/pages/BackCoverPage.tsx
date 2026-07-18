import { forwardRef } from 'react'
import { Page } from '../components/Page'
import { content } from '../content/content'

export const BackCoverPage = forwardRef<HTMLDivElement>((_, ref) => {
  const { contact } = content
  return (
    <Page ref={ref} side="left" className="cover">
      <div className="cover-inner" style={{ justifyContent: 'flex-end', gap: 12 }}>
        <div className="cover-name" style={{ margin: 0 }}>{contact.footerName}</div>
        <div className="chips">
          {contact.socials.map((s) => (
            <a className="chip" key={s.type} href={s.href} target="_blank" rel="noreferrer">{s.type}</a>
          ))}
        </div>
        <div className="eyebrow" style={{ marginTop: 10 }}>{contact.footerNote}</div>
      </div>
    </Page>
  )
})
BackCoverPage.displayName = 'BackCoverPage'
