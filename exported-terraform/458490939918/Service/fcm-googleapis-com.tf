resource "google_project_service" "fcm_googleapis_com" {
  project = "458490939918"
  service = "fcm.googleapis.com"
}
# terraform import google_project_service.fcm_googleapis_com 458490939918/fcm.googleapis.com
