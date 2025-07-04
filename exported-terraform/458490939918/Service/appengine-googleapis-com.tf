resource "google_project_service" "appengine_googleapis_com" {
  project = "458490939918"
  service = "appengine.googleapis.com"
}
# terraform import google_project_service.appengine_googleapis_com 458490939918/appengine.googleapis.com
