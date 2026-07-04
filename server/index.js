import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import Anthropic from '@anthropic-ai/sdk'

const app = express()
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } })
const anthropic = new Anthropic()

// フロントエンド（Vite開発サーバー）からのアクセスを許可
app.use(cors())

const CATEGORIES = ['食費', '日用品', '外食', '交通費', '娯楽', '医療', '衣服', 'その他']

// レシート抽出結果のJSONスキーマ。Claudeにこの形式で返答させる
const receiptSchema = {
  type: 'object',
  properties: {
    date: {
      type: 'string',
      description: 'レシートに記載された購入日（YYYY-MM-DD形式）。読み取れない場合は今日の日付を推定して入れる',
    },
    items: {
      type: 'array',
      description: 'レシートに記載された商品の一覧',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', description: '商品名' },
          price: { type: 'integer', description: '金額（円、税込み）' },
          category: { type: 'string', enum: CATEGORIES, description: '商品のカテゴリ' },
        },
        required: ['name', 'price', 'category'],
        additionalProperties: false,
      },
    },
  },
  required: ['date', 'items'],
  additionalProperties: false,
}

app.post('/api/analyze-receipt', upload.single('receipt'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'レシート画像が送信されていません' })
  }

  const mediaType = req.file.mimetype
  const base64Data = req.file.buffer.toString('base64')

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 2048,
      output_config: { format: { type: 'json_schema', schema: receiptSchema } },
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64Data } },
            {
              type: 'text',
              text: 'この画像はレシート（領収書）です。購入日と、記載されている各商品の商品名・金額・カテゴリを抽出してください。カテゴリは指定した選択肢の中から最も適切なものを選んでください。',
            },
          ],
        },
      ],
    })

    if (response.stop_reason === 'refusal') {
      return res.status(422).json({ error: 'レシートの読み取りを行えませんでした' })
    }

    const textBlock = response.content.find((block) => block.type === 'text')
    const parsed = JSON.parse(textBlock.text)

    res.json(parsed)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'レシートの解析中にエラーが発生しました' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`receipt-budget server listening on http://localhost:${PORT}`)
})
