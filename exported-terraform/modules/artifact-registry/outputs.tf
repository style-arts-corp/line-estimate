output "repository_url" {
  description = "The URL of the Artifact Registry repository"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.disposal_estimate_api.repository_id}"
}

output "repository_name" {
  description = "The name of the Artifact Registry repository"
  value       = google_artifact_registry_repository.disposal_estimate_api.name
}