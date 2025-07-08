resource "google_project_service" "bigquerystorage_googleapis_com" {
  project = "disposal-estimate"
  service = "bigquerystorage.googleapis.com"
}
# terraform import google_project_service.bigquerystorage_googleapis_com disposal-estimate/bigquerystorage.googleapis.com
