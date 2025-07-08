resource "google_project_service" "bigquerymigration_googleapis_com" {
  project = "disposal-estimate"
  service = "bigquerymigration.googleapis.com"
}
# terraform import google_project_service.bigquerymigration_googleapis_com disposal-estimate/bigquerymigration.googleapis.com
