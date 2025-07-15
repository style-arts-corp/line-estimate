# Cloud Run API デプロイ計画

## 概要
disposal-estimateプロジェクトのGo Gin APIサーバーをCloud Runにデプロイする包括的な計画

## 現状分析

### backend ディレクトリ構成
```
backend/
├── Dockerfile              # マルチステージビルド対応
├── go.mod                  # Go 1.24、Ginフレームワーク
├── main.go                 # サーバーエントリポイント
├── handlers/               # API エンドポイント
│   ├── auth.go            # 認証（login/register）
│   ├── estimate.go        # 見積もりCRUD
│   └── health.go          # ヘルスチェック
├── middleware/            # ミドルウェア
│   ├── auth.go           # JWT認証
│   └── cors.go           # CORS設定
├── models/               # データモデル
│   ├── estimate.go
│   └── user.go
└── config/               # 設定管理
    └── config.go
```

### APIエンドポイント
- `GET /health` - ヘルスチェック
- `POST /api/v1/auth/login` - ログイン
- `POST /api/v1/auth/register` - ユーザー登録
- `GET /api/v1/estimates` - 見積もり一覧
- `POST /api/v1/estimates` - 見積もり作成
- `GET /api/v1/estimates/:id` - 見積もり詳細
- `PUT /api/v1/estimates/:id` - 見積もり更新
- `DELETE /api/v1/estimates/:id` - 見積もり削除
- `GET /api/v1/users/profile` - プロフィール取得
- `PUT /api/v1/users/profile` - プロフィール更新

## 実装計画

### Phase 1: Infrastructure Setup
1. **Cloud Run用Terraformリソース作成**
   - `modules/cloud-run/` ディレクトリ作成
   - Cloud Runサービス定義
   - IAM権限設定
   - Cloud SQL（データベース）設定
   - Secret Manager設定

2. **必要なGCP APIの有効化**
   - Cloud Run API
   - Container Registry API / Artifact Registry API
   - Cloud SQL API
   - Secret Manager API

### Phase 2: Container Registry Setup
1. **Artifact Registry作成**
   - Docker イメージ用リポジトリ
   - プライベートレジストリ設定
   - IAM権限設定

2. **イメージビルド・プッシュ設定**
   - Cloud Buildトリガー設定
   - GitHub連携設定

### Phase 3: Secret Management
1. **Secret Manager設定**
   - JWT秘密鍵
   - 外部API キー（必要に応じて）

2. **環境変数設定**
   - Cloud Run環境変数
   - シークレット参照設定

### Phase 4: Cloud Run Service
1. **サービス設定**
   - メモリ・CPU設定
   - 最小・最大インスタンス数
   - リクエストタイムアウト
   - 並行性設定

2. **ネットワーク設定**
   - カスタムドメイン設定
   - SSL証明書（Google Managed）
   - Cloud Armor（WAF）

### Phase 5: CI/CD Pipeline

#### 1. GitHub Actions ワークフロー設定

**ファイル構成**
```
.github/
└── workflows/
    ├── deploy-dev.yml      # 開発環境デプロイ
    ├── deploy-staging.yml  # ステージング環境デプロイ
    ├── deploy-prod.yml     # 本番環境デプロイ
    └── build-test.yml      # ビルド・テスト
```

**メインワークフロー (.github/workflows/deploy.yml)**
```yaml
name: Deploy to Cloud Run

on:
  push:
    branches:
      - main      # 本番環境
      - develop   # 開発環境
    paths:
      - 'backend/**'  # backendディレクトリの変更時のみ
  pull_request:
    branches:
      - main
    paths:
      - 'backend/**'

env:
  PROJECT_ID: disposal-estimate
  REGION: asia-northeast1
  SERVICE_NAME: disposal-estimate-api

jobs:
  test:
    name: Run Tests
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Go
        uses: actions/setup-go@v4
        with:
          go-version: '1.24'

      - name: Cache Go modules
        uses: actions/cache@v3
        with:
          path: ~/go/pkg/mod
          key: ${{ runner.os }}-go-${{ hashFiles('**/go.sum') }}
          restore-keys: |
            ${{ runner.os }}-go-

      - name: Install dependencies
        working-directory: ./backend
        run: go mod download

      - name: Run tests
        working-directory: ./backend
        run: go test -v ./...

      - name: Run security scan
        working-directory: ./backend
        run: |
          go install golang.org/x/vuln/cmd/govulncheck@latest
          govulncheck ./...

  build-and-deploy:
    name: Build and Deploy
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}

      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v1

      - name: Configure Docker for Artifact Registry
        run: |
          gcloud auth configure-docker ${{ env.REGION }}-docker.pkg.dev

      - name: Determine environment
        id: env
        run: |
          if [[ "${{ github.ref }}" == "refs/heads/main" ]]; then
            echo "ENV=prod" >> $GITHUB_OUTPUT
            echo "SERVICE_NAME=disposal-estimate-api" >> $GITHUB_OUTPUT
          elif [[ "${{ github.ref }}" == "refs/heads/develop" ]]; then
            echo "ENV=dev" >> $GITHUB_OUTPUT
            echo "SERVICE_NAME=disposal-estimate-api-dev" >> $GITHUB_OUTPUT
          fi

      - name: Build Docker image
        working-directory: ./backend
        run: |
          IMAGE_TAG=${{ env.REGION }}-docker.pkg.dev/${{ env.PROJECT_ID }}/disposal-estimate-api/${{ steps.env.outputs.SERVICE_NAME }}:${{ github.sha }}
          docker build -t $IMAGE_TAG .
          echo "IMAGE_TAG=$IMAGE_TAG" >> $GITHUB_ENV

      - name: Push Docker image
        run: |
          docker push ${{ env.IMAGE_TAG }}

      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy ${{ steps.env.outputs.SERVICE_NAME }} \
            --image ${{ env.IMAGE_TAG }} \
            --region ${{ env.REGION }} \
            --platform managed \
            --allow-unauthenticated \
            --memory 512Mi \
            --cpu 1 \
            --min-instances 0 \
            --max-instances 10 \
            --port 8080 \
            --set-env-vars="GIN_MODE=release" \
            --timeout 300

      - name: Get service URL
        id: url
        run: |
          URL=$(gcloud run services describe ${{ steps.env.outputs.SERVICE_NAME }} \
            --region ${{ env.REGION }} \
            --format 'value(status.url)')
          echo "SERVICE_URL=$URL" >> $GITHUB_OUTPUT

      - name: Health check
        run: |
          sleep 30  # サービス起動待ち
          curl -f ${{ steps.url.outputs.SERVICE_URL }}/health || exit 1

  notify:
    name: Notify deployment
    needs: build-and-deploy
    runs-on: ubuntu-latest
    if: always()
    
    steps:
      - name: Notify success
        if: needs.build-and-deploy.result == 'success'
        run: |
          echo "✅ Deployment successful"
          # Slack/Discord通知などを追加可能

      - name: Notify failure
        if: needs.build-and-deploy.result == 'failure'
        run: |
          echo "❌ Deployment failed"
          # 失敗通知を追加可能
```

**プルリクエスト用ワークフロー (.github/workflows/pr-check.yml)**
```yaml
name: PR Check

on:
  pull_request:
    branches:
      - main
      - develop
    paths:
      - 'backend/**'

jobs:
  test-and-build:
    name: Test and Build Check
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Go
        uses: actions/setup-go@v4
        with:
          go-version: '1.24'

      - name: Install dependencies
        working-directory: ./backend
        run: go mod download

      - name: Run tests
        working-directory: ./backend
        run: go test -v ./...

      - name: Build check
        working-directory: ./backend
        run: |
          docker build -t test-build .

      - name: Security scan
        working-directory: ./backend
        run: |
          go install golang.org/x/vuln/cmd/govulncheck@latest
          govulncheck ./...

      - name: Comment PR
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '✅ ビルドとテストが正常に完了しました！'
            });
```

#### 2. GitHub Secrets設定

**必要なシークレット**
```
GCP_SA_KEY: サービスアカウントキー（JSON形式）
PROJECT_ID: disposal-estimate
REGION: asia-northeast1
```

**サービスアカウント権限**
- Cloud Run Admin
- Artifact Registry Writer
- Storage Admin
- Service Account User

#### 3. 環境別デプロイ設定

**ブランチ戦略**
- `main` → 本番環境 (disposal-estimate-api)
- `develop` → 開発環境 (disposal-estimate-api-dev)
- `feature/*` → PR作成時テストのみ実行

**環境変数の管理**
```yaml
# 本番環境
env:
  GIN_MODE: release
  LOG_LEVEL: info
  JWT_SECRET: ${{ secrets.JWT_SECRET_PROD }}

# 開発環境  
env:
  GIN_MODE: debug
  LOG_LEVEL: debug
  JWT_SECRET: ${{ secrets.JWT_SECRET_DEV }}
```

#### 4. デプロイメント戦略

**ゼロダウンタイムデプロイ**
- Cloud Runの gradual rollout機能使用
- ヘルスチェック完了後トラフィック切り替え
- 自動ロールバック設定

**カナリアリリース（将来対応）**
```yaml
- name: Deploy with traffic split
  run: |
    # 新バージョンに10%のトラフィックを割り当て
    gcloud run services update-traffic ${{ env.SERVICE_NAME }} \
      --to-revisions=$NEW_REVISION=10 \
      --region ${{ env.REGION }}
```

#### 5. モニタリング・アラート

**デプロイ後チェック**
```yaml
- name: Comprehensive health check
  run: |
    # ヘルスチェック
    curl -f $SERVICE_URL/health
    
    # APIエンドポイントテスト
    curl -f $SERVICE_URL/api/v1/health
    
    # レスポンス時間チェック
    time curl -s $SERVICE_URL/health
```

**失敗時の対応**
```yaml
- name: Rollback on failure
  if: failure()
  run: |
    # 前のリビジョンにロールバック
    gcloud run services update-traffic ${{ env.SERVICE_NAME }} \
      --to-latest \
      --region ${{ env.REGION }}
```

#### 6. セキュリティ設定

**イメージスキャン**
```yaml
- name: Scan Docker image
  run: |
    # 脆弱性スキャン
    gcloud beta container images scan ${{ env.IMAGE_TAG }}
```

**シークレット管理**
```yaml
- name: Update secrets
  run: |
    # Secret Managerの値を環境変数として設定
    gcloud run services update ${{ env.SERVICE_NAME }} \
      --update-secrets JWT_SECRET=jwt-secret:latest \
      --region ${{ env.REGION }}
```

### Phase 6: Monitoring & Logging
1. **Cloud Monitoring**
   - カスタムメトリクス設定
   - アラート設定
   - ダッシュボード作成

2. **Cloud Logging**
   - 構造化ログ設定
   - ログ集約・分析

## ディレクトリ構成

### Terraform構成（想定）
```
exported-terraform/
├── main.tf
├── variables.tf
├── backend.tf
├── modules/
│   ├── cloud-run/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── database/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── registry/
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
└── environments/
    ├── dev/
    │   └── terraform.tfvars
    ├── staging/
    │   └── terraform.tfvars
    └── prod/
        └── terraform.tfvars
```

## 必要なリソース

### 1. Artifact Registry
```hcl
resource "google_artifact_registry_repository" "disposal_estimate_api" {
  repository_id = "disposal-estimate-api"
  location      = var.region
  format        = "DOCKER"
  description   = "Docker repository for disposal estimate API"
}
```

### 2. Cloud Run Service
```hcl
resource "google_cloud_run_service" "disposal_estimate_api" {
  name     = "disposal-estimate-api"
  location = var.region
  
  template {
    spec {
      containers {
        image = "${var.artifact_registry_url}/disposal-estimate-api:latest"
        
        env {
          name  = "GIN_MODE"
          value = "release"
        }
        
        env {
          name = "JWT_SECRET"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.jwt_secret.secret_id
              key  = "latest"
            }
          }
        }
        
        resources {
          limits = {
            memory = "512Mi"
            cpu    = "1000m"
          }
        }
      }
    }
  }
}
```

### 3. Secret Manager
```hcl
resource "google_secret_manager_secret" "jwt_secret" {
  secret_id = "jwt-secret"
  
  replication {
    automatic = true
  }
}
```

### 4. IAM権限
```hcl
resource "google_cloud_run_service_iam_member" "public_access" {
  service  = google_cloud_run_service.disposal_estimate_api.name
  location = google_cloud_run_service.disposal_estimate_api.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}
```

## 環境変数設定

### Cloud Run環境変数
- `PORT`: 8080 (Cloud Run default)
- `GIN_MODE`: release
- `JWT_SECRET`: Secret Manager参照

## セキュリティ考慮事項

1. **ネットワークセキュリティ**
   - HTTPS通信（in transit）
   - Cloud Armorによる保護（必要に応じて）

2. **認証・認可**
   - JWT トークンベース認証
   - Secret Manager によるシークレット管理
   - IAM 最小権限の原則

3. **コンテナセキュリティ**
   - 脆弱性スキャン
   - 非rootユーザーでの実行
   - 最小限のベースイメージ使用

## コスト見積もり

### 月額コスト概算（東京リージョン）
- Cloud Run: $5-20 (リクエスト数による)
- Artifact Registry: $0.10/GB
- Secret Manager: $0.06/10,000 requests
- Load Balancer: $18-25 (カスタムドメイン使用時)
- **合計**: $25-45/月

## 実装スケジュール

### Week 1: Infrastructure Setup
- Day 1-2: Terraform モジュール作成
- Day 3-4: Artifact Registry セットアップ
- Day 5: Secret Manager セットアップ

### Week 2: Application Deployment
- Day 1-2: Cloud Run サービス設定
- Day 3-4: GitHub Actions CI/CD パイプライン構築
- Day 5: テスト・デバッグ

### Week 3: Production Readiness
- Day 1-2: モニタリング・アラート設定
- Day 3-4: セキュリティ設定・テスト
- Day 5: ドキュメント作成・引き継ぎ

## リスクと対策

### リスク
1. **Cold Start問題**: 初回リクエストの遅延
2. **GitHub Actions権限**: 過度な権限設定
3. **コスト増加**: 予想以上のトラフィック

### 対策
1. **Cloud Run設定**: 最小インスタンス数設定、軽量なGoアプリで起動時間短縮
2. **最小権限設定**: 必要最小限のIAM権限、Workload Identity使用
3. **コスト管理**: 予算アラート、オートスケーリング調整

## 次のアクション

1. ✅ Phase 1: Infrastructure Setupの開始
   - Cloud Run用Terraformモジュール作成
   - 必要なAPIの有効化確認
   
2. 📋 GitHub Actions設定
   - サービスアカウント作成・権限設定
   - GitHub Secretsの設定
   - ワークフロー作成

3. 📋 環境変数・シークレットの整理
   - JWT秘密鍵の生成・設定
   - Secret Manager設定
   - 本番/開発環境の分離