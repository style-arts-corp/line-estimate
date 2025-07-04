resource "google_project_service" "datastore_googleapis_com" {
  project = "458490939918"
  service = "datastore.googleapis.com"
}
# terraform import google_project_service.datastore_googleapis_com 458490939918/datastore.googleapis.com
