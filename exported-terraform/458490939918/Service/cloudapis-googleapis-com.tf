resource "google_project_service" "cloudapis_googleapis_com" {
  project = "disposal-estimate"
  service = "cloudapis.googleapis.com"
}
# terraform import google_project_service.cloudapis_googleapis_com disposal-estimate/cloudapis.googleapis.com
