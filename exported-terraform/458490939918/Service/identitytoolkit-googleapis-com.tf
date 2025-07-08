resource "google_project_service" "identitytoolkit_googleapis_com" {
  project = "disposal-estimate"
  service = "identitytoolkit.googleapis.com"
}
# terraform import google_project_service.identitytoolkit_googleapis_com disposal-estimate/identitytoolkit.googleapis.com
