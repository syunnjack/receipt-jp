import { useEffect, useState } from 'react'

const STORAGE_KEY = 'receipt-budget.transactions'

// ローカルストレージから取引一覧を読み込む
function loadTransactions() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// 取引データ（商品名・金額・日付・カテゴリ）をlocalStorageに永続化して管理するフック
export function useTransactions() {
  const [transactions, setTransactions] = useState(loadTransactions)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
  }, [transactions])

  const addTransactions = (date, items) => {
    // 同じアップロード（同じレシート）由来の項目をreceiptIdでまとめておく
    // これにより後から「レシート単位の合計金額」を計算できる（重複検知に使用）
    const receiptId = crypto.randomUUID()
    const newTransactions = items.map((item) => ({
      id: crypto.randomUUID(),
      receiptId,
      date,
      name: item.name,
      price: item.price,
      category: item.category,
    }))
    setTransactions((prev) => [...newTransactions, ...prev])
  }

  const removeTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  return { transactions, addTransactions, removeTransaction }
}
