resource "google_project_service" "pubsub_googleapis_com" {
  project = "458490939918"
  service = "pubsub.googleapis.com"
}
# terraform import google_project_service.pubsub_googleapis_com 458490939918/pubsub.googleapis.com
