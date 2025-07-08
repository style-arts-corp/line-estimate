resource "google_project_service" "datastore_googleapis_com" {
  project = "disposal-estimate"
  service = "datastore.googleapis.com"
}
# terraform import google_project_service.datastore_googleapis_com disposal-estimate/datastore.googleapis.com
