import { useMemo, useRef } from 'react'
import HTMLFlipBookImport from 'react-pageflip'
import { useResponsiveMode } from '../hooks/useResponsiveMode'
import { content } from '../content/content'
import { CoverPage } from '../pages/CoverPage'
import { ContentsPage } from '../pages/ContentsPage'
import { AboutPage } from '../pages/AboutPage'
import { ExperiencePage } from '../pages/ExperiencePage'
import { ProjectPage } from '../pages/ProjectPage'
import { SkillsPage } from '../pages/SkillsPage'
import { EducationPage } from '../pages/EducationPage'
import { ContactPage } from '../pages/ContactPage'
import { BackCoverPage } from '../pages/BackCoverPage'

// react-pageflip's bundled types require every IFlipSetting prop (no Partial<>);
// cast to any rather than enumerate ~20 settings we don't otherwise need.
const HTMLFlipBook = HTMLFlipBookImport as any

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function Magazine() {
  const mode = useResponsiveMode()
  const book = useRef<any>(null)
  const jump = (page: number) => book.current?.pageFlip()?.flip(page)

  // Stable page list; each direct child MUST forward a ref (react-pageflip clones them).
  const pages = useMemo(
    () => [
      <CoverPage key="cover" />,
      <ContentsPage key="contents" onJump={jump} />,
      <AboutPage key="about" />,
      <ExperiencePage key="exp0" item={content.experience.items[0]} side="left" folio="Work · 04" />,
      <ExperiencePage key="exp1" item={content.experience.items[1]} side="right" folio="Work · 05" />,
      <ProjectPage key="p0" project={content.projects.items[0]} side="left" folio="Project · 06" />,
      <ProjectPage key="p1" project={content.projects.items[1]} side="right" folio="Project · 07" />,
      <ProjectPage key="p2" project={content.projects.items[2]} side="left" folio="Project · 08" />,
      <ProjectPage key="p3" project={content.projects.items[3]} side="right" folio="Project · 09" />,
      <SkillsPage key="skills" />,
      <EducationPage key="edu" />,
      <ContactPage key="contact" />,
      <BackCoverPage key="back" />,
    ],
    [],
  )

  return (
    <div className="stage">
      <HTMLFlipBook
        ref={book}
        width={460}
        height={620}
        size="stretch"
        minWidth={300}
        maxWidth={560}
        minHeight={420}
        maxHeight={760}
        showCover
        usePortrait={mode === 'single'}
        mobileScrollSupport
        drawShadow={!prefersReduced}
        flippingTime={prefersReduced ? 0 : 700}
        className="magazine"
      >
        {pages}
      </HTMLFlipBook>
    </div>
  )
}
