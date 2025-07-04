resource "google_project_service" "monitoring_googleapis_com" {
  project = "458490939918"
  service = "monitoring.googleapis.com"
}
# terraform import google_project_service.monitoring_googleapis_com 458490939918/monitoring.googleapis.com
