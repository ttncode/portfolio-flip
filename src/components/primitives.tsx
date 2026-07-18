import type { ReactNode } from 'react'
import type { Metric } from '../content/types'

export function MetricTile({ metric }: { metric: Metric }) {
  return (
    <div className="metric">
      <div className="n">{metric.num}</div>
      <div className="l">{metric.label}</div>
    </div>
  )
}
export function Stat({ metric }: { metric: Metric }) {
  return (
    <div className="stat">
      <div className="n">{metric.num}</div>
      <div className="l">{metric.label}</div>
    </div>
  )
}
export function Chip({ children }: { children: ReactNode }) {
  return <span className="chip">{children}</span>
}
