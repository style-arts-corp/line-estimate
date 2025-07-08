resource "google_project_service" "firebase_googleapis_com" {
  project = "disposal-estimate"
  service = "firebase.googleapis.com"
}
# terraform import google_project_service.firebase_googleapis_com disposal-estimate/firebase.googleapis.com
