resource "google_project_service" "firebaseinstallations_googleapis_com" {
  project = "disposal-estimate"
  service = "firebaseinstallations.googleapis.com"
}
# terraform import google_project_service.firebaseinstallations_googleapis_com disposal-estimate/firebaseinstallations.googleapis.com
