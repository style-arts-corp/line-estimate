resource "google_project_service" "firebase_googleapis_com" {
  project = "458490939918"
  service = "firebase.googleapis.com"
}
# terraform import google_project_service.firebase_googleapis_com 458490939918/firebase.googleapis.com
