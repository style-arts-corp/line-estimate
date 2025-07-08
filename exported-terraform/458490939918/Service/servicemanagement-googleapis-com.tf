resource "google_project_service" "servicemanagement_googleapis_com" {
  project = "disposal-estimate"
  service = "servicemanagement.googleapis.com"
}
# terraform import google_project_service.servicemanagement_googleapis_com disposal-estimate/servicemanagement.googleapis.com
