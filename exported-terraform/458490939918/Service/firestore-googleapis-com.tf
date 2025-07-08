resource "google_project_service" "firestore_googleapis_com" {
  project = "disposal-estimate"
  service = "firestore.googleapis.com"
}
# terraform import google_project_service.firestore_googleapis_com disposal-estimate/firestore.googleapis.com
