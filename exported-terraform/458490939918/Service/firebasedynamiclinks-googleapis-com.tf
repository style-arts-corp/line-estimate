resource "google_project_service" "firebasedynamiclinks_googleapis_com" {
  project = "disposal-estimate"
  service = "firebasedynamiclinks.googleapis.com"
}
# terraform import google_project_service.firebasedynamiclinks_googleapis_com disposal-estimate/firebasedynamiclinks.googleapis.com
