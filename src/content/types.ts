export interface Metric { num: string; label: string }
export interface Hero {
  badge: string; name: string; role: string; summary: string
  chips: string[]
  actions: { label: string; href: string }[]
  contacts: { type: string; label: string; href: string }[]
  avatar: string
  stats: Metric[]
}
export interface ExperienceItem {
  company: string; role: string; location: string; period: string
  current: boolean; bullets: string[]; tech: string[]
}
export interface Project {
  name: string; tag: string; period: string; desc: string
  metrics: Metric[]; features: string[]; tech: string[]; team: string
}
export interface SkillGroup { title: string; items: string[] }
export interface Education {
  eyebrow: string; title: string
  degree: { title: string; school: string; location: string; period: string }
  certifications: { name: string; issuer: string; date: string }[]
}
export interface Contact {
  title: string; desc: string
  actions: { label: string; href: string }[]
  footerName: string
  socials: { type: string; href: string }[]
  footerNote: string
}
export interface Content {
  meta: { name: string; title: string; description: string; ogDescription: string; url: string }
  hero: Hero
  about: { eyebrow: string; title: string; cards: { title: string; desc: string }[] }
  experience: { eyebrow: string; title: string; items: ExperienceItem[] }
  projects: { eyebrow: string; title: string; items: Project[] }
  skills: { eyebrow: string; title: string; groups: SkillGroup[] }
  education: Education
  contact: Contact
}
