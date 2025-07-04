# インフラストラクチャ構成

## 概要

廃棄品見積もりシステムのインフラストラクチャはGoogle Cloud Platform (GCP) 上に構築されています。本文書では、Terraformエクスポートから把握できる現在のインフラ構成について説明します。

## プロジェクト構成

### メインプロジェクト
- **プロジェクトID**: `disposal-estimate`
- **プロジェクト名**: disposal-estimate
- **組織ID**: 516907859942
- **請求アカウント**: 01E194-E561F0-D8CB93
- **Firebase**: 有効化済み

## サービスアカウント

### 1. Firebase Admin SDK サービスアカウント
- **アカウントID**: firebase-adminsdk-fbsvc
- **表示名**: firebase-adminsdk
- **説明**: Firebase Admin SDK Service Agent
- **用途**: Firebase Admin SDKを使用したバックエンドサービスの認証

### 2. GitHub Actions サービスアカウント
- **アカウントID**: github-action-999236392
- **表示名**: GitHub Actions (style-arts-corp/line-estimate)
- **説明**: Firebase HostingとCloud Functionsへのデプロイ権限を持つサービスアカウント
- **用途**: CI/CDパイプラインでの自動デプロイ

## 有効化されているGCPサービス

プロジェクトで有効化されている主要なサービス:

### Firebase関連
- `firebase.googleapis.com` - Firebase Core
- `firebasehosting.googleapis.com` - Firebase Hosting
- `firestore.googleapis.com` - Cloud Firestore
- `firebasedynamiclinks.googleapis.com` - Firebase Dynamic Links
- `firebaseinstallations.googleapis.com` - Firebase Installations
- `firebaseremoteconfig.googleapis.com` - Firebase Remote Config
- `firebaseremoteconfigrealtime.googleapis.com` - Firebase Remote Config Realtime
- `firebaserules.googleapis.com` - Firebase Security Rules
- `identitytoolkit.googleapis.com` - Firebase Authentication
- `fcm.googleapis.com` - Firebase Cloud Messaging
- `securetoken.googleapis.com` - Secure Token Service

### データストレージ
- `datastore.googleapis.com` - Cloud Datastore
- `storage.googleapis.com` - Cloud Storage
- `storage-api.googleapis.com` - Cloud Storage API
- `storage-component.googleapis.com` - Cloud Storage Component

### 分析・データ処理
- `bigquery.googleapis.com` - BigQuery
- `bigquerystorage.googleapis.com` - BigQuery Storage
- `bigqueryconnection.googleapis.com` - BigQuery Connection
- `bigquerydatapolicy.googleapis.com` - BigQuery Data Policy
- `bigquerymigration.googleapis.com` - BigQuery Migration
- `bigqueryreservation.googleapis.com` - BigQuery Reservation
- `analyticshub.googleapis.com` - Analytics Hub
- `dataform.googleapis.com` - Dataform
- `dataplex.googleapis.com` - Dataplex

### コンピューティング
- `appengine.googleapis.com` - App Engine

### 監視・ロギング
- `logging.googleapis.com` - Cloud Logging
- `monitoring.googleapis.com` - Cloud Monitoring
- `cloudtrace.googleapis.com` - Cloud Trace

### その他のサービス
- `cloudapis.googleapis.com` - Google Cloud APIs
- `cloudasset.googleapis.com` - Cloud Asset Inventory
- `cloudresourcemanager.googleapis.com` - Cloud Resource Manager
- `pubsub.googleapis.com` - Pub/Sub
- `runtimeconfig.googleapis.com` - Runtime Config
- `servicemanagement.googleapis.com` - Service Management
- `serviceusage.googleapis.com` - Service Usage
- `sql-component.googleapis.com` - Cloud SQL
- `testing.googleapis.com` - Cloud Testing

## ロギング構成

プロジェクトには2つのログシンクが設定されています：

### 1. Default ログシンク
- **名前**: _Default
- **宛先**: `logging.googleapis.com/projects/disposal-estimate/locations/global/buckets/_Default`
- **フィルター**: 監査ログとアクセス透明性ログを除く全てのログ

### 2. Required ログシンク
- **名前**: _Required
- **宛先**: `logging.googleapis.com/projects/disposal-estimate/locations/global/buckets/_Required`
- **フィルター**: 監査ログとアクセス透明性ログのみ

## インフラストラクチャの特徴

1. **Firebase統合**: プロジェクトはFirebaseと完全に統合されており、認証、データベース、ホスティングなどのFirebaseサービスを活用

2. **CI/CD**: GitHub Actionsを使用した自動デプロイパイプラインが構成済み

3. **データ分析基盤**: BigQueryおよび関連サービスが有効化されており、データ分析基盤が整備済み

4. **監視体制**: Cloud LoggingとMonitoringによる包括的な監視体制

5. **セキュリティ**: 監査ログの適切な管理と、サービスアカウントによる最小権限の原則の実施

## 今後の検討事項

1. インフラストラクチャのコード化（IaC）の推進
2. 環境別（開発、ステージング、本番）の分離
3. バックアップとディザスタリカバリの計画
4. コスト最適化の検討