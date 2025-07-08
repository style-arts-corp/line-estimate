resource "google_project_service" "firebaseremoteconfigrealtime_googleapis_com" {
  project = "disposal-estimate"
  service = "firebaseremoteconfigrealtime.googleapis.com"
}
# terraform import google_project_service.firebaseremoteconfigrealtime_googleapis_com disposal-estimate/firebaseremoteconfigrealtime.googleapis.com
