resource "google_project_service" "serviceusage_googleapis_com" {
  project = "458490939918"
  service = "serviceusage.googleapis.com"
}
# terraform import google_project_service.serviceusage_googleapis_com 458490939918/serviceusage.googleapis.com
