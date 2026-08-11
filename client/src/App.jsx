import { useMemo, useState } from 'react'
import './App.css'
import { useTransactions } from './hooks/useTransactions'
import { ReceiptUploader } from './components/ReceiptUploader'
import { CameraCapture } from './components/CameraCapture'
import { TransactionList } from './components/TransactionList'
import { CategoryPieChart } from './components/CategoryPieChart'
import { MonthlyBarChart } from './components/MonthlyBarChart'
import { BudgetPanel } from './components/BudgetPanel'
import { SummaryCard } from './components/SummaryCard'

const SAMPLE_DATA = [
  {id:'s1',receiptId:'r1',date:'2026-08-10',name:'牛乳',price:198,category:'食費'},
  {id:'s2',receiptId:'r1',date:'2026-08-10',name:'食パン',price:158,category:'食費'},
  {id:'s3',receiptId:'r1',date:'2026-08-10',name:'卵（10個）',price:248,category:'食費'},
  {id:'s4',receiptId:'r2',date:'2026-08-09',name:'シャンプー',price:680,category:'日用品'},
  {id:'s5',receiptId:'r2',date:'2026-08-09',name:'トイレットペーパー',price:498,category:'日用品'},
  {id:'s6',receiptId:'r3',date:'2026-08-08',name:'ランチセット',price:950,category:'外食'},
  {id:'s7',receiptId:'r4',date:'2026-08-07',name:'コーヒー豆',price:1280,category:'食費'},
  {id:'s8',receiptId:'r4',date:'2026-08-07',name:'チョコレート',price:320,category:'食費'},
  {id:'s9',receiptId:'r5',date:'2026-08-05',name:'電車代',price:540,category:'交通費'},
  {id:'s10',receiptId:'r6',date:'2026-08-04',name:'夕食（居酒屋）',price:2800,category:'外食'},
  {id:'s11',receiptId:'r7',date:'2026-08-03',name:'洗剤',price:398,category:'日用品'},
  {id:'s12',receiptId:'r7',date:'2026-08-03',name:'柔軟剤',price:480,category:'日用品'},
  {id:'s13',receiptId:'r8',date:'2026-08-02',name:'野菜セット',price:580,category:'食費'},
  {id:'s14',receiptId:'r9',date:'2026-08-01',name:'映画チケット',price:1900,category:'娯楽'},
  {id:'s15',receiptId:'r10',date:'2026-07-30',name:'ランニングシューズ',price:8800,category:'衣類'},
]

function exportCSV(transactions) {
  const header = '日付,商品名,カテゴリ,金額'
  const rows = transactions
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(t => `${t.date},${t.name},${t.category},${t.price}`)
  const csv = [header, ...rows].join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `家計簿_${new Date().toISOString().slice(0,7)}.csv`
  a.click(); URL.revokeObjectURL(url)
}

function App() {
  const { transactions, addTransactions, removeTransaction, loadSample } = useTransactions()
  const [filterCategory, setFilterCategory] = useState('すべて')
  const [filterMonth, setFilterMonth] = useState('')

  const categories = useMemo(() => {
    const cats = [...new Set(transactions.map(t => t.category))].sort()
    return ['すべて', ...cats]
  }, [transactions])

  const months = useMemo(() => {
    const ms = [...new Set(transactions.map(t => t.date.slice(0, 7)))].sort().reverse()
    return ms
  }, [transactions])

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      if (filterCategory !== 'すべて' && t.category !== filterCategory) return false
      if (filterMonth && !t.date.startsWith(filterMonth)) return false
      return true
    })
  }, [transactions, filterCategory, filterMonth])

  return (
    <div className="app">
      <h1>📄 レシート家計簿</h1>

      <div className="capture-methods">
        <ReceiptUploader transactions={transactions} onAnalyzed={addTransactions} />
        <CameraCapture transactions={transactions} onAnalyzed={addTransactions} />
      </div>

      {transactions.length === 0 && (
        <div className="empty-state">
          <p>レシートを読み込むか、サンプルデータで試してみましょう。</p>
          <button className="upload-button" onClick={() => loadSample(SAMPLE_DATA)}>
            📊 サンプルデータを読み込む
          </button>
        </div>
      )}

      {transactions.length > 0 && (
        <>
          <SummaryCard transactions={transactions} filterMonth={filterMonth} />

          <div className="charts">
            <CategoryPieChart transactions={filtered} />
            <MonthlyBarChart transactions={transactions} />
          </div>

          <BudgetPanel transactions={transactions} filterMonth={filterMonth || months[0]} />

          <div className="filter-bar">
            <label>
              カテゴリ
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label>
              月
              <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)}>
                <option value="">すべて</option>
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </label>
            <button className="export-btn" onClick={() => exportCSV(filtered)}>
              ⬇ CSV書き出し
            </button>
          </div>

          <TransactionList transactions={filtered} onRemove={removeTransaction} />
        </>
      )}
    </div>
  )
}

export default App
