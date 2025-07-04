resource "google_project_service" "sql_component_googleapis_com" {
  project = "458490939918"
  service = "sql-component.googleapis.com"
}
# terraform import google_project_service.sql_component_googleapis_com 458490939918/sql-component.googleapis.com
