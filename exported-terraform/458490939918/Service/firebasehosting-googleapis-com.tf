resource "google_project_service" "firebasehosting_googleapis_com" {
  project = "disposal-estimate"
  service = "firebasehosting.googleapis.com"
}
# terraform import google_project_service.firebasehosting_googleapis_com disposal-estimate/firebasehosting.googleapis.com
