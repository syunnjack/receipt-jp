import { useState } from 'react'
import { validateReceipt } from '../lib/validateReceipt'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// レシート画像（ファイル or カメラで撮影したBlob）をバックエンドに送信して解析し、
// 検証まで行う共通フック。ファイルアップロードとカメラ撮影の両方から利用する
export function useReceiptAnalysis(transactions, onAnalyzed) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [warnings, setWarnings] = useState([])

  const analyze = async (imageFile) => {
    setIsLoading(true)
    setError('')
    setWarnings([])

    try {
      const formData = new FormData()
      formData.append('receipt', imageFile, imageFile.name || 'receipt.jpg')

      const res = await fetch(`${API_URL}/api/analyze-receipt`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'レシートの解析に失敗しました')
      }

      const data = await res.json()
      setWarnings(validateReceipt(data.date, data.items, transactions))
      onAnalyzed(data.date, data.items)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, error, warnings, analyze }
}
