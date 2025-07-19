# Google Drive連携セットアップガイド

このドキュメントでは、見積書PDFをGoogle Driveにアップロードするために必要な設定手順を説明します。

## 1. Google Cloud Consoleでの設定

### 1.1 プロジェクトの作成・選択
1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成するか、既存のプロジェクトを選択

### 1.2 Google Drive APIの有効化
1. 「APIとサービス」→「ライブラリ」に移動
2. "Google Drive API"を検索
3. 「Google Drive API」を選択し、「有効にする」をクリック

### 1.3 サービスアカウントの作成
1. 「IAMと管理」→「サービスアカウント」に移動
2. 「サービスアカウントを作成」をクリック
3. サービスアカウント名とIDを設定（例：line-estimate-drive-service）
4. 「作成して続行」をクリック
5. ロールは特に設定する必要なし（次へをクリック）
6. 「完了」をクリック

### 1.4 サービスアカウントキーの作成
1. 作成したサービスアカウントをクリック
2. 「キー」タブに移動
3. 「キーを追加」→「新しいキーを作成」をクリック
4. キーのタイプで「JSON」を選択
5. 「作成」をクリックしてJSONファイルをダウンロード

## 2. Google Driveでの権限設定

### 2.1 アップロード先フォルダの作成（オプション）
1. Google Driveで新しいフォルダを作成（例：「見積書PDF」）
2. フォルダIDをメモ（URLの最後の部分）

### 2.2 サービスアカウントへの権限付与
1. 作成したフォルダまたは共有したいGoogle Driveフォルダを右クリック
2. 「共有」を選択
3. サービスアカウントのメールアドレスを追加
   - メールアドレス形式：`サービスアカウント名@プロジェクト名.iam.gserviceaccount.com`
4. 権限を「編集者」に設定
5. 「送信」をクリック

## 3. アプリケーションでの環境変数設定

### 3.1 必須環境変数

```bash
# サービスアカウントキーのJSON内容（改行を\\nに置換）
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project-id",...}'

# アップロード先フォルダID（オプション）
GOOGLE_DRIVE_FOLDER_ID="your-folder-id-here"

# ローカルにもPDFを保存するかどうか（オプション）
SAVE_LOCAL_PDF="false"
```

### 3.2 .envファイルの設定例

```env
# Google Drive設定
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id","private_key_id":"key-id","private_key":"-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\\n-----END PRIVATE KEY-----\\n","client_email":"line-estimate-drive-service@your-project-id.iam.gserviceaccount.com","client_id":"client-id","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/line-estimate-drive-service%40your-project-id.iam.gserviceaccount.com"}
GOOGLE_DRIVE_FOLDER_ID=1a2b3c4d5e6f7g8h9i0j
SAVE_LOCAL_PDF=false
```

## 4. サービスアカウントキーの安全な管理

### 4.1 セキュリティ上の注意点
- JSONキーファイルは秘密情報です。Gitリポジトリにコミットしないでください
- 本番環境では環境変数や秘密管理システムを使用してください
- 不要になったキーは削除してください

### 4.2 本番環境での設定
- Docker環境：環境変数として設定
- Kubernetes：Secret リソースを使用
- クラウドサービス：各プラットフォームの秘密管理機能を利用

## 5. 動作確認

### 5.1 テストAPI実行
```bash
curl -X POST http://localhost:8080/api/pdf/test \
  -H "Content-Type: application/json"
```

### 5.2 期待されるレスポンス
```json
{
  "data": {
    "drive_file_id": "1a2b3c4d5e6f7g8h9i0j",
    "drive_url": "https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0j/view",
    "filename": "test_estimate_20250719_143025.pdf",
    "message": "テスト見積書PDFが正常に作成されました"
  },
  "status": "success"
}
```

## 6. トラブルシューティング

### 6.1 よくあるエラーと対処法

**エラー: "GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set"**
- 環境変数が設定されていません
- .envファイルの確認、環境変数の設定を確認してください

**エラー: "unable to parse service account key"**
- JSONの形式が正しくありません
- JSONの改行が正しく\\nでエスケープされているか確認してください

**エラー: "insufficient permissions"**
- サービスアカウントに適切な権限がありません
- Google Driveでサービスアカウントを共有設定に追加してください

**エラー: "folder not found"**
- 指定したフォルダIDが存在しないか、アクセス権限がありません
- フォルダIDの確認、権限設定を確認してください

### 6.2 ログの確認
アプリケーションのログでGoogle Drive APIのエラー詳細を確認できます。

## 7. API仕様

### 7.1 PDF作成エンドポイント

**POST /api/pdf/estimate**
見積書PDFを作成してGoogle Driveにアップロード

**POST /api/pdf/test**
テスト用PDFを作成してGoogle Driveにアップロード

### 7.2 レスポンス仕様
- `filename`: 作成されたPDFファイル名
- `drive_file_id`: Google DriveでのファイルID
- `drive_url`: Google DriveでのファイルURL（直接アクセス用）