resource "google_project_service" "cloudapis_googleapis_com" {
  project = "458490939918"
  service = "cloudapis.googleapis.com"
}
# terraform import google_project_service.cloudapis_googleapis_com 458490939918/cloudapis.googleapis.com
