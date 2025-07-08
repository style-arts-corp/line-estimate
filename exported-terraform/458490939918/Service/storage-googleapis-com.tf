resource "google_project_service" "storage_googleapis_com" {
  project = "disposal-estimate"
  service = "storage.googleapis.com"
}
# terraform import google_project_service.storage_googleapis_com disposal-estimate/storage.googleapis.com
