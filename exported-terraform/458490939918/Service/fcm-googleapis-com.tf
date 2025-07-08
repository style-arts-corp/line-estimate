resource "google_project_service" "fcm_googleapis_com" {
  project = "disposal-estimate"
  service = "fcm.googleapis.com"
}
# terraform import google_project_service.fcm_googleapis_com disposal-estimate/fcm.googleapis.com
