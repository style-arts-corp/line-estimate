resource "google_project_service" "bigqueryreservation_googleapis_com" {
  project = "disposal-estimate"
  service = "bigqueryreservation.googleapis.com"
}
# terraform import google_project_service.bigqueryreservation_googleapis_com disposal-estimate/bigqueryreservation.googleapis.com
