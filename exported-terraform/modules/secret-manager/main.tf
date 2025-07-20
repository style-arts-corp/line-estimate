# JWT Secret for API authentication
resource "google_secret_manager_secret" "jwt_secret" {
  project   = var.project_id
  secret_id = "jwt-secret"

  replication {
    auto {}
  }

  labels = {
    app         = "disposal-estimate-api"
    environment = "production"
  }
}

# JWT Secret version (initial placeholder)
resource "google_secret_manager_secret_version" "jwt_secret_version" {
  secret      = google_secret_manager_secret.jwt_secret.id
  secret_data = var.jwt_secret_value != "" ? var.jwt_secret_value : "REPLACE_ME_WITH_ACTUAL_SECRET"
}

# IAM binding for Cloud Run service account to access secrets
resource "google_secret_manager_secret_iam_member" "cloud_run_accessor" {
  project   = var.project_id
  secret_id = google_secret_manager_secret.jwt_secret.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:458490939918-compute@developer.gserviceaccount.com"
}

# IAM binding for GitHub Actions service account to manage secrets
resource "google_secret_manager_secret_iam_member" "github_actions_admin" {
  project   = var.project_id
  secret_id = google_secret_manager_secret.jwt_secret.secret_id
  role      = "roles/secretmanager.admin"
  member    = "serviceAccount:github-action-999236392@disposal-estimate.iam.gserviceaccount.com"
}

# Google Drive Service Account Key Secret
resource "google_secret_manager_secret" "google_drive_service_key" {
  project   = var.project_id
  secret_id = "google-drive-service-key"

  replication {
    auto {}
  }

  labels = {
    app         = "disposal-estimate-api"
    environment = "production"
  }
}

# Drive Service Account Key Secret (new)
resource "google_secret_manager_secret" "drive_service_account_key" {
  project   = var.project_id
  secret_id = "drive-service-account-key"

  replication {
    auto {}
  }

  labels = {
    app         = "disposal-estimate-api"
    environment = "production"
  }
}

# Google Drive Folder ID Secret
resource "google_secret_manager_secret" "google_drive_folder_id" {
  project   = var.project_id
  secret_id = "google-drive-folder-id"

  replication {
    auto {}
  }

  labels = {
    app         = "disposal-estimate-api"
    environment = "production"
  }
}

# IAM binding for Cloud Run to access Google Drive secrets
resource "google_secret_manager_secret_iam_member" "cloud_run_drive_key_accessor" {
  project   = var.project_id
  secret_id = google_secret_manager_secret.google_drive_service_key.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:458490939918-compute@developer.gserviceaccount.com"
}

# IAM binding for Cloud Run to access new drive service account key
resource "google_secret_manager_secret_iam_member" "cloud_run_new_drive_key_accessor" {
  project   = var.project_id
  secret_id = google_secret_manager_secret.drive_service_account_key.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:458490939918-compute@developer.gserviceaccount.com"
}

resource "google_secret_manager_secret_iam_member" "cloud_run_folder_id_accessor" {
  project   = var.project_id
  secret_id = google_secret_manager_secret.google_drive_folder_id.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:458490939918-compute@developer.gserviceaccount.com"
}

# IAM binding for GitHub Actions to manage Google Drive secrets
resource "google_secret_manager_secret_iam_member" "github_actions_drive_key_admin" {
  project   = var.project_id
  secret_id = google_secret_manager_secret.google_drive_service_key.secret_id
  role      = "roles/secretmanager.admin"
  member    = "serviceAccount:github-action-999236392@disposal-estimate.iam.gserviceaccount.com"
}

# IAM binding for GitHub Actions to access new drive service account key
resource "google_secret_manager_secret_iam_member" "github_actions_new_drive_key_accessor" {
  project   = var.project_id
  secret_id = google_secret_manager_secret.drive_service_account_key.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:github-action-999236392@disposal-estimate.iam.gserviceaccount.com"
}

resource "google_secret_manager_secret_iam_member" "github_actions_folder_id_admin" {
  project   = var.project_id
  secret_id = google_secret_manager_secret.google_drive_folder_id.secret_id
  role      = "roles/secretmanager.admin"
  member    = "serviceAccount:github-action-999236392@disposal-estimate.iam.gserviceaccount.com"
}