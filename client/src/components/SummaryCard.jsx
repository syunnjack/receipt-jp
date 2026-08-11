import { useMemo } from 'react'

export function SummaryCard({ transactions, filterMonth }) {
  const month = filterMonth || new Date().toISOString().slice(0, 7)
  const monthly = useMemo(() =>
    transactions.filter(t => t.date.startsWith(month)),
    [transactions, month]
  )
  const total = monthly.reduce((s, t) => s + t.price, 0)
  const byCategory = useMemo(() => {
    const map = {}
    monthly.forEach(t => { map[t.category] = (map[t.category] || 0) + t.price })
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 3)
  }, [monthly])

  return (
    <div className="summary-card">
      <div className="summary-main">
        <span className="summary-label">{month} の支出合計</span>
        <strong className="summary-total">¥{total.toLocaleString()}</strong>
      </div>
      <div className="summary-cats">
        {byCategory.map(([cat, amt]) => (
          <span key={cat} className="summary-cat">
            {cat} <b>¥{amt.toLocaleString()}</b>
          </span>
        ))}
      </div>
    </div>
  )
}
