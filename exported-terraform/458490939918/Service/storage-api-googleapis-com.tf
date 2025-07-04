resource "google_project_service" "storage_api_googleapis_com" {
  project = "458490939918"
  service = "storage-api.googleapis.com"
}
# terraform import google_project_service.storage_api_googleapis_com 458490939918/storage-api.googleapis.com
