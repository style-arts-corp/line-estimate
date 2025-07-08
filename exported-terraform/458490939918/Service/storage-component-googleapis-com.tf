resource "google_project_service" "storage_component_googleapis_com" {
  project = "disposal-estimate"
  service = "storage-component.googleapis.com"
}
# terraform import google_project_service.storage_component_googleapis_com disposal-estimate/storage-component.googleapis.com
