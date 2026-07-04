import { useReceiptAnalysis } from '../hooks/useReceiptAnalysis'

// レシート画像ファイルをバックエンドに送信し、Claude APIによる解析結果を受け取るコンポーネント
export function ReceiptUploader({ transactions, onAnalyzed }) {
  const { isLoading, error, warnings, analyze } = useReceiptAnalysis(transactions, onAnalyzed)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    await analyze(file)
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
