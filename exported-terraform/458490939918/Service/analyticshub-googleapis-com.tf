resource "google_project_service" "analyticshub_googleapis_com" {
  project = "disposal-estimate"
  service = "analyticshub.googleapis.com"
}
# terraform import google_project_service.analyticshub_googleapis_com disposal-estimate/analyticshub.googleapis.com
