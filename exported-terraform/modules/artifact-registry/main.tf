# Artifact Registry Repository for Docker images
resource "google_artifact_registry_repository" "disposal_estimate_api" {
  project       = var.project_id
  location      = var.region
  repository_id = "disposal-estimate-api"
  description   = "Docker repository for disposal estimate API"
  format        = "DOCKER"

  cleanup_policies {
    id     = "keep-minimum-versions"
    action = "KEEP"
    
    most_recent_versions {
      keep_count = 10
    }
  }

  cleanup_policies {
    id     = "delete-old-versions"
    action = "DELETE"
    
    condition {
      older_than = "2592000s" # 30 days
    }
  }
}

# IAM binding for GitHub Actions service account
resource "google_artifact_registry_repository_iam_member" "github_actions_writer" {
  project    = var.project_id
  location   = var.region
  repository = google_artifact_registry_repository.disposal_estimate_api.name
  role       = "roles/artifactregistry.writer"
  member     = "serviceAccount:github-action-999236392@disposal-estimate.iam.gserviceaccount.com"
}