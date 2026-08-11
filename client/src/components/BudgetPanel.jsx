import { useMemo, useState } from 'react'

const BUDGET_KEY = 'receipt-budget.budgets'

const DEFAULT_BUDGETS = {
  '食費': 30000,
  '外食': 15000,
  '日用品': 10000,
  '交通費': 10000,
  '娯楽': 10000,
  '衣類': 10000,
}

function loadBudgets() {
  try { return JSON.parse(localStorage.getItem(BUDGET_KEY)) || DEFAULT_BUDGETS }
  catch { return DEFAULT_BUDGETS }
}

export function BudgetPanel({ transactions, filterMonth }) {
  const [budgets, setBudgets] = useState(loadBudgets)
  const [editing, setEditing] = useState(null)

  const month = filterMonth || new Date().toISOString().slice(0, 7)
  const monthly = useMemo(() =>
    transactions.filter(t => t.date.startsWith(month)),
    [transactions, month]
  )
  const spending = useMemo(() => {
    const map = {}
    monthly.forEach(t => { map[t.category] = (map[t.category] || 0) + t.price })
    return map
  }, [monthly])

  const save = (cat, val) => {
    const n = parseInt(val, 10)
    if (!isNaN(n) && n >= 0) {
      const next = { ...budgets, [cat]: n }
      setBudgets(next)
      localStorage.setItem(BUDGET_KEY, JSON.stringify(next))
    }
    setEditing(null)
  }

  const rows = Object.entries(budgets).map(([cat, budget]) => {
    const spent = spending[cat] || 0
    const pct = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0
    const over = spent > budget
    return { cat, budget, spent, pct, over }
  })

  return (
    <div className="budget-panel">
      <h2 className="budget-title">📊 {month} 予算管理</h2>
      <div className="budget-list">
        {rows.map(({ cat, budget, spent, pct, over }) => (
          <div key={cat} className={`budget-row ${over ? 'over' : ''}`}>
            <div className="budget-row-head">
              <span className="budget-cat">{cat}</span>
              <span className="budget-amounts">
                ¥{spent.toLocaleString()} /
                {editing === cat ? (
                  <input
                    type="number" defaultValue={budget} className="budget-input"
                    onBlur={e => save(cat, e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && save(cat, e.target.value)}
                    autoFocus
                  />
                ) : (
                  <button className="budget-edit-btn" onClick={() => setEditing(cat)}>
                    ¥{budget.toLocaleString()}
                  </button>
                )}
              </span>
            </div>
            <div className="budget-bar-bg">
              <div className="budget-bar-fill" style={{ width: `${pct}%`, background: over ? '#ef4444' : '#22c55e' }} />
            </div>
            {over && <small className="over-msg">⚠ ¥{(spent - budget).toLocaleString()} オーバー</small>}
          </div>
        ))}
      </div>
      <p className="budget-hint">金額をクリックして予算を編集できます</p>
    </div>
  )
}
