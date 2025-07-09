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

# APIサービスの有効化
module "apis" {
  source = "./458490939918/Service"
}

# Artifact Registry
module "artifact_registry" {
  source = "./modules/artifact-registry"
  
  project_id = var.project_id
  region     = var.region
}

# Secret Manager
module "secret_manager" {
  source = "./modules/secret-manager"
  
  project_id = var.project_id
}

# Cloud Run
module "cloud_run" {
  source = "./modules/cloud-run"
  
  project_id            = var.project_id
  region                = var.region
  artifact_registry_url = module.artifact_registry.repository_url
  jwt_secret_id         = module.secret_manager.jwt_secret_id
  # initial_image         = "asia-northeast1-docker.pkg.dev/disposal-estimate/disposal-estimate-api/disposal-estimate-api:amd64"
}

# ロギング設定（システムデフォルトのため管理対象外）
# module "logging" {
#   source = "./458490939918/458490939918/Project/LoggingLogSink"
# }