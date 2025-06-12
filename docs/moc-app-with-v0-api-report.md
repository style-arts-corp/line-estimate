# moc-app-with-v0 API エンドポイント仕様書

## 概要

moc-app-with-v0 は廃棄品見積もりアプリケーションで、現在 Next.js のフルスタックアプリケーションとして実装されています。このドキュメントは、プロジェクトをフロントエンド（Next.js）とバックエンド（Go）に分割するために必要な API エンドポイントの仕様を定義します。

現在のアプリケーションは localStorage を使用してデータを管理していますが、バックエンド分離後は REST API を通してデータのやり取りを行います。

## アプリケーション機能分析

### 主要機能
1. **顧客情報管理** - 顧客の基本情報（名前、住所、電話番号、メール、廃棄予定日）
2. **廃棄品カテゴリ管理** - 椅子、机・テーブル、タンス・収納、家電製品、ベッド・寝具、その他
3. **アイテム選択・管理** - 既存アイテムの選択、カスタムアイテムの作成
4. **見積もり計算** - アイテムの数量・価格に基づく合計金額計算
5. **画像アップロード** - アイテムに写真を添付
6. **見積書生成** - 見積もり情報の確認・生成
7. **作業指示書作成** - 収集日・備考を含む作業指示書

### データモデル
- **Item**: 基本アイテム情報（id, name, price, category）
- **SelectedItem**: 選択されたアイテム（Item + quantity, customPrice, imageUrl）
- **Category**: カテゴリ情報（id, name, items[]）
- **CustomerInfo**: 顧客情報（name, address, phone, email, disposalDate）

## 必要な API エンドポイント仕様

### 1. カテゴリ・アイテム管理 API

#### 1.1 カテゴリ一覧取得
- **目的**: 廃棄品のカテゴリとアイテムの一覧を取得
- **エンドポイント**: `GET /api/categories`
- **Request**: なし
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "chairs",
      "name": "椅子",
      "items": [
        {
          "id": "pipe-chair",
          "name": "パイプ椅子",
          "price": 500,
          "category": "chairs"
        }
      ]
    }
  ]
}
```

#### 1.2 個別カテゴリ取得
- **目的**: 特定のカテゴリ情報を取得
- **エンドポイント**: `GET /api/categories/:categoryId`
- **Request**: パスパラメータ `categoryId`
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "chairs",
    "name": "椅子",
    "items": [...]
  }
}
```

### 2. 見積もり管理 API

#### 2.1 見積もり作成
- **目的**: 新しい見積もりを作成
- **エンドポイント**: `POST /api/estimates`
- **Request**:
```json
{
  "customerInfo": {
    "name": "山田太郎",
    "address": "東京都新宿区西新宿2-8-1",
    "phone": "03-1234-5678",
    "email": "yamada@example.com",
    "disposalDate": "2024-05-01"
  },
  "selectedItems": [
    {
      "id": "pipe-chair",
      "name": "パイプ椅子",
      "price": 500,
      "category": "chairs",
      "quantity": 2,
      "customPrice": 500,
      "imageUrl": "data:image/jpeg;base64,..."
    }
  ]
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "estimateId": "est_123456789",
    "totalAmount": 1000,
    "createdAt": "2024-05-01T10:00:00Z"
  }
}
```

#### 2.2 見積もり取得
- **目的**: 既存の見積もり情報を取得
- **エンドポイント**: `GET /api/estimates/:estimateId`
- **Request**: パスパラメータ `estimateId`
- **Response**:
```json
{
  "success": true,
  "data": {
    "estimateId": "est_123456789",
    "customerInfo": {...},
    "selectedItems": [...],
    "totalAmount": 1000,
    "status": "draft",
    "createdAt": "2024-05-01T10:00:00Z",
    "updatedAt": "2024-05-01T10:00:00Z"
  }
}
```

#### 2.3 見積もり更新
- **目的**: 既存の見積もりを更新
- **エンドポイント**: `PUT /api/estimates/:estimateId`
- **Request**: 見積もり作成と同じ形式
- **Response**:
```json
{
  "success": true,
  "data": {
    "estimateId": "est_123456789",
    "totalAmount": 1200,
    "updatedAt": "2024-05-01T11:00:00Z"
  }
}
```

#### 2.4 見積もり削除
- **目的**: 不要な見積もりを削除
- **エンドポイント**: `DELETE /api/estimates/:estimateId`
- **Request**: パスパラメータ `estimateId`
- **Response**:
```json
{
  "success": true,
  "message": "見積もりが削除されました"
}
```

### 3. 見積書生成 API

#### 3.1 見積書生成
- **目的**: 見積もりから正式な見積書を生成
- **エンドポイント**: `POST /api/estimates/:estimateId/quote`
- **Request**: パスパラメータ `estimateId`
- **Response**:
```json
{
  "success": true,
  "data": {
    "quoteId": "quote_123456789",
    "estimateId": "est_123456789",
    "quoteUrl": "https://example.com/quotes/quote_123456789.pdf",
    "status": "generated",
    "generatedAt": "2024-05-01T12:00:00Z"
  }
}
```

#### 3.2 見積書取得
- **目的**: 生成済み見積書の情報を取得
- **エンドポイント**: `GET /api/quotes/:quoteId`
- **Request**: パスパラメータ `quoteId`
- **Response**:
```json
{
  "success": true,
  "data": {
    "quoteId": "quote_123456789",
    "estimateId": "est_123456789",
    "quoteUrl": "https://example.com/quotes/quote_123456789.pdf",
    "status": "generated",
    "generatedAt": "2024-05-01T12:00:00Z"
  }
}
```

### 4. 作業指示書管理 API

#### 4.1 作業指示書作成
- **目的**: 見積もりから作業指示書を作成
- **エンドポイント**: `POST /api/estimates/:estimateId/instructions`
- **Request**:
```json
{
  "collectionDate": "2024-05-10 10:00",
  "notes": "2階建て住宅、階段が狭いため注意"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "instructionId": "inst_123456789",
    "estimateId": "est_123456789",
    "collectionDate": "2024-05-10 10:00",
    "notes": "2階建て住宅、階段が狭いため注意",
    "status": "created",
    "createdAt": "2024-05-01T13:00:00Z"
  }
}
```

#### 4.2 作業指示書取得
- **目的**: 作業指示書の情報を取得
- **エンドポイント**: `GET /api/instructions/:instructionId`
- **Request**: パスパラメータ `instructionId`
- **Response**:
```json
{
  "success": true,
  "data": {
    "instructionId": "inst_123456789",
    "estimateId": "est_123456789",
    "customerInfo": {...},
    "selectedItems": [...],
    "totalAmount": 1000,
    "collectionDate": "2024-05-10 10:00",
    "notes": "2階建て住宅、階段が狭いため注意",
    "status": "created",
    "createdAt": "2024-05-01T13:00:00Z"
  }
}
```

#### 4.3 作業指示書更新
- **目的**: 作業指示書の内容を更新
- **エンドポイント**: `PUT /api/instructions/:instructionId`
- **Request**:
```json
{
  "collectionDate": "2024-05-11 14:00",
  "notes": "変更：午後の回収に変更"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "instructionId": "inst_123456789",
    "collectionDate": "2024-05-11 14:00",
    "notes": "変更：午後の回収に変更",
    "updatedAt": "2024-05-01T14:00:00Z"
  }
}
```

### 5. ファイルアップロード API

#### 5.1 画像アップロード
- **目的**: アイテムの画像をアップロード
- **エンドポイント**: `POST /api/upload/image`
- **Request**: multipart/form-data
```
file: (画像ファイル)
estimateId: "est_123456789"
itemId: "pipe-chair"
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "imageUrl": "https://example.com/images/est_123456789_pipe-chair_timestamp.jpg",
    "fileSize": 1024000,
    "mimeType": "image/jpeg",
    "uploadedAt": "2024-05-01T15:00:00Z"
  }
}
```

#### 5.2 画像削除
- **目的**: アップロード済み画像を削除
- **エンドポイント**: `DELETE /api/upload/image`
- **Request**:
```json
{
  "imageUrl": "https://example.com/images/est_123456789_pipe-chair_timestamp.jpg"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "画像が削除されました"
}
```

### 6. カスタムアイテム管理 API

#### 6.1 カスタムアイテム作成
- **目的**: ユーザー定義のカスタムアイテムを作成
- **エンドポイント**: `POST /api/custom-items`
- **Request**:
```json
{
  "name": "大型冷蔵庫",
  "price": 6000,
  "category": "appliances",
  "estimateId": "est_123456789"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "custom-1714567890-abc123",
    "name": "大型冷蔵庫",
    "price": 6000,
    "category": "appliances",
    "createdAt": "2024-05-01T16:00:00Z"
  }
}
```

## エラーレスポンス形式

全ての API エンドポイントは以下の形式でエラーを返します：

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力データが無効です",
    "details": [
      {
        "field": "customerInfo.name",
        "message": "顧客名は必須です"
      }
    ]
  }
}
```

### 主要なエラーコード
- `VALIDATION_ERROR`: 入力データの検証エラー
- `NOT_FOUND`: リソースが見つからない
- `UNAUTHORIZED`: 認証が必要
- `FORBIDDEN`: アクセス権限がない
- `INTERNAL_SERVER_ERROR`: サーバー内部エラー

## 認証・セキュリティ

将来的な拡張として、以下の認証機能が必要になる可能性があります：

### 認証 API

#### ログイン
- **エンドポイント**: `POST /api/auth/login`
- **Request**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "山田太郎"
    }
  }
}
```

#### トークンリフレッシュ
- **エンドポイント**: `POST /api/auth/refresh`
- **Request**:
```json
{
  "refreshToken": "refresh_token_here"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "accessToken": "new_access_token_here"
  }
}
```

## データベース設計考慮事項

### 主要テーブル
1. **categories**: カテゴリマスタ
2. **items**: アイテムマスタ
3. **estimates**: 見積もり
4. **estimate_items**: 見積もりアイテム（多対多関係）
5. **quotes**: 見積書
6. **instructions**: 作業指示書
7. **uploaded_files**: アップロードファイル管理

### インデックス推奨
- estimates.created_at
- estimates.customer_email
- estimate_items.estimate_id
- uploaded_files.estimate_id

## 実装優先度

### 高優先度（MVP機能）
1. カテゴリ・アイテム管理 API
2. 見積もり管理 API（作成・取得・更新）
3. 基本的なファイルアップロード API

### 中優先度
1. 見積書生成 API
2. 作業指示書管理 API
3. カスタムアイテム管理 API

### 低優先度（将来拡張）
1. 認証・セキュリティ機能
2. ユーザー管理
3. 履歴・統計機能

## 移行戦略

1. **Phase 1**: 基本的な CRUD API の実装
2. **Phase 2**: ファイルアップロード機能の実装
3. **Phase 3**: PDF生成などの高度な機能
4. **Phase 4**: 認証・セキュリティ機能の追加

---

**注意**: この仕様書は現在の moc-app-with-v0 の機能を分析して作成されています。実際の実装時には、要件に応じて調整が必要になる場合があります。