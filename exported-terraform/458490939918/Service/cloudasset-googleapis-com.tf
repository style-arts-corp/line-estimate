resource "google_project_service" "cloudasset_googleapis_com" {
  project = "disposal-estimate"
  service = "cloudasset.googleapis.com"
}
# terraform import google_project_service.cloudasset_googleapis_com disposal-estimate/cloudasset.googleapis.com
