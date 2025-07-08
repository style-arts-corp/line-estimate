resource "google_project_service" "serviceusage_googleapis_com" {
  project = "disposal-estimate"
  service = "serviceusage.googleapis.com"
}
# terraform import google_project_service.serviceusage_googleapis_com disposal-estimate/serviceusage.googleapis.com
