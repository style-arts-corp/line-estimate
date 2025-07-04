resource "google_project_service" "logging_googleapis_com" {
  project = "458490939918"
  service = "logging.googleapis.com"
}
# terraform import google_project_service.logging_googleapis_com 458490939918/logging.googleapis.com
