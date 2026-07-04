import { useState } from 'react'
import { validateReceipt } from '../lib/validateReceipt'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// レシート画像をバックエンドに送信し、Claude APIによる解析結果を受け取るコンポーネント
export function ReceiptUploader({ transactions, onAnalyzed }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [warnings, setWarnings] = useState([])

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return

    setIsLoading(true)
    setError('')
    setWarnings([])

    try {
      const formData = new FormData()
      formData.append('receipt', file)

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

  return (
    <div className="receipt-uploader">
      <label className="upload-button">
        {isLoading ? '解析中...' : 'レシート画像をアップロード'}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isLoading}
          hidden
        />
      </label>
      {error && <p className="error">{error}</p>}
      {warnings.map((warning) => (
        <p key={warning} className="warning">
          ⚠️ {warning}
        </p>
      ))}
    </div>
  )
}
