import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// レシート画像をバックエンドに送信し、Claude APIによる解析結果を受け取るコンポーネント
export function ReceiptUploader({ onAnalyzed }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return

    setIsLoading(true)
    setError('')

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
    </div>
  )
}
