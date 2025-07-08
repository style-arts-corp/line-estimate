resource "google_project_service" "logging_googleapis_com" {
  project = "disposal-estimate"
  service = "logging.googleapis.com"
}
# terraform import google_project_service.logging_googleapis_com disposal-estimate/logging.googleapis.com
