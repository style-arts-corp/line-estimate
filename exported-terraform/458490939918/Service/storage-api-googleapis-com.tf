resource "google_project_service" "storage_api_googleapis_com" {
  project = "disposal-estimate"
  service = "storage-api.googleapis.com"
}
# terraform import google_project_service.storage_api_googleapis_com disposal-estimate/storage-api.googleapis.com
