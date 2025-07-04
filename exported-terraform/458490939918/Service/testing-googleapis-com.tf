resource "google_project_service" "testing_googleapis_com" {
  project = "458490939918"
  service = "testing.googleapis.com"
}
# terraform import google_project_service.testing_googleapis_com 458490939918/testing.googleapis.com
