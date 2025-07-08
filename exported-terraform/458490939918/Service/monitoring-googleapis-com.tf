resource "google_project_service" "monitoring_googleapis_com" {
  project = "disposal-estimate"
  service = "monitoring.googleapis.com"
}
# terraform import google_project_service.monitoring_googleapis_com disposal-estimate/monitoring.googleapis.com
