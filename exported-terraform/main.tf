terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = "disposal-estimate"
  region  = "asia-northeast1"
}

# プロジェクトリソース
module "project" {
  source = "./516907859942/Project"
}

# サービスアカウント
module "service_accounts" {
  source = "./projects/disposal-estimate/IAMServiceAccount"
}

# APIサービスの有効化（コメントアウト - 後で個別にインポート）
# module "apis" {
#   source = "./458490939918/Service"
# }

# ロギング設定（コメントアウト - エラーの原因）
# module "logging" {
#   source = "./458490939918/458490939918/Project/LoggingLogSink"
# }