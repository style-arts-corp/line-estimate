resource "google_project_service" "dataplex_googleapis_com" {
  project = "disposal-estimate"
  service = "dataplex.googleapis.com"
}
# terraform import google_project_service.dataplex_googleapis_com disposal-estimate/dataplex.googleapis.com
