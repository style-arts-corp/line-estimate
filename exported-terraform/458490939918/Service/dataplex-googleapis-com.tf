resource "google_project_service" "dataplex_googleapis_com" {
  project = "458490939918"
  service = "dataplex.googleapis.com"
}
# terraform import google_project_service.dataplex_googleapis_com 458490939918/dataplex.googleapis.com
