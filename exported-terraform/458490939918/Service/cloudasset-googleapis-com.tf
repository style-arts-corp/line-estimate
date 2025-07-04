resource "google_project_service" "cloudasset_googleapis_com" {
  project = "458490939918"
  service = "cloudasset.googleapis.com"
}
# terraform import google_project_service.cloudasset_googleapis_com 458490939918/cloudasset.googleapis.com
