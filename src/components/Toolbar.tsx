interface Props { page: number; total: number; onPrev: () => void; onNext: () => void }

export function Toolbar({ page, total, onPrev, onNext }: Props) {
  const pct = total > 1 ? (page / (total - 1)) * 100 : 0
  return (
    <div className="toolbar">
      <button className="nav-btn" aria-label="Previous page" onClick={onPrev}>‹</button>
      <div className="counter label">{String(page + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</div>
      <div className="progress"><span style={{ width: `${pct}%` }} /></div>
      <button className="nav-btn" aria-label="Next page" onClick={onNext}>›</button>
    </div>
  )
}
