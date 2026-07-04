import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

// 月別の支出合計を棒グラフで表示するコンポーネント
export function MonthlyBarChart({ transactions }) {
  const totalsByMonth = transactions.reduce((acc, t) => {
    const month = t.date.slice(0, 7) // YYYY-MM
    acc[month] = (acc[month] || 0) + t.price
    return acc
  }, {})

  const labels = Object.keys(totalsByMonth).sort()

  if (labels.length === 0) {
    return <p className="empty">グラフに表示するデータがありません</p>
  }

  const data = {
    labels,
    datasets: [
      {
        label: '支出合計',
        data: labels.map((label) => totalsByMonth[label]),
        backgroundColor: '#aa3bff',
      },
    ],
  }

  const options = {
    scales: { y: { beginAtZero: true } },
  }

  return (
    <div className="chart-box">
      <h3>月別支出</h3>
      <Bar data={data} options={options} />
    </div>
  )
}
