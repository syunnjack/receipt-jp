// 登録済みの取引（商品名・金額・日付・カテゴリ）を一覧表示するコンポーネント
export function TransactionList({ transactions, onRemove }) {
  if (transactions.length === 0) {
    return <p className="empty">登録された取引はありません</p>
  }

  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <table className="transaction-table">
      <thead>
        <tr>
          <th>日付</th>
          <th>商品名</th>
          <th>カテゴリ</th>
          <th>金額</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((t) => (
          <tr key={t.id}>
            <td>{t.date}</td>
            <td>{t.name}</td>
            <td>{t.category}</td>
            <td className="price">¥{t.price.toLocaleString()}</td>
            <td>
              <button type="button" onClick={() => onRemove(t.id)} aria-label="削除">
                削除
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
