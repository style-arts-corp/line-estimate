# Line Estimate - 見積もりアプリケーション

Gin（Go）とNext.js（React）を使用した見積もり管理アプリケーションです。

## プロジェクト構成

```
line-estimate/
├── backend/           # Ginバックエンド
│   ├── main.go
│   ├── handlers/      # APIハンドラー
│   ├── models/        # データモデル
│   ├── middleware/    # ミドルウェア
│   ├── config/        # 設定
│   └── utils/         # ユーティリティ
├── frontend/          # Next.jsフロントエンド
│   └── src/
│       ├── pages/     # ページコンポーネント
│       ├── components/# UIコンポーネント
│       └── utils/     # ユーティリティ
└── docker-compose.yml # Docker設定
```

## 機能

- ユーザー認証（JWT）
- 見積もりの作成・編集・削除
- ユーザープロフィール管理
- RESTful API

## セットアップ手順

### 1. 前提条件

- Go 1.21以上
- Node.js 18以上
- Docker & Docker Compose（オプション）

### 2. 開発環境での起動

#### バックエンド
```bash
cd backend
go mod tidy
go run main.go
```

#### フロントエンド
```bash
cd frontend
npm install
npm run dev
```

### 3. Docker Composeでの起動

```bash
# 全サービスを一括起動
docker-compose up --build

# バックグラウンドで起動
docker-compose up -d --build
```

## API エンドポイント

### 認証
- `POST /api/v1/auth/login` - ログイン
- `POST /api/v1/auth/register` - ユーザー登録

### 見積もり（認証必要）
- `GET /api/v1/estimates` - 見積もり一覧取得
- `POST /api/v1/estimates` - 見積もり作成
- `GET /api/v1/estimates/:id` - 見積もり詳細取得
- `PUT /api/v1/estimates/:id` - 見積もり更新
- `DELETE /api/v1/estimates/:id` - 見積もり削除

### ユーザー（認証必要）
- `GET /api/v1/users/profile` - プロフィール取得
- `PUT /api/v1/users/profile` - プロフィール更新

## テスト用データ

### ログイン情報
- Email: `test@example.com`
- Password: `password123`

### API テスト例

```bash
# ヘルスチェック
curl http://localhost:8080/health

# ログイン
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 見積もり作成（要認証）
curl -X POST http://localhost:8080/api/v1/estimates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"新しい見積もり","description":"テスト","total_lines":1000,"hourly_rate":5000}'
```

## 環境変数

### バックエンド
- `PORT`: サーバーポート（デフォルト: 8080）
- `JWT_SECRET`: JWT署名用秘密鍵
- `DATABASE_URL`: PostgreSQL接続URL

### フロントエンド
- `NEXT_PUBLIC_API_URL`: バックエンドAPIのURL

## 開発

### バックエンドの開発
- `go run main.go` でホットリロード
- `go mod tidy` で依存関係の整理

### フロントエンドの開発
- `npm run dev` で開発サーバー起動
- `npm run build` でプロダクションビルド

## 今後の拡張予定

- [ ] データベース統合（PostgreSQL + GORM）
- [ ] フロントエンドUI実装
- [ ] ユーザー認証の強化
- [ ] テストの追加
- [ ] CI/CD設定

## ライセンス

MIT License