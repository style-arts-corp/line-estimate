resource "google_project_service" "storage_googleapis_com" {
  project = "458490939918"
  service = "storage.googleapis.com"
}
# terraform import google_project_service.storage_googleapis_com 458490939918/storage.googleapis.com
