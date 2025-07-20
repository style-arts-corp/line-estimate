# Google Drive API の有効化
resource "google_project_service" "drive_api" {
  project = var.project_id
  service = "drive.googleapis.com"
  
  disable_dependent_services = false
  disable_on_destroy        = false
}

# Google Drive 連携用のサービスアカウント
resource "google_service_account" "drive_service" {
  project      = var.project_id
  account_id   = "line-estimate-drive-service"
  display_name = "Line Estimate Drive Service"
  description  = "Service account for uploading PDFs to Google Drive"
}

# サービスアカウントキーの作成
resource "google_service_account_key" "drive_service_key" {
  service_account_id = google_service_account.drive_service.name
  key_algorithm     = "KEY_ALG_RSA_2048"
  # private_key_type  = "TYPE_GOOGLE_CREDENTIALS_FILE"
}

# サービスアカウントキーを Secret Manager に保存
resource "google_secret_manager_secret" "drive_service_key" {
  project   = var.project_id
  secret_id = "drive-service-account-key"
  
  labels = {
    service = "line-estimate"
    purpose = "google-drive-api"
  }
  
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "drive_service_key" {
  secret      = google_secret_manager_secret.drive_service_key.id
  secret_data = base64decode(google_service_account_key.drive_service_key.private_key)
}

# Cloud Run サービスアカウントに Secret Manager へのアクセス権限を付与
resource "google_secret_manager_secret_iam_member" "cloud_run_drive_key_accessor" {
  project   = var.project_id
  secret_id = google_secret_manager_secret.drive_service_key.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:458490939918-compute@developer.gserviceaccount.com"
  
  depends_on = [
    google_secret_manager_secret.drive_service_key
  ]
}

# GitHub Actions サービスアカウントに Secret Manager へのアクセス権限を付与
resource "google_secret_manager_secret_iam_member" "github_actions_drive_key_accessor" {
  project   = var.project_id
  secret_id = google_secret_manager_secret.drive_service_key.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:github-action-999236392@${var.project_id}.iam.gserviceaccount.com"
  
  depends_on = [
    google_secret_manager_secret.drive_service_key
  ]
}