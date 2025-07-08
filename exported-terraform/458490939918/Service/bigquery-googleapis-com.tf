resource "google_project_service" "bigquery_googleapis_com" {
  project = "disposal-estimate"
  service = "bigquery.googleapis.com"
}
# terraform import google_project_service.bigquery_googleapis_com disposal-estimate/bigquery.googleapis.com
