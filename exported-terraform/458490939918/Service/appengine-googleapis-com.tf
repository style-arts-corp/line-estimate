resource "google_project_service" "appengine_googleapis_com" {
  project = "disposal-estimate"
  service = "appengine.googleapis.com"
}
# terraform import google_project_service.appengine_googleapis_com disposal-estimate/appengine.googleapis.com
