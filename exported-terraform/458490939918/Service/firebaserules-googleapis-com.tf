resource "google_project_service" "firebaserules_googleapis_com" {
  project = "disposal-estimate"
  service = "firebaserules.googleapis.com"
}
# terraform import google_project_service.firebaserules_googleapis_com disposal-estimate/firebaserules.googleapis.com
