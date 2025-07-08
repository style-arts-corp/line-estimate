resource "google_project_service" "bigqueryconnection_googleapis_com" {
  project = "disposal-estimate"
  service = "bigqueryconnection.googleapis.com"
}
# terraform import google_project_service.bigqueryconnection_googleapis_com disposal-estimate/bigqueryconnection.googleapis.com
