# レシート家計簿

レシート画像をアップロードすると、Claude API（Claude Haiku）が商品名・金額・日付を自動で読み取り、カテゴリ別に分類・集計する家計簿Webアプリです。

## 機能

- レシート画像のアップロード → Claude APIによる自動読み取り
- 商品名・金額・日付の一覧表示
- カテゴリ別（食費・日用品・外食など）の自動分類・集計
- Chart.jsによるカテゴリ別円グラフ・月別棒グラフ
- 登録データはブラウザのlocalStorageに保存（リロードしても消えない）

## 構成

- `client/` — React (Vite) フロントエンド
- `server/` — Node.js (Express) バックエンド。Claude APIの呼び出しはここでのみ行い、APIキーをブラウザに公開しない

## セットアップ

### 1. サーバー

```sh
cd server
npm install
cp .env.example .env   # .env を編集してANTHROPIC_API_KEYを設定
npm run dev
```

### 2. クライアント

```sh
cd client
npm install
npm run dev
```

ブラウザで `http://localhost:5173` を開いてください。
