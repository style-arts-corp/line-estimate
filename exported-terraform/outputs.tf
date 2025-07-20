# Artifact Registry outputs
output "artifact_registry_url" {
  description = "The URL of the Artifact Registry repository"
  value       = module.artifact_registry.repository_url
}

# Secret Manager outputs
output "jwt_secret_id" {
  description = "The ID of the JWT secret"
  value       = module.secret_manager.jwt_secret_id
}

# Cloud Run outputs (一時的に無効化)
# output "api_url" {
#   description = "The URL of the disposal estimate API"
#   value       = module.cloud_run.service_url
# }

# output "cloud_run_service_name" {
#   description = "The name of the Cloud Run service"
#   value       = module.cloud_run.service_name
# }

# Google Drive Service Account outputs
output "drive_service_account_email" {
  description = "The email address of the Google Drive service account"
  value       = google_service_account.drive_service.email
  sensitive   = false
}

output "drive_service_account_id" {
  description = "The ID of the Google Drive service account"
  value       = google_service_account.drive_service.id
  sensitive   = false
}

output "drive_service_key_secret_id" {
  description = "The Secret Manager secret ID for the Google Drive service account key"
  value       = google_secret_manager_secret.drive_service_key.secret_id
  sensitive   = false
}