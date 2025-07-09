output "service_url" {
  description = "The URL of the Cloud Run service"
  value       = google_cloud_run_v2_service.disposal_estimate_api.uri
}

output "service_name" {
  description = "The name of the Cloud Run service"
  value       = google_cloud_run_v2_service.disposal_estimate_api.name
}

output "service_id" {
  description = "The ID of the Cloud Run service"
  value       = google_cloud_run_v2_service.disposal_estimate_api.id
}