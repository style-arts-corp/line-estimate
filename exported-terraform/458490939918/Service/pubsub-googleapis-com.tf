resource "google_project_service" "pubsub_googleapis_com" {
  project = "disposal-estimate"
  service = "pubsub.googleapis.com"
}
# terraform import google_project_service.pubsub_googleapis_com disposal-estimate/pubsub.googleapis.com
