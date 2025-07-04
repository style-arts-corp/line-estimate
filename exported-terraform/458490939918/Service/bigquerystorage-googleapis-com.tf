resource "google_project_service" "bigquerystorage_googleapis_com" {
  project = "458490939918"
  service = "bigquerystorage.googleapis.com"
}
# terraform import google_project_service.bigquerystorage_googleapis_com 458490939918/bigquerystorage.googleapis.com
