# receipt-budget

## プロジェクト概要

レシート画像をアップロードするとClaude APIが内容を自動読み取りし、カテゴリ別に分類・集計する家計簿Webアプリ。

## Git運用ルール

- **コードに変更を加えるたびに、必ずGitHubへプッシュすること。**
  - 変更内容が小さくても、作業が一段落したタイミングでコミット & プッシュを行う。
  - コミットメッセージは変更内容が分かるように簡潔に記載する。
  - プッシュ前に `git status` / `git diff` で変更内容を確認する。
  - force push（`git push --force`）は明示的な指示がない限り行わない。

## 技術スタック

- フロントエンド: React 19 + Vite（`client/`）
- バックエンド: Node.js + Express（`server/`）
- Claude API: `@anthropic-ai/sdk`、モデルは `claude-haiku-4-5`
- グラフ描画: Chart.js（react-chartjs-2）
- データ永続化: ブラウザの localStorage（`receipt-budget.transactions` キー）
- APIキー: `server/.env` の `ANTHROPIC_API_KEY` で管理し、`.gitignore` で除外

### 主なコマンド

- サーバー: `cd server && npm run dev`
- クライアント: `cd client && npm run dev`

## コーディング規約

- コメントは日本語で記載する。
- Claude APIの呼び出しはバックエンド（`server/`）でのみ行い、ブラウザからAPIキーを直接使用しない。
