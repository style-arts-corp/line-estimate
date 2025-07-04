resource "google_project_service" "runtimeconfig_googleapis_com" {
  project = "458490939918"
  service = "runtimeconfig.googleapis.com"
}
# terraform import google_project_service.runtimeconfig_googleapis_com 458490939918/runtimeconfig.googleapis.com
