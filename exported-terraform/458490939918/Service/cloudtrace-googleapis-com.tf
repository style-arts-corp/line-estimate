resource "google_project_service" "cloudtrace_googleapis_com" {
  project = "458490939918"
  service = "cloudtrace.googleapis.com"
}
# terraform import google_project_service.cloudtrace_googleapis_com 458490939918/cloudtrace.googleapis.com
