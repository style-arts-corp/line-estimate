resource "google_project_service" "bigquery_googleapis_com" {
  project = "458490939918"
  service = "bigquery.googleapis.com"
}
# terraform import google_project_service.bigquery_googleapis_com 458490939918/bigquery.googleapis.com
