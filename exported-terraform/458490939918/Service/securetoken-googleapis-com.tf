resource "google_project_service" "securetoken_googleapis_com" {
  project = "disposal-estimate"
  service = "securetoken.googleapis.com"
}
# terraform import google_project_service.securetoken_googleapis_com disposal-estimate/securetoken.googleapis.com
