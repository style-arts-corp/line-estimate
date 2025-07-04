resource "google_project_service" "firestore_googleapis_com" {
  project = "458490939918"
  service = "firestore.googleapis.com"
}
# terraform import google_project_service.firestore_googleapis_com 458490939918/firestore.googleapis.com
