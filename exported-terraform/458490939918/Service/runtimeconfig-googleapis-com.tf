resource "google_project_service" "runtimeconfig_googleapis_com" {
  project = "disposal-estimate"
  service = "runtimeconfig.googleapis.com"
}
# terraform import google_project_service.runtimeconfig_googleapis_com disposal-estimate/runtimeconfig.googleapis.com
