# Disposal Estimate Terraform Configuration

このディレクトリには、廃棄品見積もりシステム（disposal-estimate）のGCPインフラストラクチャをTerraformで管理するための設定ファイルが含まれています。

## ディレクトリ構成

- `516907859942/Project/` - プロジェクトリソースの定義
- `458490939918/Service/` - 有効化されたGCP APIサービス
- `458490939918/458490939918/Project/LoggingLogSink/` - ロギング設定
- `projects/disposal-estimate/IAMServiceAccount/` - サービスアカウント

## セットアップ手順

### 1. GCP認証
```bash
gcloud auth login
gcloud auth application-default login
gcloud config set project disposal-estimate
```

### 2. Terraformの初期化
```bash
terraform init
```

### 3. 既存リソースのインポート

#### プロジェクトとサービスアカウント（完了済み）
```bash
terraform import module.project.google_project.disposal_estimate disposal-estimate
terraform import module.service_accounts.google_service_account.firebase_adminsdk_fbsvc projects/disposal-estimate/serviceAccounts/firebase-adminsdk-fbsvc@disposal-estimate.iam.gserviceaccount.com
terraform import module.service_accounts.google_service_account.github_action_999236392 projects/disposal-estimate/serviceAccounts/github-action-999236392@disposal-estimate.iam.gserviceaccount.com
```

#### APIサービスのインポート（必要に応じて）
```bash
# 例：BigQuery API
terraform import module.apis.google_project_service.bigquery_googleapis_com disposal-estimate/bigquery.googleapis.com

# 例：Firestore API
terraform import module.apis.google_project_service.firestore_googleapis_com disposal-estimate/firestore.googleapis.com
```

#### ログシンクのインポート（必要に応じて）
```bash
terraform import module.logging.google_logging_log_sink.a_default disposal-estimate###_Default
terraform import module.logging.google_logging_log_sink.a_required disposal-estimate###_Required
```

### 4. 状態の確認
```bash
terraform plan
```

## リモート状態管理（オプション）

GCSバケットでTerraformの状態を管理する場合：

1. バケットを作成
```bash
gsutil mb -p disposal-estimate gs://disposal-estimate-terraform-state
```

2. `backend.tf`のコメントを解除

3. バックエンドを初期化
```bash
terraform init -migrate-state
```

## 管理対象リソース

- GCPプロジェクト（disposal-estimate）
- Firebaseサービスアカウント
- GitHub Actionsサービスアカウント
- 各種GCP APIサービス（BigQuery、Firestore、Firebase等）
- ロギング設定（監査ログ、通常ログ）