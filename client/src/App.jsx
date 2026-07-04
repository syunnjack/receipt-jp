import './App.css'
import { useTransactions } from './hooks/useTransactions'
import { ReceiptUploader } from './components/ReceiptUploader'
import { CameraCapture } from './components/CameraCapture'
import { TransactionList } from './components/TransactionList'
import { CategoryPieChart } from './components/CategoryPieChart'
import { MonthlyBarChart } from './components/MonthlyBarChart'

function App() {
  const { transactions, addTransactions, removeTransaction } = useTransactions()

  return (
    <div className="app">
      <h1>レシート家計簿</h1>

      <div className="capture-methods">
        <ReceiptUploader transactions={transactions} onAnalyzed={addTransactions} />
        <CameraCapture transactions={transactions} onAnalyzed={addTransactions} />
      </div>

      <div className="charts">
        <CategoryPieChart transactions={transactions} />
        <MonthlyBarChart transactions={transactions} />
      </div>

      <TransactionList transactions={transactions} onRemove={removeTransaction} />
    </div>
  )
}

export default App
