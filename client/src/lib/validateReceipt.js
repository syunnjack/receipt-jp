// Claude APIによる解析結果（レシートデータ）を検証し、警告メッセージの配列を返す
export function validateReceipt(date, items, existingTransactions) {
  const warnings = []

  const negativeItems = items.filter((item) => item.price < 0)
  if (negativeItems.length > 0) {
    const names = negativeItems.map((item) => `${item.name}（¥${item.price.toLocaleString()}）`).join('、')
    warnings.push(`金額が負の値の項目があります: ${names}`)
  }

  const total = items.reduce((sum, item) => sum + item.price, 0)
  if (isDuplicateReceipt(date, total, existingTransactions)) {
    warnings.push(
      `同じ日付（${date}）・合計金額（¥${total.toLocaleString()}）のレシートが既に登録されています。重複の可能性があります`,
    )
  }

  return warnings
}

// 既存の取引データから、同一日付・同一合計金額のレシートが登録済みかどうかを判定する
function isDuplicateReceipt(date, total, existingTransactions) {
  const totalsByReceipt = new Map()
  for (const t of existingTransactions) {
    if (t.date !== date) continue
    totalsByReceipt.set(t.receiptId, (totalsByReceipt.get(t.receiptId) || 0) + t.price)
  }
  return [...totalsByReceipt.values()].some((existingTotal) => existingTotal === total)
}
