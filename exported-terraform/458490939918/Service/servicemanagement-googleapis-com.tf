resource "google_project_service" "servicemanagement_googleapis_com" {
  project = "458490939918"
  service = "servicemanagement.googleapis.com"
}
# terraform import google_project_service.servicemanagement_googleapis_com 458490939918/servicemanagement.googleapis.com
