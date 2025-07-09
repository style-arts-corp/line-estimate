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