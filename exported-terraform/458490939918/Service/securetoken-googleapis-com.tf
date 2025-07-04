resource "google_project_service" "securetoken_googleapis_com" {
  project = "458490939918"
  service = "securetoken.googleapis.com"
}
# terraform import google_project_service.securetoken_googleapis_com 458490939918/securetoken.googleapis.com
