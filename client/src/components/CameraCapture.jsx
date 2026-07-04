import { useEffect, useRef, useState } from 'react'
import { useReceiptAnalysis } from '../hooks/useReceiptAnalysis'

// カメラのライブ映像を表示し、シャッターボタンで撮影してレシートを解析するコンポーネント
export function CameraCapture({ transactions, onAnalyzed }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [cameraError, setCameraError] = useState('')
  const { isLoading, error, warnings, analyze } = useReceiptAnalysis(transactions, onAnalyzed)

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setIsCameraOpen(false)
  }

  const openCamera = async () => {
    setCameraError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })
      streamRef.current = stream
      setIsCameraOpen(true)
    } catch {
      setCameraError('カメラを起動できませんでした。カメラへのアクセスを許可してください')
    }
  }

  // カメラ映像のstreamを<video>要素に接続する
  useEffect(() => {
    if (isCameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
    }
  }, [isCameraOpen])

  // 画面を離れるときはカメラを必ず停止する
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  const handleCapture = async () => {
    const video = videoRef.current
    if (!video) return

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92))
    if (!blob) return

    stopCamera()
    await analyze(blob)
  }

  return (
    <div className="camera-capture">
      {!isCameraOpen ? (
        <button type="button" className="upload-button" onClick={openCamera}>
          カメラで撮影
        </button>
      ) : (
        <div className="camera-preview">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video ref={videoRef} autoPlay playsInline muted />
          <div className="camera-controls">
            <button type="button" onClick={handleCapture} disabled={isLoading}>
              {isLoading ? '解析中...' : 'シャッター'}
            </button>
            <button type="button" onClick={stopCamera} disabled={isLoading}>
              キャンセル
            </button>
          </div>
        </div>
      )}
      {cameraError && <p className="error">{cameraError}</p>}
      {error && <p className="error">{error}</p>}
      {warnings.map((warning) => (
        <p key={warning} className="warning">
          ⚠️ {warning}
        </p>
      ))}
    </div>
  )
}
