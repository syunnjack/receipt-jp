import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

const COLORS = ['#aa3bff', '#ff8a3d', '#3dc9b0', '#ff5c8a', '#3d8bff', '#f4c542', '#8a5cff', '#5cd65c']

// カテゴリ別の支出合計を円グラフで表示するコンポーネント
export function CategoryPieChart({ transactions }) {
  const totalsByCategory = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.price
    return acc
  }, {})

  const labels = Object.keys(totalsByCategory)

  if (labels.length === 0) {
    return <p className="empty">グラフに表示するデータがありません</p>
  }

  const data = {
    labels,
    datasets: [
      {
        data: labels.map((label) => totalsByCategory[label]),
        backgroundColor: labels.map((_, i) => COLORS[i % COLORS.length]),
      },
    ],
  }

  return (
    <div className="chart-box">
      <h3>カテゴリ別支出</h3>
      <Pie data={data} />
    </div>
  )
}
