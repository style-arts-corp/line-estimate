resource "google_project_service" "cloudresourcemanager_googleapis_com" {
  project = "disposal-estimate"
  service = "cloudresourcemanager.googleapis.com"
}
# terraform import google_project_service.cloudresourcemanager_googleapis_com disposal-estimate/cloudresourcemanager.googleapis.com
