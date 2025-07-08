resource "google_project_service" "testing_googleapis_com" {
  project = "disposal-estimate"
  service = "testing.googleapis.com"
}
# terraform import google_project_service.testing_googleapis_com disposal-estimate/testing.googleapis.com
