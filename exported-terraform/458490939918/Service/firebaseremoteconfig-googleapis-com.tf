resource "google_project_service" "firebaseremoteconfig_googleapis_com" {
  project = "disposal-estimate"
  service = "firebaseremoteconfig.googleapis.com"
}
# terraform import google_project_service.firebaseremoteconfig_googleapis_com disposal-estimate/firebaseremoteconfig.googleapis.com
