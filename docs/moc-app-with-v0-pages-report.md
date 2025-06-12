# moc-app-with-v0 画面一覧レポート

## 概要
`/moc-app-with-v0` は廃棄品の見積もりを作成・管理するためのNext.jsアプリケーションです。App Router（Next.js 13+）を使用してルーティングが実装されています。

## 画面一覧

### 1. トップページ（見積もり作成画面）
- **パス名**: `/`
- **ファイル**: `/moc-app-with-v0/app/page.tsx`
- **受け取るクエリパラメータ**: なし
- **詳細な説明**: 
  - アプリケーションのメイン画面
  - 顧客情報の入力フォーム（名前、住所、電話番号、メール、廃棄予定日）
  - 廃棄品のカテゴリ別選択機能
  - カスタムアイテムの追加機能
  - 選択済みアイテムの数量・価格編集機能
  - アイテムの画像追加機能
  - リアルタイムでの合計金額計算・表示
  - 入力検証機能（必須項目チェック）
  - LocalStorageを使用したデータの永続化
  - 見積書生成ボタンで確認画面への遷移

### 2. 見積書確認画面
- **パス名**: `/confirmation`
- **ファイル**: `/moc-app-with-v0/app/confirmation/page.tsx`
- **受け取るクエリパラメータ**: なし（LocalStorageからデータを取得）
- **詳細な説明**: 
  - 入力された顧客情報の確認表示
  - 選択された廃棄品リストの詳細表示（画像付き）
  - 合計金額の表示
  - 見積書生成機能
  - 見積書生成後の外部リンク遷移（Google Drive）
    - 見積書PDF: `https://drive.google.com/file/d/1PjaDRt3vvEs4wBPKz0JMaTzcmMLrKPOl/view?usp=drive_link`
  - 作業指示書ページへの遷移機能
  - メイン画面（編集画面）への戻る機能

### 3. 作業指示書作成画面
- **パス名**: `/instructions`
- **ファイル**: `/moc-app-with-v0/app/instructions/page.tsx`
- **受け取るクエリパラメータ**: なし（LocalStorageからデータを取得）
- **詳細な説明**: 
  - 顧客情報の再表示
  - 収集日の入力フォーム
  - 備考・特記事項の入力フォーム（テキストエリア）
  - 廃棄品リストの表示（画像付き）
  - 合計金額の表示
  - 指示書の保存機能（LocalStorageに保存）
  - 保存後の外部リンク遷移機能
    - 指示書スプレッドシート: `https://docs.google.com/spreadsheets/d/1GwyUeSqpHi7qYJTYmyB2SswIkfp388pMyq9bgfKG9Jw/edit?usp=drive_link`
  - 見積書への遷移機能
  - 確認画面への戻る機能

## アプリケーション構造

### データフロー
1. **トップページ** → 顧客情報・廃棄品選択 → LocalStorageに保存
2. **確認画面** → データ確認・見積書生成 → 外部リンクまたは指示書画面へ
3. **指示書画面** → 追加情報入力・保存 → 外部リンクへ

### 使用している主要技術
- **フレームワーク**: Next.js 13+ (App Router)
- **UI**: Tailwind CSS + shadcn/ui コンポーネント
- **状態管理**: React useState + LocalStorage
- **ルーティング**: Next.js App Router
- **アイコン**: Lucide React

### 外部連携
- Google Drive（見積書PDF）
- Google Spreadsheet（指示書）

### データ型定義
主要なデータ型は `/moc-app-with-v0/lib/types.ts` で定義：
- `CustomerInfo`: 顧客情報
- `Item`: 廃棄品アイテム
- `SelectedItem`: 選択済みアイテム（数量・価格情報付き）
- `Category`: アイテムカテゴリ

## 画面遷移フロー
```
/ (トップ)
├── /confirmation (確認)
│   ├── 外部リンク: 見積書PDF
│   └── /instructions (指示書)
│       ├── 外部リンク: 指示書スプレッドシート
│       └── 外部リンク: 見積書PDF
└── 編集に戻る
```

---
**生成日時**: 2025年6月12日  
**対象アプリケーション**: moc-app-with-v0 (廃棄品見積もりアプリ)