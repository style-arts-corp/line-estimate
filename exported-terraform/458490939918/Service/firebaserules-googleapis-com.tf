resource "google_project_service" "firebaserules_googleapis_com" {
  project = "458490939918"
  service = "firebaserules.googleapis.com"
}
# terraform import google_project_service.firebaserules_googleapis_com 458490939918/firebaserules.googleapis.com
